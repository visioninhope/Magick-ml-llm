import { isEmpty } from 'lodash'
import Rete from 'rete'
import { v4 as uuidv4 } from 'uuid'

import {
  anySocket,
  InputControl,
  MagickComponent,
  MagickNode,
  MagickWorkerInputs,
  MagickWorkerOutputs,
  NodeData,
  DropdownControl,
  stringSocket,
  numSocket,
  triggerSocket,
} from '@magickml/engine'

const info = `Check the balance of an ethereum wallet`

type InputReturn = {
  output: unknown
}

export class CheckEthBalance extends MagickComponent<InputReturn> {

  constructor() {
    // Name of the component
    super('CheckEthBalance')

    this.task = {
      outputs: {
        output: 'output',
        trigger: 'option',
      },
    }

    this.module = {
      nodeType: 'triggerIn',
      socket: anySocket,
      hide: true,
    }

    this.category = 'Ethereum'
    this.info = info
    this.display = true
    this.contextMenuName = 'CheckEthBalance'
    this.displayName = 'CheckEthBalance'
  }

  destroyed(node: MagickNode) {
    console.log('destroyed', node.id)
  }

  builder(node: MagickNode) {
    // module components need to have a socket key.
    // todo add this somewhere automated? Maybe wrap the modules builder in the plugin
    node.data.socketKey = node?.data?.socketKey || uuidv4()


    const rpcHttpControl = new InputControl({
      dataKey: 'rpc_http',
      name: 'RPC Endpoint',
    })

    const chainIdControl = new DropdownControl({
      name: 'Chain',
      dataKey: 'chain_id',
      values: [
        '1',
        '11155111',
        '5',
        '137',
        '80001'
      ],
      defaultValue: '80001',
    })

    node.inspector
      .add(rpcHttpControl)
      .add(chainIdControl)

    const addressInput = new Rete.Input('address', 'Address', stringSocket)
    const dataInput = new Rete.Input('trigger', 'Trigger', triggerSocket, true)
    const dataOutput = new Rete.Output('trigger', 'Trigger', triggerSocket)
    const rpcHttpInput = new Rete.Input('rpc_http', 'RPC HTTP Endpoint', stringSocket)
    const chainIdInput = new Rete.Input('chain_id', 'Chain ID', numSocket)
    const balanceOutput = new Rete.Output('output', 'Output', stringSocket)

    return node
      .addInput(addressInput)
      .addInput(rpcHttpInput)
      .addInput(chainIdInput)
      .addInput(dataInput)
      .addOutput(dataOutput)
      .addOutput(balanceOutput)
  }

  // @ts-ignore
  async worker(
    node: NodeData,
    _inputs: MagickWorkerInputs,
    outputs: MagickWorkerOutputs,
    { silent, data }: { silent: boolean; data: string | undefined }
  ) {
    this._task.closed = ['trigger']
    console.log('********* processing input to ethereum input *********')
    console.log(data)

    // handle data subscription.  If there is data, this is from playtest
    if (data && !isEmpty(data)) {
      this._task.closed = []

      if (!silent) node.display(data)
      return {
        output: data,
      }
    }
  }
}
