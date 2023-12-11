import pino from 'pino'
import { getLogger } from 'packages/server/logger/src'
import { ActionPayload, EventPayload } from 'packages/server/plugin/src'
import { RedisPubSub } from 'packages/server/redis-pubsub/src'
import { ON_SLACK_MESSAGE } from '../events'

class SlackEventClient {
  private logger: pino.Logger = getLogger()
  private pubSub: RedisPubSub
  private agentId: string
  private eventHandlers: Map<string, ((message: EventPayload) => void)[]>

  constructor(pubSub: RedisPubSub, agentId: string) {
    this.pubSub = pubSub
    this.agentId = agentId
    this.eventHandlers = new Map()
    this.subscribeToSlackEvents()
  }

  private subscribeToSlackEvents(): void {
    const pattern = `agent:${this.agentId}:Slack:*`
    this.logger.debug(`Subscribing to pattern '${pattern}'`)
    this.pubSub.patternSubscribe(pattern, this.slackEventHandler.bind(this))
  }

  slackEventHandler(event, channel) {
    const eventType = this.extractEventType(channel)

    this.logger.debug(`Received event of type '${eventType}'`)
    event.plugin = 'slack'

    this.eventHandlers.get(eventType)?.forEach(handler => handler(event))
  }

  private extractEventType(channel: string): string {
    return channel.split(':')[3]
  }

  registerHandler(
    eventType: string,
    handler: (message: EventPayload) => void
  ): void {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, [])
    }
    this.eventHandlers.get(eventType)?.push(handler)
  }

  onMessage(handler: (event: EventPayload) => void): void {
    this.logger.debug('Registering handler for slack onMessage event')
    this.registerHandler(ON_SLACK_MESSAGE, handler)
  }

  sendMessage(payload: ActionPayload): void {
    console.log('Sending message from slack client!!!', payload)
    this.pubSub.publish(`agent:${this.agentId}:Slack:event`, payload)
  }

  cleanup(): void {
    const pattern = `agent:${this.agentId}:Slack:*`
    this.pubSub.removePatternCallback(
      pattern,
      this.slackEventHandler.bind(this)
    )
    this.eventHandlers.clear()
  }
}

export default SlackEventClient
