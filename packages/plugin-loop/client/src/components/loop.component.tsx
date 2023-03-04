import React, { FC } from 'react'
type PluginProps = {
  selectedAgentData: any
  props: {
    selectedAgentData: any
    setSelectedAgentData: any
  }
}
import { Grid } from '@mui/material'
import { Switch } from '@magickml/client-core'
export const AgentLoopWindow: FC<PluginProps> = props => {
  const { selectedAgentData, setSelectedAgentData } = props.props
  return (
    <div
      style={{
        backgroundColor: '#222',
        padding: '2em',
        position: 'relative',
      }}
    >
      <h3>Agent Update Loop</h3>
      <div style={{ position: 'absolute', right: '1em', top: '0' }}>
        <Switch
          checked={selectedAgentData.data?.loop_enabled}
          onChange={e => {
            if (!e.target.checked) {
              setSelectedAgentData({
                ...selectedAgentData,
                data: {
                  ...selectedAgentData.data,
                  loop_interval: '',
                  loop_enabled: false,
                },
              })
            } else {
              setSelectedAgentData({
                ...selectedAgentData,
                data: { ...selectedAgentData.data, loop_enabled: e.target.checked },
              })
            }
          }}
          label={''}
        />
      </div>
      {selectedAgentData.data?.loop_enabled && (
        <div className="form-item">
          <Grid container>
            <>
              <div className="form-item">
                <span className="form-item-label">Loop Interval</span>
                <input
                  type="text"
                  pattern="[0-9]*"
                  defaultValue={selectedAgentData.data?.loop_interval}
                  placeholder="Run every X seconds"
                  onChange={e => {
                    setSelectedAgentData({
                      ...selectedAgentData,
                      data: {
                        ...selectedAgentData.data,
                        loop_interval: e.target.value,
                      },
                    })
                  }}
                />
              </div>
            </>
          </Grid>
        </div>
      )}
    </div>
  )
}
