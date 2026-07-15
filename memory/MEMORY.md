# Memory - HatClaw Agent

## Project Identity
- **Project Name:** HatClaw - CoderMax
- **Public URL:** https://hatclaw.com/ia/
- **Azure App URL:** https://ca-web-aul4uukqnburs.bravehill-5aa61ebc.eastus2.azurecontainerapps.io/
- **GitHub Repo:** https://github.com/reactflowbrasil-star/HatClaw-Agent.git
- **Remote Deploy Path:** /home/u146190565/domains/hatclaw.com/public_html/ia

## Configuration & Preferences
- **Voice Mode:** Optional Brazilian Portuguese voice mode with young, animated female voice behavior.
- **Character Limit:** Raised to 50,000; large text handled as attachment-style text payload.
- **Working Style:** Use Graphify first for project exploration. Refresh Graphify after code changes.
- **Automation:** 
  - Integrated `agent-browser` as preferred desktop engine.
  - Integrated `TopoClaw` for broad automation (browser, GitHub, CLI, etc.).
  - Local bridge at `127.0.0.1` requires manual confirmation.

## Technical Details
- **Frontend:** React + TypeScript + Vite.
- **Backend:** ASP.NET Core 9 Minimal APIs.
- **Authentication:** Microsoft Entra ID (PKCE).
- **Deployment:** Azure Container Apps via `azd deploy`.
- **Infrastructure:** ACR, ACA, Log Analytics, App Insights.

## SSH Deployment Coordinates
- **SSH Host:** 82.25.67.148
- **SSH Port:** 65002
- **SSH User:** u146190565
- **SSH Password:** [REDACTED]
- **Target:** `/home/u146190565/domains/hatclaw.com/public_html/ia`

## Recent Major Updates
- **2026-07-15:** Integrated TopoClaw for total automation capabilities.
- **2026-07-15:** Added intro screen with black background, centered HatClaw logo, 10s duration, and skip button.
- **2026-07-15:** Fixed character limit issues and added public access mode.

## Key Instructions
- Always perform the full Git flow after changes: graphify update -> git add -> git commit -> git push.
- Do not commit `.env` or secrets.
- Use Graphify for architecture exploration.
