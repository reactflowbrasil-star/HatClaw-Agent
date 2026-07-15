import { Spinner } from '@fluentui/react-components';
import { ErrorBoundary } from "./components/core/ErrorBoundary";
import { AgentChat } from "./components/AgentChat";
import { useState, useEffect, useCallback } from "react";
import type { IAgentMetadata } from "./types/chat";
import "./App.css";

const AGENT_DISPLAY_NAME = 'HatClaw - CoderMax';

function App() {
  const [agentMetadata, setAgentMetadata] = useState<IAgentMetadata | null>(null);
  const [isLoadingAgent, setIsLoadingAgent] = useState(true);

  // Wrap fetchAgentMetadata in useCallback to make it stable for the effect
  const fetchAgentMetadata = useCallback(async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '/api';
      const response = await fetch(`${apiUrl}/agent`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setAgentMetadata(data);
      
      // Update document title with agent name
      document.title = AGENT_DISPLAY_NAME;
    } catch (error) {
      console.error('Error fetching agent metadata:', error);
      // Fallback data keeps UI functional on error
      setAgentMetadata({
        id: 'fallback-agent',
        object: 'agent',
        createdAt: Date.now() / 1000,
        name: AGENT_DISPLAY_NAME,
        description: 'Your intelligent conversational partner powered by Azure AI',
        model: 'gpt-4o-mini',
        metadata: { logo: 'Avatar_Default.svg' }
      });
      document.title = AGENT_DISPLAY_NAME;
    } finally {
      setIsLoadingAgent(false);
    }
  }, []);

  useEffect(() => {
    fetchAgentMetadata();
  }, [fetchAgentMetadata]);

  return (
    <ErrorBoundary>
      {isLoadingAgent ? (
        <div className="app-container" style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh', 
          flexDirection: 'column', 
          gap: '1rem' 
        }}>
          <Spinner size="large" />
          <p style={{ margin: 0 }}>
            Carregando agente...
          </p>
        </div>
      ) : (
        agentMetadata && (
          <div className="app-container">
            <AgentChat 
                  agentId={agentMetadata.id}
                  agentName={AGENT_DISPLAY_NAME}
                  agentDescription={agentMetadata.description || undefined}
                  agentLogo={agentMetadata.metadata?.logo}
                  starterPrompts={agentMetadata.starterPrompts || undefined}
            />
          </div>
        )
      )}
    </ErrorBoundary>
  );
}

export default App;
