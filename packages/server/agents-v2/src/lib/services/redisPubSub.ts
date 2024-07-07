import 'reflect-metadata'
import { inject, injectable } from 'inversify'
import Redis from 'ioredis'
import { IPubSub } from '../interfaces/IPubSub'
import { TYPES } from '../interfaces/types'
import { IRedis } from '../interfaces/IRedis'
import { RedisPubSub as _RedisPubSub } from '@magickml/redis-pubsub'

@injectable()
export class RedisPubSub implements IPubSub {
  private redisConnection: Redis
  private pubsub: _RedisPubSub

  constructor(@inject(TYPES.Redis) redisWrapper: IRedis) {
    this.redisConnection = redisWrapper.getClient()
    this.pubsub = new _RedisPubSub(undefined, {
      connection: this.redisConnection,
    })
  }

  async initialize(): Promise<void> {
    this.pubsub.initialize()
  }

  async publish(channel: string, message: string | object): Promise<void> {
    this.pubsub.publish(channel, message)
  }

  async subscribe(
    channel: string,
    callback: (message: any) => void
  ): Promise<void> {
    this.pubsub.subscribe(channel, callback)
  }

  async unsubscribe(channel: string): Promise<void> {
    this.pubsub.unsubscribe(channel)
  }

  async patternSubscribe(
    pattern: string,
    callback: (message: any, channel: string) => void
  ): Promise<void> {
    this.pubsub.patternSubscribe(pattern, callback)
  }

  async patternUnsubscribe(pattern: string): Promise<void> {
    this.pubsub.patternUnsubscribe(pattern)
  }

  removeCallback(channel: string, callback: Function): void {
    this.pubsub.removeCallback(channel, callback)
  }

  removePatternCallback(pattern: string, callback: Function): void {
    this.pubsub.removePatternCallback(pattern, callback)
  }

  close(): void {
    this.pubsub.close()
  }
}
