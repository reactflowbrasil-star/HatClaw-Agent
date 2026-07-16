# Stage 1: Build React Frontend
FROM node:22-alpine AS frontend-builder

# Build arguments for environment variables (required at build time)
ARG ENTRA_SPA_CLIENT_ID
ARG ENTRA_TENANT_ID
ARG ENTRA_BACKEND_CLIENT_ID=""
ARG APPLICATIONINSIGHTS_FRONTEND_CONNECTION_STRING=""

WORKDIR /app/frontend

# Copy all frontend files (includes package.json, .npmrc if present, and source)
COPY frontend/ ./

# Install dependencies (respects .npmrc for custom registries if present)
RUN npm ci

# Remove ALL local environment files to prevent localhost config from being used
RUN rm -f .env.local .env.development .env

# Set environment variables for Vite build
ENV NODE_ENV=production
ENV VITE_ENTRA_SPA_CLIENT_ID=$ENTRA_SPA_CLIENT_ID
ENV VITE_ENTRA_TENANT_ID=$ENTRA_TENANT_ID
ENV VITE_ENTRA_BACKEND_CLIENT_ID=$ENTRA_BACKEND_CLIENT_ID
ENV VITE_APPLICATIONINSIGHTS_CONNECTION_STRING=$APPLICATIONINSIGHTS_FRONTEND_CONNECTION_STRING
# Don't set VITE_API_URL - will default to "/api" (same origin)

# Build the frontend
RUN npm run build

# Stage 2: Build .NET API Backend
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS backend-builder

WORKDIR /app

# Copy solution and project files
COPY backend/WebApp.sln ./
COPY backend/WebApp.Api/WebApp.Api.csproj ./backend/WebApp.Api/
COPY backend/WebApp.ServiceDefaults/WebApp.ServiceDefaults.csproj ./backend/WebApp.ServiceDefaults/

# Restore dependencies
RUN dotnet restore backend/WebApp.Api/WebApp.Api.csproj

# Copy source code
COPY backend/ ./backend/

# Build and publish
RUN dotnet publish backend/WebApp.Api/WebApp.Api.csproj -c Release -o /app/publish

# Stage 3: Runtime - .NET API + Python (TopoClaw)
FROM mcr.microsoft.com/dotnet/aspnet:10.0-alpine

WORKDIR /app

# Install Python and dependencies for TopoClaw
RUN apk add --no-cache \
    python3 \
    py3-pip \
    bash \
    curl \
    git \
    libstdc++ \
    gcompat \
    nss \
    nspr \
    at-spi2-core \
    libdrm \
    mesa-gbm \
    libxkbcommon \
    libxcomposite \
    libxdamage \
    libxrandr \
    pango \
    cairo \
    alsa-lib

# Install 'uv' for fast dependency management
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uv/bin/uv
ENV PATH="/app/topoclaw-venv/bin:/uv/bin:$PATH"

# Copy published .NET API
COPY --from=backend-builder /app/publish ./

# Copy built React frontend into wwwroot
COPY --from=frontend-builder /app/frontend/dist ./wwwroot

# Copy TopoClaw-main into the container
COPY TopoClaw-main/ /app/TopoClaw-main/

# Install TopoClaw dependencies in a venv. Alpine marks the system Python as
# externally managed, so installing into /usr with --system fails under PEP 668.
RUN cd /app/TopoClaw-main/TopoClaw && \
    uv venv /app/topoclaw-venv && \
    uv pip install --python /app/topoclaw-venv/bin/python -e .[browser-compat] || \
    uv pip install --python /app/topoclaw-venv/bin/python -e .

# Expose ports: 8080 (.NET API), 18790 (TopoClaw Service)
EXPOSE 8080
EXPOSE 18790

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production
ENV TOPOCLAW_WORKSPACE=/app/workspace
ENV TOPOCLAW_CONFIG=/app/config.json

# Create workspace and config
RUN mkdir -p /app/workspace && \
    echo '{"agents":{"defaults":{"provider":"openai"}}}' > /app/config.json

# Use a startup script to run both services
COPY deployment/docker/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Run as non-root user (but need to make sure 'app' has access to workspace)
RUN chown -R app:app /app
USER app

ENTRYPOINT ["/app/entrypoint.sh"]
