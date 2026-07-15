# Graph Report - backend  (2026-07-15)

## Corpus Check
- 59 files · ~43,343 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 226 nodes · 348 edges · 22 communities (19 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- AgentFrameworkService
- WebApp.Api.Models
- WebApp.ServiceDefaults
- .CreateFromException
- .StreamMessageAsync
- AgentFrameworkServiceConfigTests
- Backend - ASP.NET Core API
- Extensions
- http
- ConversationsEndpointTests
- ConversationModels.cs
- UploadedFilesPrefixTests
- .GetLastUsage

## God Nodes (most connected - your core abstractions)
1. `AgentFrameworkService` - 39 edges
2. `AgentFrameworkServiceConfigTests` - 16 edges
3. `WebApp.ServiceDefaults` - 12 edges
4. `Backend - ASP.NET Core API` - 12 edges
5. `ErrorResponseFactoryTests` - 11 edges
6. `WebApp.Api.Models` - 11 edges
7. `WebApp.Api` - 10 edges
8. `ConversationsEndpointTests` - 9 edges
9. `StreamChunk` - 9 edges
10. `WebApp.Api.Tests` - 6 edges

## Surprising Connections (you probably didn't know these)
- `AgentFrameworkService` --references--> `AgentMetadataResponse`  [EXTRACTED]
  WebApp.Api/Services/AgentFrameworkService.cs → WebApp.Api/Models/AgentMetadata.cs
- `StreamChunk` --references--> `AnnotationInfo`  [EXTRACTED]
  WebApp.Api/Models/StreamChunk.cs → WebApp.Api/Models/AnnotationInfo.cs

## Import Cycles
- None detected.

## Communities (22 total, 3 thin omitted)

### Community 0 - "AgentFrameworkService"
Cohesion: 0.11
Nodes (22): AIProjectClient, BinaryData, bool, CancellationToken, Content, FileName, HashSet, IDisposable (+14 more)

### Community 1 - "WebApp.Api.Models"
Cohesion: 0.08
Nodes (14): WebApp.Api.Tests, WebApp.Api.Models, WebApp.Api.Services, DateTime, ITestApplicationBuilder, Dictionary, List, AgentMetadataResponse (+6 more)

### Community 2 - "WebApp.ServiceDefaults"
Cohesion: 0.09
Nodes (23): Azure.AI.Extensions.OpenAI (2.0.0), Azure.AI.Projects (2.0.0), Azure.Identity (1.21.0), Azure.Monitor.OpenTelemetry.AspNetCore (1.4.0), Microsoft.Extensions.Http.Resilience (10.5.0), Microsoft.Extensions.ServiceDiscovery (10.5.0), Microsoft.Identity.Web (4.3.0), Microsoft.Identity.Web.Certificateless (4.3.0) (+15 more)

### Community 3 - ".CreateFromException"
Cohesion: 0.19
Nodes (9): DataRow, Detail, Exception, Title, Dictionary, ErrorResponse, ErrorResponseFactory, TestMethod (+1 more)

### Community 4 - ".StreamMessageAsync"
Cohesion: 0.16
Nodes (12): IAsyncEnumerable, ResponseItem, AnnotationInfo, List, ChatRequest, FileAttachment, McpApprovalResponse, List (+4 more)

### Community 6 - "Backend - ASP.NET Core API"
Cohesion: 0.12
Nodes (15): API Endpoints, Backend - ASP.NET Core API, Building, Configuration, Development Tips, Key Dependencies, Key Features, Overview (+7 more)

### Community 7 - "Extensions"
Cohesion: 0.24
Nodes (4): Microsoft.Extensions.Hosting, IHostApplicationBuilder, Extensions, WebApplication

### Community 8 - "http"
Cohesion: 0.20
Nodes (9): ASPNETCORE_ENVIRONMENT, applicationUrl, commandName, dotnetRunMessages, environmentVariables, launchBrowser, profiles, http (+1 more)

### Community 10 - "ConversationModels.cs"
Cohesion: 0.25
Nodes (7): ConversationInfo, ConversationListResponse, ConversationMessageInfo, ConversationMessagesResponse, ConversationSummary, FileAttachmentInfo, MessageInfo

### Community 12 - ".GetLastUsage"
Cohesion: 0.50
Nodes (3): InputTokens, OutputTokens, TotalTokens

## Knowledge Gaps
- **44 isolated node(s):** `net10.0`, `System.Security.Cryptography.Xml (10.0.6)`, `MSTest.Sdk/3.10.2`, `ConversationInfo`, `ConversationListResponse` (+39 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `WebApp.Api.Models` connect `WebApp.Api.Models` to `ConversationModels.cs`, `.CreateFromException`, `.StreamMessageAsync`?**
  _High betweenness centrality (0.215) - this node is a cross-community bridge._
- **Why does `AgentFrameworkService` connect `AgentFrameworkService` to `WebApp.Api.Models`, `.StreamMessageAsync`, `.GetLastUsage`?**
  _High betweenness centrality (0.213) - this node is a cross-community bridge._
- **What connects `net10.0`, `System.Security.Cryptography.Xml (10.0.6)`, `MSTest.Sdk/3.10.2` to the rest of the system?**
  _44 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `AgentFrameworkService` be split into smaller, more focused modules?**
  _Cohesion score 0.10796221322537113 - nodes in this community are weakly interconnected._
- **Should `WebApp.Api.Models` be split into smaller, more focused modules?**
  _Cohesion score 0.07936507936507936 - nodes in this community are weakly interconnected._
- **Should `WebApp.ServiceDefaults` be split into smaller, more focused modules?**
  _Cohesion score 0.09057971014492754 - nodes in this community are weakly interconnected._
- **Should `Backend - ASP.NET Core API` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._