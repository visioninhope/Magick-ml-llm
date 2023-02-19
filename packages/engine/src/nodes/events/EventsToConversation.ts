import Rete from 'rete'

import { NodeData, MagickNode, MagickWorkerInputs } from '../../types'
import { TextInputControl } from '../../dataControls/TextInputControl'
import { stringSocket, arraySocket } from '../../sockets'
import { MagickComponent } from '../../magick-component'
const info = `Join an array of events into a conversation formatted for prompt injection.`

type WorkerReturn = {
  conversation: string
}

export class EventsToConversation extends MagickComponent<WorkerReturn> {
  constructor() {
    // Name of the component
    super('Events to Conversation')

    this.task = {
      outputs: {
        conversation: 'output',
        trigger: 'option',
      },
      init: () => {},
    }

    this.category = 'Events'
    this.info = info
  }

  // the builder is used to "assemble" the node component.

  builder(node: MagickNode) {
    // create inputs here. First argument is the name, second is the type (matched to other components sockets), and third is the socket the i/o will use
    const out = new Rete.Output('conversation', 'Conversation', stringSocket)

    const inputList = new Rete.Input('events', 'Events', arraySocket)

    return node.addOutput(out).addInput(inputList)
  }

  // the worker contains the main business logic of the node.  It will pass those results
  // to the outputs to be consumed by any connected components
  worker(node: NodeData, inputs: MagickWorkerInputs & { events: any[] }) {

    const events = inputs.events[0];

    let conversation = '';

    // for each event in events,
    if(events) events.forEach((event) => {
      conversation += event.sender + ': ' + event.content + '\n';
    });

    return {
        conversation,
    }
  }
}
