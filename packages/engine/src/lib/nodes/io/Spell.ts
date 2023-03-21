import isEqual from 'lodash/isEqual'
import Rete from 'rete'

import { SpellControl } from '../../dataControls/SpellControl'
import { MagickComponent } from '../../magick-component'
import { triggerSocket } from '../../sockets'
import {
  EngineContext, MagickNode,
  MagickWorkerInputs, ModuleWorkerOutput,
  NodeData,
  Spell
} from '../../types'

const info = `The Module component allows you to add modules into your graph.  A module is a bundled self contained graph that defines inputs, outputs, and triggers using components.`

type Socket = {
  socketKey: string
  name: string
}

export const createNameFromSocket = (type: 'inputs' | 'outputs') => {
  return (node: NodeData, socketKey: string) => {
    return (node.data[type] as Socket[]).find(
      socket => socket.socketKey === socketKey
    )?.name
  }
}

export const createSocketFromName = (type: 'inputs' | 'outputs') => {
  return (node: NodeData, name: string) => {
    return (node.data[type] as Socket[]).find(socket => socket.name === name)
      ?.socketKey
  }
}

export const inputNameFromSocketKey = createNameFromSocket('inputs')
export const outputNameFromSocketKey = createNameFromSocket('outputs')
export const socketKeyFromInputName = createSocketFromName('inputs')
export const socketKeyFromOutputName = createSocketFromName('outputs')

export class SpellComponent extends MagickComponent<
  Promise<ModuleWorkerOutput>
> {
  declare updateModuleSockets: Function
  subscriptionMap: Record<number, Function> = {}
  noBuildUpdate: boolean

  constructor() {
    super('Spell')
    this.module = {
      nodeType: 'module',
      skip: true,
    }
    this.task = {
      outputs: { trigger: 'option' },
    }
    this.category = 'I/O'
    this.info = info
    this.noBuildUpdate = true
    this.display = true
    this.onDoubleClick = (node: MagickNode) => {
      if (!this.editor) return
      console.log('double click', node)
      const pubsub = this.editor.pubSub
      const event = pubsub.events.OPEN_TAB
      const encodedToId = (uri: string) => {
        uri = decodeURIComponent(uri)
        return uri.slice(0,36)
      }
      pubsub.publish(event, {
        type: 'spell',
        id: encodedToId(node.data.spellName as string),
        spellName: node.data.spellName,
        name: encodedToId(node.data.spellName as string),
        openNew: false,
      })
    }
  }

  subscribe(node: MagickNode, spellName: string) {
    if (!this.editor) return
    if (this.subscriptionMap[node.id]) this.subscriptionMap[node.id]()

    let cache: Spell

    // Subscribe to any changes to that spell here
    this.subscriptionMap[node.id] = this.editor.onSpellUpdated(
      spellName,
      (spell: Spell) => {
        if (!isEqual(spell, cache)) {
          // this can probably be better optimise this
          this.updateSockets(node, spell)
        }

        cache = spell
      }
    )
  }

  builder(node: MagickNode) {
    const triggerIn = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const triggerOut = new Rete.Output('trigger', 'Trigger', triggerSocket)

    node
      .addInput(triggerIn)
      .addOutput(triggerOut)

    const spellControl = new SpellControl({
      name: 'Spell Select',
      write: false,
      defaultValue: (node.data.spell as string) || '',
    })

    // const stateSocket = new Rete.Input('state', 'State', objectSocket)

    spellControl.onData = (spell: Spell) => {
      // break out of it the nodes data already exists.
      if (spell.name === node.data.spellName) return
      node.data.spellName = spell.name
      node.data.spellId = spell.id
      node.data.projectId = spell.projectId

      // TODO: Set the public variables from the public variables of the spell
      //node.data.publicVariables = 

      // Update the sockets
      this.updateSockets(node, spell)

      // here we handle writing the spells name to the spell itself
      node.data.spell = spell.name

      // Uodate the data name to display inside the node
      node.data.name = spell.name

      // subscribe to changes form the spell to update the sockets if there are changes
      // Note: We could store all spells in a spell map here and rather than receive the whole spell, only receive the diff, make the changes, update the sockets, etc.  Mayb improve speed?
      this.subscribe(node, spell.name)
    }

    // node.addInput(stateSocket)
    node.inspector.add(spellControl)

    if (node.data.spellName) {
      setTimeout(() => {
        this.subscribe(node, node.data.spellName as string)
      }, 1000)
    }

    return node
  }

  updateSockets(node: MagickNode, spell: Spell) {
    const graph = JSON.parse(JSON.stringify(spell.graph))
    this.updateModuleSockets(node, graph, true)
    node.update()
  }

  formatOutputs(node: NodeData, outputs: Record<string, any>) {
    return Object.entries(outputs).reduce((acc, [uuid, value]) => {
      const socketKey = socketKeyFromOutputName(node, uuid)
      if (!socketKey) return acc
      acc[socketKey] = value
      return acc
    }, {} as Record<string, any>)
  }

  formatInputs(node: NodeData, inputs: Record<string, any>) {
    return Object.entries(inputs).reduce((acc, [key, value]) => {
      const name = inputNameFromSocketKey(node, key)
      if (!name) return acc

      acc[name] = value[0]
      return acc
    }, {} as Record<string, any>)
  }

  async worker(
    node: NodeData,
    inputs: MagickWorkerInputs,
    _outputs: { [key: string]: string },
    {
      magick,
      secrets,
      publicVariables,
    }: {
      module: { outputs: ModuleWorkerOutput[] }
      magick: EngineContext
      secrets: Record<string, string>
      publicVariables: Record<string, string>
    }
  ) {
    // We format the inputs since these inputs rely on the use of the socket keys.
    const flattenedInputs = this.formatInputs(node, inputs)

    if (!magick.runSpell) throw new Error('Magick runSpell not found')
    const outputs = await magick.runSpell(
      {
        inputs: flattenedInputs,
        spellId: node.data.spellId as string,
        projectId: node.data.projectId as string,
        secrets,
        publicVariables,
      }
    )

    return this.formatOutputs(node, outputs)
  }
}
