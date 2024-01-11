import {
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  Avatar,
  AvatarImage,
  AvatarFallback,
  SelectValue,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@magickml/ui'
import credentialsJson from 'packages/shared/nodeSpec/src/credentials.json'
import { FC, useState } from 'react'
import {
  AgentCredential,
  Credential,
  useListCredentialsQuery,
  useListAgentCredentialsQuery,
  useLinkAgentCredentialMutation,
  useUnlinkCredentialFromAgentMutation,
} from 'client/state'
import { useConfig, useTabLayout } from '@magickml/providers'
import clsx from 'clsx'

type PluginCredential = {
  name: string
  serviceType: string
  credentialType: 'core' | 'plugin' | 'custom'
  clientName?: string
  initials: string
  description?: string
  icon?: string
  helpLink?: string
}

// Function to separate credentials into core+plugin and custom
function separateCredentials(
  credentials: Credential[]
): [Credential[], Credential[]] {
  const corePluginCredentials = credentials.filter(
    c => c.credentialType === 'core' || c.credentialType === 'plugin'
  )
  const customCredentials = credentials.filter(
    c => c.credentialType === 'custom'
  )
  return [corePluginCredentials, customCredentials]
}

// Function to check if a name is already taken in the array of credentials
function isNameTaken(credentials: Credential[], name: string): boolean {
  return credentials.some(credential => credential.name === name)
}

// Function to check if there is a linked AgentCredential for a given Credential name
function hasLinkedAgentCredential(
  name: string,
  credentials?: Credential[],
  agentCredentials?: AgentCredential[]
): boolean {
  if (!credentials || !agentCredentials) return false
  const c = credentials.find(credential => credential.name === name)
  if (!c) return false
  return agentCredentials.some(ac => ac.credentialId === c?.id)
}

// Function to find credentials that match a given PluginCredential name
function findMatchingCredentials(
  pluginCredential: PluginCredential,
  credentials?: Credential[]
): Credential[] {
  if (!credentials) return []
  return credentials.filter(
    credential => credential.name === pluginCredential.name
  )
}

function findMatchingAgentCredential(
  pluginCredential: PluginCredential,
  credentials?: Credential[],
  agentCredentials?: AgentCredential[]
): AgentCredential | undefined {
  if (!credentials || !agentCredentials) return undefined
  const c = credentials.find(
    credential => credential.name === pluginCredential.name
  )
  if (!c) return undefined
  return agentCredentials.find(ac => ac.credentialId === c?.id)
}

const Header: FC = () => {
  const { openTab } = useTabLayout()

  const openSecrets = () => {
    openTab({
      id: 'Secrets',
      name: 'Secrets',
      type: 'Secrets',
      switchActive: true,
    })
  }

  return (
    <div className="pt-8 pb-4">
      <div className="flex flex-col gap-y-1">
        <div className="inline-flex items-center space-x-2">
          <h2>Linked Secrets</h2>
          <Button variant="outline" size="sm" onClick={openSecrets}>
            Create New
          </Button>
        </div>
        <p>
          You can link secrets to your agent to use in your spells and connect
          to external services. Click the button above to open the secrets
          window.
        </p>
      </div>
    </div>
  )
}

interface CredentialActionProps {
  projectId: string
  agentId: string
  linkedCredential?: AgentCredential
  availableCredentials: Credential[]
}

const CredentialAction: FC<CredentialActionProps> = ({
  projectId,
  agentId,
  linkedCredential,
  availableCredentials,
}) => {
  const [open, onOpenChange] = useState(false)
  const isLinked = linkedCredential && !!linkedCredential.credentialId
  const [selectedCredentialId, setSelectedCredentialId] = useState<
    string | null
  >(null)

  const [linkAgentCredential] = useLinkAgentCredentialMutation()
  const [unlinkCredentialFromAgent] = useUnlinkCredentialFromAgentMutation()

  const handleSelect = (credentialId: string) => {
    console.log('selected:', credentialId)
    setSelectedCredentialId(credentialId)
  }

  const handleLink = async () => {
    if (!selectedCredentialId) return
    try {
      console.log('linking:', selectedCredentialId)
      const x = await linkAgentCredential({
        projectId: projectId,
        agentId: agentId,
        credentialId: selectedCredentialId || '',
      })
      onOpenChange(false)
    } catch (e) {
      console.log(e)
    }
  }

  const handleUnlink = async () => {
    if (!isLinked || !linkedCredential) return
    try {
      await unlinkCredentialFromAgent({
        projectId: projectId,
        agentId: linkedCredential.agentId,
        credentialId: linkedCredential.credentialId,
      })
      onOpenChange(false)
    } catch (e) {
      console.log(e)
    }
  }

  const handleAction = async () => {
    isLinked ? await handleUnlink() : onOpenChange(true)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Button onClick={handleAction} variant="outline">
        {isLinked ? 'Unlink' : 'Link'}
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isLinked ? 'Unlink' : 'Link'} Credential</DialogTitle>
          <DialogDescription className='text-white/90'>
            Select a credential to {isLinked ? 'unlink' : 'link'} to this agent.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {availableCredentials?.length > 0 ? (
            <Select onValueChange={handleSelect}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a Credential" />
              </SelectTrigger>
              <SelectContent>
                {availableCredentials.map(credential => (
                  <SelectItem key={credential.id} value={credential.id}>
                    {`${credential.name} - ${new Date(
                      credential.created_at
                    ).toLocaleDateString()}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p>
              Create a secret for this platform in the secrets window to link to
              this agent
            </p>
          )}

          {selectedCredentialId && (
            <p className="mt-2 text-sm text-white/80">
              {availableCredentials.find(c => c.id === selectedCredentialId)
                ?.description || 'No description'}
            </p>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleLink}
            disabled={!selectedCredentialId}
          >
            Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface CredentialItemProps {
  action?: React.ReactNode
  isLinked: boolean
  credential: PluginCredential
}

const CredentialItem: FC<CredentialItemProps> = ({
  action,
  isLinked,
  credential,
}) => {
  return (
    <div className="flex items-center justify-between space-x-4 border-2 border-white/10 rounded-sm p-4">
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={credential.icon} alt={credential.clientName} />
          <AvatarFallback>{credential.initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-base font-semibold leading-none">
            {credential.clientName}
          </p>
          <p className="text-sm">{credential.description}</p>
          <p
            className={clsx(
              isLinked ? 'text-green-500' : 'text-gray-500',
              'text-sm'
            )}
          >
            {isLinked ? 'Linked' : 'Not Linked'}
          </p>
          {credential?.helpLink && (
            <a
              className="text-sm text-blue-500"
              href={credential.helpLink}
              target="_blank"
              rel="noreferrer"
              aria-label="Learn more"
            >
              Learn more
            </a>
          )}
        </div>
      </div>
      {action}
    </div>
  )
}

type CredentialProps = {
  agentId: string
}

export const Credentials: FC<CredentialProps> = ({ agentId }) => {
  const pluginCredentials: PluginCredential[] =
    credentialsJson as PluginCredential[]
  const config = useConfig()
  const { data: c, isLoading: cLoading } = useListCredentialsQuery({
    projectId: config.projectId,
  })

  const [credentials, customCredentials] = separateCredentials(c || [])

  const { data: ac, isLoading: acLoading } = useListAgentCredentialsQuery({
    projectId: config.projectId,
    agentId,
  })

  return (
    <>
      <div className="inline-flex w-full justify-between items-center space-x-2">
        <Header />
      </div>
      <div className="grid grid-cols-2 gap-6">
        {pluginCredentials?.map(p => (
          <CredentialItem
            key={p.name}
            credential={p}
            isLinked={hasLinkedAgentCredential(p.name, credentials, ac)}
            action={
              <CredentialAction
                projectId={config.projectId}
                agentId={agentId}
                linkedCredential={findMatchingAgentCredential(
                  p,
                  credentials,
                  ac
                )}
                availableCredentials={findMatchingCredentials(p, credentials)}
              />
            }
          />
        ))}
      </div>
    </>
  )
}
