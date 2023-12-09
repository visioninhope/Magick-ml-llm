import { useState, useCallback, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import Avatar from '@mui/material/Avatar'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Menu from '@mui/material/Menu'
import Divider from '@mui/material/Divider'
import { useDispatch } from 'react-redux'
import { STANDALONE, } from 'shared/config'
import { useFeathers } from '@magickml/providers'
import { AgentInterface } from 'shared/core'
import { setCurrentAgentId, setCurrentSpellReleaseId, useCreateAgentReleaseMutation } from 'client/state'
import { Button } from 'client/core'
import { useModal } from '../../contexts/ModalProvider'
import AgentListItem from '../../screens/agents/AgentWindow/AgentListItem'
import { useSnackbar } from 'notistack'

export function AgentMenu({ data }) {

  const { client } = useFeathers()
  const dispatch = useDispatch()
  const { openModal, closeModal } = useModal()
  const { enqueueSnackbar } = useSnackbar()

  const [openMenu, setOpenMenu] = useState(null)
  const [currentAgent, _setCurrentAgent] = useState<AgentInterface | null>(null)
  const [selectedAgents, setSelectedAgents] = useState<string[]>([])
  const [draftAgent, setDraftAgent] = useState(null)
  const [publishedAgents, setPublishedAgents] = useState([])

  const [createAgentRelease] = useCreateAgentReleaseMutation()

  const setCurrentAgent = useCallback((agent: AgentInterface) => {
    client.service('agents').subscribe(agent.id)
    _setCurrentAgent(agent)
    // store this current agent in the global state for use in the editor
    dispatch(setCurrentAgentId(agent.id))
    dispatch(setCurrentSpellReleaseId(agent?.currentSpellReleaseId))
  }, [])

  // Update draftAgent and publishedAgents when data changes
  useEffect(() => {
    if (!data) return;
    if (!draftAgent) {

      const draft = data.find(agent => agent.default);
      setDraftAgent(draft)
      _setCurrentAgent(draft)
    }
    if (!publishedAgents.length) {
      const published = data.filter(agent => agent.currentSpellReleaseId);
      setPublishedAgents(published)
    }
  }, [data])

  const toggleMenu = (target = null) => {
    if (openMenu) {
      // Menu is currently open, so close it
      setOpenMenu(null);
      setSelectedAgents([]);
    } else {
      // Menu is currently closed, so open it at the specified target
      setOpenMenu(target);
    }
  };

  const handleSelectAgent = (agent: AgentInterface) => {
    setCurrentAgent(agent)
    toggleMenu()
  }

  const redirectToCloudAgents = () => {
    if (STANDALONE) {
      window.parent.postMessage({ type: 'redirect', href: '/agents' }, '*')
    }
  }


  const confirmPublish = async (onConfirm) => {
    toggleMenu()
    openModal({
      modal: 'confirmationModal',
      title: 'Publish to agent',
      confirmButtonText: 'Publish',
      cancelButtonText: 'Cancel',
      onConfirm,
    });
  };

  const publishToLiveAgent = async (description: string) => {
    try {
      const result = await createAgentRelease({ agentId: publishedAgents[0].id, description }).unwrap();
      if (result) {
        enqueueSnackbar('Successfully published to live agent', { variant: 'success' });
      }
    } catch (error) {
      enqueueSnackbar('Error publishing to live agent!', { variant: 'error' });
    }
  };

  const batchPublishToSelectedAgents = async (description: string) => {
    try {
      const releasePromises = selectedAgents.map(agentId =>
        createAgentRelease({ agentId, description }).unwrap()
      );
      const results = await Promise.all(releasePromises);

      results.forEach(result => {
        if (!result) {
          enqueueSnackbar('Failed to create release', { variant: 'error' });
        } else {
          enqueueSnackbar('Successfully updated agents', { variant: 'success' });
        }
      });
    } catch (error) {
      enqueueSnackbar('Error creating release!', { variant: 'error' });
    } finally {
      setSelectedAgents([]);
      closeModal();
    }
  };

  const handleBatchPublish = async () => {
    if (publishedAgents.length === 1 && draftAgent) {
      confirmPublish(publishToLiveAgent);
    } else if (selectedAgents.length > 1) {
      confirmPublish(batchPublishToSelectedAgents);
    }
  };


  // Add a function to handle checkbox changes
  const handleCheckboxChange = (agentId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedAgents((prevSelected) => [...prevSelected, agentId]);
    } else {
      setSelectedAgents((prevSelected) =>
        prevSelected.filter((id) => id !== agentId)
      );
    }
  }

  const BorderedAvatar = styled(Avatar)`
      border: 1px solid lightseagreen;
      ${STANDALONE && 'cursor: pointer;'}
      `

  const StyledDivider = styled(Divider)(({ theme }) => ({
    backgroundColor: '#3D454A',
    borderColor: '#3D454A',
    height: '1px',
    marginTop: '4px',
    marginBottom: '4px',
    marginLeft: '10px',
    marginRight: '10px',
  }))


  return (
    <div>
      <List sx={{ width: '100%' }}>
        <ListItem
          alignItems="center"
        >
          <ListItemAvatar onClick={redirectToCloudAgents}>
            <BorderedAvatar
              alt={currentAgent ? currentAgent?.name?.at(0) || 'A' : 'newagent'}
              src={
                currentAgent && currentAgent.image
                  ? `https://pub-58d22deb43dc48e792b7b7468610b5f9.r2.dev/magick-dev/agents/${currentAgent.image}`
                  : undefined // Ensure it's undefined if there's no valid image URL.
              }
              sx={{ width: 24, height: 24 }}
            >
              {currentAgent?.name?.at(0) || 'A'}
            </BorderedAvatar>
          </ListItemAvatar>
          <ListItemText
            primary={currentAgent ? currentAgent?.name : 'New agent'}
          />
          <IconButton
            aria-label="expand"
            size="small"
            onClick={(event) => toggleMenu(event.target)}
          >
            <ExpandMoreIcon sx={{ placeContent: 'end' }} />
          </IconButton>
        </ListItem>
      </List>
      <Menu
        id="menu1"
        anchorEl={openMenu}
        open={Boolean(openMenu)}
        onClose={toggleMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          '& .MuiMenu-paper': {
            background: '#252525',
            width: '300px',
            shadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
            borderRadius: '2px',
            border: '1px solid #3B3B3B',
            left: '0px !important',
            marginTop: '6px',
            marginLeft: '40px',
          },
        }}
      >
        <h3 style={{
          marginTop: 2,
          marginBottom: 4,
          marginLeft: 16,
        }}>Draft</h3>
        {
          draftAgent && (
            <AgentListItem
              key={draftAgent.id}
              agent={draftAgent}
              onSelectAgent={handleSelectAgent}
              isDraft
            />
          )
        }
        {
          publishedAgents && publishedAgents.length > 0 && (
            <div>
              <StyledDivider />
              <h3 style={{
                marginTop: 2,
                marginBottom: 4,
                marginLeft: 16,
              }}>
                Published
              </h3>
              {publishedAgents.map((agent, i) => {
                return (
                  <AgentListItem
                    key={i + agent.id}
                    agent={agent}
                    selectedAgents={selectedAgents}
                    onSelectAgent={handleSelectAgent}
                    onCheckboxChange={handleCheckboxChange}
                    isSinglePublishedAgent={publishedAgents.length === 1}
                  />
                )
              }
              )}
            </div>
          )
        }

        <StyledDivider />
        <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '0 16px' }}>

          <Button
            // disabled={!(selectedAgents.length > 0)}
            hoverStyle={{}}
            style={{
              backgroundColor: '#0074a0',
              border: 'none',
              marginTop: '8px',
              marginBottom: '8px',
              width: '100%',
              textAlign: 'center',
              justifyContent: 'center',
            }}
            onClick={() => {
              void handleBatchPublish()
            }}
          >
            {publishedAgents.length === 1 ? 'Publish to Live Agent' : 'Publish to Selected Agents'}
          </Button>
        </div>
      </Menu >
    </div >
  )
}
