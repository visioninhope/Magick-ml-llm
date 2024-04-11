import {
  useCreateAgentSeraphEventMutation,
  useGetAgentSeraphEventsQuery,
} from 'client/state'
import { useFeathers } from '@magickml/providers'
import { useEffect, useState } from 'react'
import {
  ISeraphEvent,
  SeraphEvents,
  SeraphRequest,
} from '../../../../shared/servicesShared/src'

export const useSeraph = ({ tab, projectId, agentId, history, setHistory }) => {
  const { client } = useFeathers()
  const [eventData, setEventData] = useState<ISeraphEvent>()

  const {
    data: seraphChatHistory,
    error,
    isLoading,
  } = useGetAgentSeraphEventsQuery({ agentId })

  const [createSeraphRequest, { error: requestRecordError }] =
    useCreateAgentSeraphEventMutation()

  // set up listeners for response, error, info,
  useEffect(() => {
    if (!client) return

    const unsubscribeResponse = client
      .service('agents')
      .on('seraphEvent', (data: ISeraphEvent) => {
        setEventData(data)
      })

    return () => {
      unsubscribeResponse()
    }
  }, [client])

  useEffect(() => {
    if (!eventData) return
    setHistory(prevHistory => [...prevHistory, eventData])
  }, [eventData])

  // fetch seraph chat history
  useEffect(() => {
    if (
      seraphChatHistory?.length === history.length ||
      seraphChatHistory?.length === 0 ||
      !seraphChatHistory ||
      isLoading ||
      error
    )
      return

    setHistory(seraphChatHistory)
  }, [seraphChatHistory])

  // function to make a request
  const makeSeraphRequest = async (request: SeraphRequest) => {
    try {
      const seraphRequest: ISeraphEvent = {
        agentId,
        projectId,
        type: SeraphEvents.request,
        spellId: tab.params.spellId,
        data: { request },
        createdAt: new Date().toISOString(),
      }
      setEventData(undefined)
      const data = await createSeraphRequest(seraphRequest)
      if (!data) throw new Error('Error creating seraph request')
      return true
    } catch (error) {
      console.error('Error making seraph request', error)
    }
  }

  const seraphError = eventData?.data?.error

  return {
    error: seraphError || requestRecordError,
    eventData,
    setEventData,
    makeSeraphRequest,
  }
}
