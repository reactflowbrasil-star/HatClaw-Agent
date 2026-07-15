# Graph Report - foundry-agent-webapp-main  (2026-07-15)

## Corpus Check
- 149 files · ~78,067 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1474 nodes · 1841 edges · 106 communities (101 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 17 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- chatService.ts
- parameters
- devDependencies
- AgentChat.tsx
- dependencies
- parameters
- outputs
- main-infrastructure.json
- fileAttachments.ts
- compilerOptions
- entra-app.json
- ThemeContext.tsx
- WebApp.ServiceDefaults
- compilerOptions
- main.json
- .CreateFromException
- properties
- AgentFrameworkServiceConfigTests
- Markdown.tsx
- parameters
- AgentFrameworkService
- Validating UI Features
- .StreamMessageAsync
- WebApp.Api.Models
- speech.d.ts
- AI Agent Web App
- .GetProjectClient
- Part 2: Frontend State
- http
- Extensions
- AssistantMessage.tsx
- StarterMessages.tsx
- ConversationModels.cs
- .DownloadContainerFileAsync
- Frontend - React + TypeScript + Vite
- .BuildUserMessageAsync
- BuiltWithBadge.tsx
- smoke-test.js
- envcheck.ts
- .GetLastUsage
- tsconfig.json
- css-modules.d.ts
- svg.d.ts
- Researching Azure AI SDK
- Understanding Architecture
- Expected Complex Markdown Output
- Infrastructure - Azure Bicep Templates
- TypeScript Coding Standards
- C# Coding Standards
- Deploying to Azure
- Documentation Review Guidance
- ChatInterface.tsx
- AppContext.tsx
- Syncing MCP Servers
- Backend - ASP.NET Core API
- Validating Deployments
- Local Setup Validation
- Skill: Writing TypeScript Unit Tests
- Testing with Playwright MCP
- Skill: Writing C# Unit Tests
- Copilot Hooks
- Chat Streaming Implementation
- Required Plan Structure
- Issue Triage Guidance
- Bicep Coding Standards
- ErrorBoundary.tsx
- sp
- Authentication Troubleshooting
- Testing CLI Compatibility
- serviceManagementReference
- Deployment Directory
- appState.ts
- Expected Code Block Output
- copilot-instructions.md
- outputs
- variables
- $fxv#0
- ConversationSidebar.tsx
- Commit Message Format
- description
- _generator
- environmentName
- aiAgentEndpoint
- enableObo
- entraTenantId
- serviceManagementReference
- webImageName
- test.md
- WEB_IDENTITY_PRINCIPAL_ID

## God Nodes (most connected - your core abstractions)
1. `AgentFrameworkService` - 38 edges
2. `ChatService` - 23 edges
3. `compilerOptions` - 22 edges
4. `TypeScript Coding Standards` - 19 edges
5. `compilerOptions` - 18 edges
6. `Part 2: Frontend State` - 18 edges
7. `Researching Azure AI SDK` - 17 edges
8. `AgentFrameworkServiceConfigTests` - 16 edges
9. `createAppError()` - 15 edges
10. `Deploying to Azure` - 15 edges

## Surprising Connections (you probably didn't know these)
- `AssistantMessageProps` --references--> `IChatItem`  [EXTRACTED]
  frontend/src/components/chat/AssistantMessage.tsx → frontend/src/types/chat.ts
- `UserMessageProps` --references--> `IChatItem`  [EXTRACTED]
  frontend/src/components/chat/UserMessage.tsx → frontend/src/types/chat.ts
- `AgentFrameworkService` --references--> `AgentMetadataResponse`  [EXTRACTED]
  backend/WebApp.Api/Services/AgentFrameworkService.cs → backend/WebApp.Api/Models/AgentMetadata.cs
- `ConversationSidebarProps` --references--> `ConversationSummary`  [EXTRACTED]
  frontend/src/components/ConversationSidebar.tsx → frontend/src/types/appState.ts
- `AssistantMessageComponent()` --calls--> `parseContentWithCitations()`  [EXTRACTED]
  frontend/src/components/chat/AssistantMessage.tsx → frontend/src/utils/citationParser.ts

## Import Cycles
- None detected.

## Communities (106 total, 5 thin omitted)

### Community 0 - "chatService.ts"
Cohesion: 0.09
Nodes (31): RFC-7807, formatBytes(), SettingsPanel(), SettingsPanelProps, useStyles, ChatService, trackException(), DETAILED_ERROR_MESSAGES (+23 more)

### Community 1 - "parameters"
Cohesion: 0.04
Nodes (47): type, type, type, type, contentVersion, type, type, appContainerApps (+39 more)

### Community 2 - "devDependencies"
Cohesion: 0.04
Nodes (46): eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks (+38 more)

### Community 3 - "AgentChat.tsx"
Cohesion: 0.17
Nodes (15): AgentChat(), AgentChatProps, ChatInterface(), useAppContext(), useAppState(), useChatState(), useUIState(), rootElement (+7 more)

### Community 4 - "dependencies"
Cohesion: 0.05
Nodes (39): @azure/msal-browser, @azure/msal-react, clsx, copy-to-clipboard, date-fns, @fluentui-copilot/react-copilot, @fluentui-copilot/react-copilot-chat, @fluentui/react-components (+31 more)

### Community 5 - "parameters"
Cohesion: 0.06
Nodes (39): defaultValue, metadata, type, defaultValue, metadata, type, defaultValue, metadata (+31 more)

### Community 6 - "outputs"
Cohesion: 0.20
Nodes (10): type, value, type, value, type, value, outputs, AZURE_CONTAINER_APP_NAME (+2 more)

### Community 7 - "main-infrastructure.json"
Cohesion: 0.06
Nodes (33): type, value, type, value, type, value, contentVersion, appContainerApps (+25 more)

### Community 8 - "fileAttachments.ts"
Cohesion: 0.12
Nodes (25): ChatInput(), ChatInputProps, createLongTextAttachment(), focusInput(), FilePreview(), FilePreviewProps, TEXT_PREVIEW_TYPES, useStyles (+17 more)

### Community 9 - "compilerOptions"
Cohesion: 0.06
Nodes (31): compilerOptions, allowImportingTsExtensions, baseUrl, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+23 more)

### Community 10 - "entra-app.json"
Cohesion: 0.20
Nodes (9): contentVersion, imports, microsoftGraphV1, languageVersion, provider, version, $schema, variables (+1 more)

### Community 11 - "ThemeContext.tsx"
Cohesion: 0.16
Nodes (16): Wave, Waves(), WavesProps, IDropdownItem, ThemePicker(), ThemeProvider(), brandColors, darkTheme (+8 more)

### Community 12 - "WebApp.ServiceDefaults"
Cohesion: 0.09
Nodes (23): WebApp.Api.Tests, net10.0, WebApp.Api, net10.0, WebApp.ServiceDefaults, net10.0, Azure.AI.Extensions.OpenAI (2.0.0), Azure.AI.Projects (2.0.0) (+15 more)

### Community 13 - "compilerOptions"
Cohesion: 0.09
Nodes (22): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, moduleResolution, noEmit (+14 more)

### Community 14 - "main.json"
Cohesion: 0.22
Nodes (8): contentVersion, name, templateHash, version, metadata, _generator, resources, $schema

### Community 15 - ".CreateFromException"
Cohesion: 0.19
Nodes (9): Dictionary, ErrorResponse, ErrorResponseFactory, TestMethod, ErrorResponseFactoryTests, DataRow, Detail, Exception (+1 more)

### Community 16 - "properties"
Cohesion: 0.18
Nodes (11): oauth2PermissionScopes, properties, api, displayName, serviceManagementReference, signInAudience, spa, uniqueName (+3 more)

### Community 17 - "AgentFrameworkServiceConfigTests"
Cohesion: 0.09
Nodes (7): TestMethod, AgentFrameworkServiceConfigTests, TestMethod, ConversationsEndpointTests, TestMethod, UploadedFilesPrefixTests, WebApp.Api.Tests

### Community 18 - "Markdown.tsx"
Cohesion: 0.09
Nodes (17): CitationMarker, CitationMarkerProps, baseComponents, CodeBlock, CodeBlockProps, ContentWithCitations(), createDownloadableComponents(), findAnnotationByFilename() (+9 more)

### Community 19 - "parameters"
Cohesion: 0.10
Nodes (19): value, value, contentVersion, value, value, value, value, parameters (+11 more)

### Community 20 - "AgentFrameworkService"
Cohesion: 0.12
Nodes (16): AIProjectClient, AgentFrameworkService, bool, HashSet, IDisposable, IHttpClientFactory, IHttpContextAccessor, ILogger (+8 more)

### Community 21 - "Validating UI Features"
Cohesion: 0.04
Nodes (47): Additional Test Prompts, Console Evidence, Console Evidence, Console Evidence, Console Evidence, DOM Changes, Edge Cases, Expected Code Block DOM (+39 more)

### Community 22 - ".StreamMessageAsync"
Cohesion: 0.22
Nodes (8): AnnotationInfo, List, McpApprovalRequest, StreamChunk, Dictionary, List, IAsyncEnumerable, ResponseItem

### Community 23 - "WebApp.Api.Models"
Cohesion: 0.14
Nodes (9): Dictionary, List, AgentMetadataResponse, ChatResponse, UploadedFilesCleanupResult, UploadedFilesInfo, WebApp.Api.Models, WebApp.Api.Services (+1 more)

### Community 24 - "speech.d.ts"
Cohesion: 0.14
Nodes (8): SpeechRecognition, SpeechRecognitionAlternative, SpeechRecognitionConstructor, SpeechRecognitionErrorEvent, SpeechRecognitionEvent, SpeechRecognitionResult, SpeechRecognitionResultList, Window

### Community 25 - "AI Agent Web App"
Cohesion: 0.05
Nodes (42): Advanced: On-Behalf-Of (OBO) — Opt-In, AI Agent Web App, Architecture, Authentication & Identity, Azure Requirements, Azure Resources Provisioned, Coming from the AI Foundry Portal, Commands (+34 more)

### Community 27 - "Part 2: Frontend State"
Cohesion: 0.05
Nodes (39): 1.1 Request Pipeline, 1.2 Credential Resolution, 1.3 Agent Loading (Lazy Singleton), 1.4 SSE Streaming Pipeline, 1.5 Backend SSE Event Types, 2.1 Authentication State Machine, 2.2 Chat State Machine, 2.3 End-to-End Message Flow (+31 more)

### Community 28 - "http"
Cohesion: 0.20
Nodes (9): ASPNETCORE_ENVIRONMENT, applicationUrl, commandName, dotnetRunMessages, environmentVariables, launchBrowser, profiles, http (+1 more)

### Community 29 - "Extensions"
Cohesion: 0.27
Nodes (4): Extensions, Microsoft.Extensions.Hosting, IHostApplicationBuilder, WebApplication

### Community 30 - "AssistantMessage.tsx"
Cohesion: 0.14
Nodes (15): AssistantMessage, AssistantMessageComponent(), AssistantMessageProps, getToolUseLabel(), MessageActions, MessageActionsProps, UsageInfo(), UsageInfoProps (+7 more)

### Community 31 - "StarterMessages.tsx"
Cohesion: 0.24
Nodes (7): McpApprovalCard(), McpApprovalCardProps, defaultStarterPrompts, IStarterMessageProps, StarterMessages(), AgentIcon(), AgentIconProps

### Community 32 - "ConversationModels.cs"
Cohesion: 0.25
Nodes (7): ConversationInfo, ConversationListResponse, ConversationMessageInfo, ConversationMessagesResponse, ConversationSummary, FileAttachmentInfo, MessageInfo

### Community 33 - ".DownloadContainerFileAsync"
Cohesion: 0.36
Nodes (4): BinaryData, Content, FileName, OnBehalfOfCredential

### Community 34 - "Frontend - React + TypeScript + Vite"
Cohesion: 0.06
Nodes (33): App Registration Policies, Azure Developer CLI Hooks, Change Default Behavior, Customization, Entra App Registration, Hook Details, Hook Execution Order, Logging (+25 more)

### Community 35 - ".BuildUserMessageAsync"
Cohesion: 0.38
Nodes (4): List, ChatRequest, FileAttachment, McpApprovalResponse

### Community 37 - "BuiltWithBadge.tsx"
Cohesion: 0.40
Nodes (4): BuiltWithBadge(), BuiltWithBadgeProps, AIFoundryLogo(), AIFoundryLogoProps

### Community 38 - "smoke-test.js"
Cohesion: 0.50
Nodes (4): { chromium }, log(), results, run()

### Community 39 - "envcheck.ts"
Cohesion: 0.50
Nodes (3): envCheckPlugin(), REQUIRED_VARS, __dirname

### Community 40 - ".GetLastUsage"
Cohesion: 0.50
Nodes (3): InputTokens, OutputTokens, TotalTokens

### Community 60 - "Researching Azure AI SDK"
Cohesion: 0.07
Nodes (29): 1. Primary SDK Repository (Start Here), 2. Official Quickstart Samples, 3. Azure Architecture Center Samples, 4. UI Reference Samples (React Patterns), 5. Semantic Kernel Integration, 6. OpenAI .NET SDK (Streaming Types), 7. GitHub Code Search (For Specific Patterns), Additional SDK Resources (+21 more)

### Community 61 - "Understanding Architecture"
Cohesion: 0.07
Nodes (27): AI Integration, Auth States, Backend → Frontend Mapping, Chat States, Common Architecture Questions, Cross-Reference with DeepWiki, Data Flow, Event Sequence (+19 more)

### Community 62 - "Expected Complex Markdown Output"
Cohesion: 0.08
Nodes (25): Blockquote Verification, Blockquotes, Combined Example, Expected Complex Markdown Output, Formatting Verification, Full Verification Checklist, Heading 1 (Largest), Heading 2 (+17 more)

### Community 63 - "Infrastructure - Azure Bicep Templates"
Cohesion: 0.08
Nodes (23): Add Environment Variables, Architecture, Change Resource Tier, Change Scaling Limits, Container App, Container Registry, Cost Optimization, Customization (+15 more)

### Community 64 - "TypeScript Coding Standards"
Cohesion: 0.10
Nodes (19): API Calls, Common Mistakes, Environment Variables, Hot Module Replacement (HMR) Workflow, Memoization Patterns, MSAL Pattern, npm Dependencies, Project-Specific: Accessibility Checklist (+11 more)

### Community 65 - "C# Coding Standards"
Cohesion: 0.11
Nodes (18): Async Best Practices, Authentication Setup, C# Coding Standards, Common Mistakes, Credential Strategy, Error Responses (RFC 7807), GitHub SDK Source (For Deep Dives), Hot Reload Development Workflow (+10 more)

### Community 66 - "Deploying to Azure"
Cohesion: 0.11
Nodes (17): AI Foundry Resource Configuration, Container Infrastructure, Delegation Pattern, Deploying to Azure, Deployment Phases, Docker Multi-Stage Build, Dockerfile Example, Official Documentation (+9 more)

### Community 67 - "Documentation Review Guidance"
Cohesion: 0.11
Nodes (17): .agent.md Quality Gates, ARCHITECTURE-FLOW.md, Architecture Maintenance, Audit Checklists, Constraints, Content Quality Rules, copilot-instructions.md, Cross-Document Consistency (+9 more)

### Community 68 - "ChatInterface.tsx"
Cohesion: 0.17
Nodes (15): DropZone(), DropZoneProps, ChatInterfaceProps, ErrorMessage(), ErrorMessageProps, useStyles, KeyboardShortcuts(), KeyboardShortcutsProps (+7 more)

### Community 69 - "AppContext.tsx"
Cohesion: 0.18
Nodes (9): AppContext, AppContextValue, AppProvider(), devLogger, logStateChange(), reducerWithLogging(), appReducer(), AppAction (+1 more)

### Community 70 - "Syncing MCP Servers"
Cohesion: 0.12
Nodes (16): CLI format (`~/.copilot/mcp-config.json`), Format Differences, Future-Proofing, Important Rules, Key differences:, Reference, Reverse Sync (CLI → VS Code), Step 1 — Read the source of truth (+8 more)

### Community 71 - "Backend - ASP.NET Core API"
Cohesion: 0.12
Nodes (15): API Endpoints, Backend - ASP.NET Core API, Building, Configuration, Development Tips, Key Dependencies, Key Features, Overview (+7 more)

### Community 72 - "Validating Deployments"
Cohesion: 0.12
Nodes (15): 1. Deploy, 1. Deploy, 2. Test Remote, 2. Verify OBO Wiring, 3. Test, 3. Test Local Dev, 4. Teardown, 4. Teardown (+7 more)

### Community 73 - "Local Setup Validation"
Cohesion: 0.12
Nodes (15): 401 Unauthorized on /api/* endpoints, AADSTS900023: Specified tenant identifier is neither a valid DNS name, Backend (`backend/WebApp.Api/.env`), Common Error Patterns, For Agents: Before Running Dev Commands, Frontend (`frontend/.env.local`), Frontend shows "Setup Required" error page, Local Setup Validation (+7 more)

### Community 74 - "Skill: Writing TypeScript Unit Tests"
Cohesion: 0.12
Nodes (15): Assertions Reference, Components (Require React Testing Library), Configuration, Overview, Project Structure, Quick Reference, Reducers (Pure Functions - Easy to Test), Running Tests (+7 more)

### Community 75 - "Testing with Playwright MCP"
Cohesion: 0.14
Nodes (13): Delegation Pattern, Playwright MCP, Project-Specific: Key Test Scenarios, Project-Specific: Network Verification, Related Skills, State Logging (Dev Mode), Subagent Delegation for Testing, Testing Priority (Token efficiency) (+5 more)

### Community 76 - "Skill: Writing C# Unit Tests"
Cohesion: 0.14
Nodes (13): Assertions Reference, Models (Pure, Easy to Test), Overview, Project Structure, Quick Reference, Running Tests, Services (Require Integration Testing), Skill: Writing C# Unit Tests (+5 more)

### Community 77 - "Copilot Hooks"
Cohesion: 0.15
Nodes (12): 1. Write the script, 2. Register it in the config, 3. Test it, Copilot Hooks, Creating Your Own Hook, Hooks in This Repo, How It Works, Input (stdin) (+4 more)

### Community 78 - "Chat Streaming Implementation"
Cohesion: 0.15
Nodes (12): Backend: IAsyncEnumerable Service, Backend: SSE Endpoint, Chat Streaming Implementation, Frontend: Action Flow, Frontend: ChatService Pattern, Image Validation, Project-Specific: Dev Logging, Project-Specific: Frontend State Flow (+4 more)

### Community 79 - "Required Plan Structure"
Cohesion: 0.15
Nodes (12): 1. Overview, 2. Requirements, 3. Files to Modify, 4. Files to Create, 5. Implementation Steps, 6. Testing Checklist, 7. Edge Cases, 8. Documentation Updates (+4 more)

### Community 80 - "Issue Triage Guidance"
Cohesion: 0.15
Nodes (12): Complexity Scale, Constraints, Duplicate Detection, gh CLI Commands for Read-Only Analysis, Issue Triage Guidance, Label Taxonomy, Open Issues Summary, Open PRs Summary (+4 more)

### Community 81 - "Bicep Coding Standards"
Cohesion: 0.15
Nodes (12): ACR Pull Pattern, Bicep Coding Standards, Container Apps, Managed Identity, Naming Convention, Outputs, Parameters, Project-Specific: Container App Configuration (+4 more)

### Community 82 - "ErrorBoundary.tsx"
Cohesion: 0.24
Nodes (5): DefaultErrorFallback(), ErrorBoundary, ErrorBoundaryProps, ErrorBoundaryState, useStyles

### Community 83 - "sp"
Cohesion: 0.18
Nodes (11): import, type, appId, resources, app, sp, dependsOn, import (+3 more)

### Community 84 - "Authentication Troubleshooting"
Cohesion: 0.20
Nodes (9): Architecture, Authentication Troubleshooting, Backend: Credential Strategy, Backend: JWT Validation, Common Issues, Debugging Steps, Environment Variables, Frontend: MSAL Pattern (+1 more)

### Community 85 - "Testing CLI Compatibility"
Cohesion: 0.22
Nodes (8): How It Works, Manual Testing, Prerequisites, Quick Start, Testing CLI Compatibility, Troubleshooting, What It Tests, When to Run

### Community 86 - "serviceManagementReference"
Cohesion: 0.25
Nodes (9): metadata, type, description, parameters, environmentName, serviceManagementReference, defaultValue, metadata (+1 more)

### Community 87 - "Deployment Directory"
Cohesion: 0.25
Nodes (7): Build Strategy, Deployment Directory, Docker Details, Hook Workflow, Key Commands, Quick Reference, Structure

### Community 88 - "appState.ts"
Cohesion: 0.40
Nodes (3): loginRequest, msalConfig, tokenRequest

### Community 89 - "Expected Code Block Output"
Cohesion: 0.25
Nodes (7): Bash Example, Expected Code Block Output, Expected Syntax Highlighting, Python Example, SQL Example, TypeScript Example, Verification Checklist

### Community 90 - "copilot-instructions.md"
Cohesion: 0.29
Nodes (6): Architecture, Deployment (Non-Obvious), Design Decisions, Development, Documentation Rules, Hooks

### Community 91 - "outputs"
Cohesion: 0.29
Nodes (7): type, value, type, value, outputs, appObjectId, clientAppId

### Community 92 - "variables"
Cohesion: 0.29
Nodes (7): app-name, azd-env-name, variables, abbrs, appTags, resourceToken, tags

### Community 93 - "$fxv#0"
Cohesion: 0.29
Nodes (7): appContainerApps, appManagedEnvironments, containerRegistryRegistries, managedIdentityUserAssignedIdentities, operationalInsightsWorkspaces, resourcesResourceGroups, $fxv#0

### Community 94 - "ConversationSidebar.tsx"
Cohesion: 0.53
Nodes (5): ConversationSidebar(), ConversationSidebarProps, formatDate(), useStyles, ConversationSummary

### Community 95 - "Commit Message Format"
Cohesion: 0.33
Nodes (5): Commit Message Format, Commit Workflow, Constraints, Rules, Type Prefixes

### Community 96 - "description"
Cohesion: 0.67
Nodes (3): type, value, AZURE_CONTAINER_APPS_ENVIRONMENT_ID

### Community 97 - "_generator"
Cohesion: 0.40
Nodes (5): name, templateHash, version, metadata, _generator

### Community 98 - "environmentName"
Cohesion: 0.67
Nodes (3): type, value, AZURE_CONTAINER_REGISTRY_NAME

### Community 99 - "aiAgentEndpoint"
Cohesion: 0.67
Nodes (3): type, value, ENTRA_APP_OBJECT_ID

### Community 100 - "enableObo"
Cohesion: 0.67
Nodes (3): type, value, ENTRA_BACKEND_APP_OBJECT_ID

### Community 101 - "entraTenantId"
Cohesion: 0.67
Nodes (3): type, value, ENTRA_BACKEND_CLIENT_ID

### Community 102 - "serviceManagementReference"
Cohesion: 0.67
Nodes (3): type, value, ENTRA_SPA_CLIENT_ID

### Community 103 - "webImageName"
Cohesion: 0.67
Nodes (3): WEB_ENDPOINT, type, value

### Community 105 - "WEB_IDENTITY_PRINCIPAL_ID"
Cohesion: 0.67
Nodes (3): WEB_IDENTITY_PRINCIPAL_ID, type, value

## Knowledge Gaps
- **760 isolated node(s):** `net10.0`, `System.Security.Cryptography.Xml (10.0.6)`, `MSTest.Sdk/3.10.2`, `ConversationInfo`, `ConversationListResponse` (+755 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `AgentFrameworkService` connect `AgentFrameworkService` to `.DownloadContainerFileAsync`, `.BuildUserMessageAsync`, `.GetLastUsage`, `.StreamMessageAsync`, `WebApp.Api.Models`, `.GetProjectClient`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **Why does `WebApp.Api.Models` connect `WebApp.Api.Models` to `ConversationModels.cs`, `.BuildUserMessageAsync`, `.CreateFromException`, `AgentFrameworkServiceConfigTests`, `.StreamMessageAsync`?**
  _High betweenness centrality (0.005) - this node is a cross-community bridge._
- **What connects `net10.0`, `System.Security.Cryptography.Xml (10.0.6)`, `MSTest.Sdk/3.10.2` to the rest of the system?**
  _760 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `chatService.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08708272859216255 - nodes in this community are weakly interconnected._
- **Should `parameters` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._