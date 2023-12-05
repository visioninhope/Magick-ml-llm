import { CoreEventsPlugin, EventPayload, ON_MESSAGE } from 'server/plugin'
import { MessageEvent } from './nodes/events/messageEvent'
import Redis from 'ioredis'
import { CoreEmitter } from './dependencies/coreEmitter'
import { IRegistry, registerCoreProfile } from '@magickml/behave-graph'
import CoreEventReceiver from './services/coreEventReceiver'
import { RedisPubSub } from 'server/redis-pubsub'

const pluginName = 'Core'

/**
 * CorePlugin handles all generic events and has its own nodes, dependencies, and values.
 */
export class CorePlugin extends CoreEventsPlugin {
  override enabled = true
  coreEventReceiver: CoreEventReceiver
  nodes = [MessageEvent]
  values = []

  constructor(connection: Redis, agentId: string, pubSub: RedisPubSub) {
    super(pluginName, connection, agentId)

    this.coreEventReceiver = new CoreEventReceiver(pubSub, agentId)
  }

  /**
   * Defines the events that the plugin will listen for.
   */
  defineEvents() {
    // Define events here
    this.registerEvent({
      eventName: ON_MESSAGE,
      displayName: 'Message Received',
    })
  }

  getDependencies() {
    return {
      [pluginName]: new CoreEmitter(),
    }
  }

  /**
   * Provides the core registry from Behave Graph. Wraps our existing nodes and values.
   * @param registry The registry to provide.
   */
  override provideRegistry(registry: IRegistry): IRegistry {
    return registerCoreProfile(registry)
  }

  initializeFunctionalities() {
    this.centralEventBus.on(ON_MESSAGE, this.handleMessage.bind(this))
    this.coreEventReceiver.onMessage(this.handleMessage.bind(this))
  }

  handleMessage(payload: EventPayload) {
    this.emitEvent(ON_MESSAGE, payload)
  }

  /**
   * We dont need to format the payload for this plugin. This is
   * because the payload is already formatted in the core plugin.
   * @param event
   * @param payload
   */
  formatPayload(event, payload) {
    return payload
  }
}
