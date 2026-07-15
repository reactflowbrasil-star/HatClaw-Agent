#!/bin/bash

# Start TopoClaw Service in the background
echo "Starting TopoClaw Service..."
cd /app/TopoClaw-main/TopoClaw
python3 -m topoclaw service --host 0.0.0.0 --port 18790 &

# Start the .NET API in the foreground
echo "Starting .NET API..."
cd /app
dotnet WebApp.Api.dll
