import type { ExamNotes } from './types';

export const ab620Notes: ExamNotes = [
  {
    area: 'Plan and configure agent solutions',
    notes: [
      ['Authentication options', 'No authentication, Authenticate with Microsoft (Entra ID, automatic for Teams and Microsoft channels) or Authenticate manually (any provider, exposes User.AccessToken).'],
      ['Requiring sign-in', 'Block the Chat without Microsoft Entra ID authentication connector in a data policy so makers cannot choose No authentication.'],
      ['Sharing control', 'Who can chat with an agent is controlled only when it uses Entra ID with Require users to sign in (or Authenticate with Microsoft).'],
      ['Component collection', 'Packages topics, knowledge, tools, child agents, flows and entities for reuse by other agents in the same environment.'],
      ['Content moderation', 'Lowest to Highest, High by default. Lower returns more answers but may include harmful content.'],
      ['Published changes', 'Running conversations keep the old content; users type start over for a new session.'],
      ['Agent flows as tools', 'Start with When an agent calls the flow, end with Respond to the agent, respond within 100 seconds and keep Asynchronous response off.'],
      ['Agent flow billing', 'Each action consumes Copilot Studio capacity (not Power Automate billing); test runs are free.'],
      ['Human review actions', 'Request for information pauses the flow and collects Text, Yes/No, Email, Number or Date from reviewers in Outlook; only the first response counts.'],
      ['Multistage approvals', 'Combine AI stages (approve or reject with a rationale) and manual stages; the same approver on several stages makes the flow fail.'],
      ['Error handling in flows', 'Wrap steps in a Scope with Configure run after to return an error result to the agent.'],
      ['Tool descriptions', 'The orchestrator uses tool and parameter names and descriptions to decide when to call a tool and how to fill inputs, so make them clear.'],
      ['Tool in a topic', 'Add a tool inside a topic to call it deterministically only there.'],
      ['HTTP request node', 'Request timeout defaults to 30 seconds (set in milliseconds). Continue on error stores status code and error body; the error is type Any, so use Parse value.'],
      ['Generative answers node', 'Turn off Send a message to save and format the answer yourself. Node-level sources take priority over agent-level knowledge.'],
      ['Adaptive Card node', 'Shows an interactive card and creates output variables on submit. Switching to Formula (Power Fx) cannot be undone. Teams supports card version 1.5, web chat 1.6.'],
      ['Topic variables', 'Receive values from other topics lets a redirecting topic pass a value so the question is skipped.'],
      ['Global variables', 'With External sources can set values, the embedding page can set them through the URL or a pvaSetContext event.'],
      ['Environment variables', 'Hold per-environment values such as endpoints; they are read at publish time, so republish after changing them.'],
      ['Child vs connected agents', 'Child agents live inside the main agent and share its settings (small teams); connected agents are separate, published independently and reusable.'],
      ['A2A', 'Agent-to-agent protocol for external agents; each request sends the full chat history.']
    ]
  },
  {
    area: 'Integrate and extend agents in Copilot Studio',
    notes: [
      ['Data policies', 'Power Platform data loss prevention policies govern connectors, including HTTP, MCP and knowledge sources, with endpoint filtering for HTTP, websites and SharePoint.'],
      ['SharePoint and OneDrive knowledge', 'A separate connector from documents, so it must be blocked separately. Uses the user Entra authentication, so anonymous users get nothing.'],
      ['Maker-provided credentials', 'Used when no user is present; everyone using the agent then acts with the maker access.'],
      ['Search only selected sources', 'In a generative answers node, the selected sources replace agent-level sources with no fallback.'],
      ['Copilot connectors', 'Respect source permissions, so each user sees different results. Publishing needs the ExternalItem.Read.All scope.'],
      ['Real-time connector knowledge', 'Indexes only metadata and queries the source at run time with the user token.'],
      ['Azure AI Search knowledge', 'One vector index per knowledge source; integrated vectorization reuses the same embedding model. metadata_storage_path becomes the citation. Private endpoints need VNet support for the environment.'],
      ['Knowledge source limit', 'Above 25 sources an internal model filters which to search; uploaded files do not count.'],
      ['Official source', 'Not compatible with generative orchestration.'],
      ['Classic data', 'Bing Custom Search, Azure OpenAI on your data and custom data are added through Classic data in a generative answers node.'],
      ['Computer use', 'Lets an agent click, type and use menus in websites and desktop apps with no API. Needs generative orchestration.'],
      ['Computer use machines', 'The hosted browser needs no setup but is not Entra joined (experiments only). Your own machines are registered in Power Automate with Enable for computer use; runs on one machine are queued.'],
      ['Computer use access control', 'Blocks interaction with sites that are not allowed, but not navigation to them.'],
      ['MCP in Copilot Studio', 'Only the Streamable transport and only tools and resources (not prompts). Custom connectors need x-ms-agentic-protocol: mcp-streamable-1.0.'],
      ['REST API tools', 'Created from OpenAPI v2 (other versions are converted). Parameter names and types come from the spec; only descriptions can be edited.'],
      ['Connected agent rules', 'The main agent uses the latest published version; conversation history is passed by default; an agent with its own connected agents cannot itself be connected.'],
      ['Foundry agents', 'Connect with the Foundry project endpoint and the Agent Id.'],
      ['Fabric data agents', 'Must be published, in the same tenant, readable by each user, and do not work when deployed to Microsoft 365 Copilot.'],
      ['Foundry models in prompts', 'Add a chat completions deployment in the prompt Model dropdown with its deployment name and base model name.'],
      ['Application Insights', 'Add the connection string under Settings > Advanced. Filter customEvents on designMode False to exclude test chats.']
    ]
  },
  {
    area: 'Test and manage agents',
    notes: [
      ['Evaluation methods', 'General quality (no expected answer: relevance, groundedness, completeness, abstention), Compare meaning (pass score 50), Text similarity, Exact match, Keyword match (Any or All) and Tool use.'],
      ['Invalid results', 'Methods that need an expected response return Invalid for test cases without one.'],
      ['Test sets', 'Import CSV or TXT with Question and Expected response columns, use the latest test chat, or create one from an analytics theme.'],
      ['Evaluation limits', 'Only agents with No authentication or Authenticate with Microsoft; not Fabric data agents. Tests run as the selected test account.'],
      ['Content safety evaluation', 'Scores hate and unfairness, sexual, violence and self-harm with a threshold from 0 (strictest) to 7.'],
      ['Agent Viewer and Bot Transcript Viewer', 'Agent Viewer can view and run evaluations without editing; Bot Transcript Viewer can read transcripts.'],
      ['Solutions', 'Put agents in a custom solution (set it as preferred) and use Add required objects for components added later. Topic names with a period block export.'],
      ['Import order', 'Import custom connectors first, then connection references with the agent solution; reconfigure authentication and publish after import.'],
      ['Power Platform pipelines', 'Target environments must be Managed Environments; the same artifact moves through stages in order. The host cannot also be the development environment.'],
      ['Delegated deployment', 'Runs as a service principal or stage owner so makers need no elevated access.'],
      ['Pre-export step', 'Custom validation (OnDeploymentRequested and UpdatePreExportStepStatus) that must complete before export.'],
      ['Unmanaged layers', 'Remove an unmanaged layer under Advanced > See solution layers to restore the managed version.'],
      ['Blocking other agents', 'Turn off Let other agents connect to and use this one.']
    ]
  }
];
