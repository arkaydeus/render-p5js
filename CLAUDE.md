# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a headless p5.js renderer that generates transparent Chromie Squiggles from token hashes. It's a TypeScript/Node.js web service built with Fastify that renders Art Blocks Chromie Squiggle NFTs as PNG images.

## Key Architecture

- **Fastify Web Server**: Main server in `src/index.ts` runs on port 8080
- **Squiggle Rendering**: `src/squiggle.ts` contains the p5.js sketch logic that generates the visual artwork
- **API Routes**: `src/squiggleRoute.ts` handles two main endpoints:
  - `/hash/:hash` - Direct rendering from a 66-character token hash
  - `/id/:id` - Rendering from token ID (looks up hash in `alltokens.json`)
- **Token Data**: `src/artblocks.ts` manages Art Blocks token hash retrieval
- **Local Hash Storage**: `src/alltokens.json` contains a large dataset of token ID to hash mappings

## Development Commands

- `pnpm start` - Start development server with nodemon (uses ts-node)
- `pnpm build` - Compile TypeScript to `dist/` directory
- `jest` - Run tests (configured for TypeScript with ts-jest)

## Docker Commands

- `docker-compose up -d` - Start the containerized application
- `docker-compose down` - Stop and remove containers
- `docker-compose logs -f` - View application logs
- `docker build -t render-p5js .` - Build Docker image manually

## Package Manager

This project uses **pnpm** as specified in the packageManager field. Always use `pnpm` commands, not npm or yarn.

## Important Technical Details

### API Endpoints
- Both endpoints accept query parameters: `height`, `width`, `red`, `green`, `blue`, `alpha`
- Hash endpoint validates that hash is exactly 66 characters
- ID endpoint validates that ID is numeric and looks up hash from `alltokens.json`
- Returns 404 "Token hash not found" if ID doesn't exist in the dataset

### Token Hash Format
- Art Blocks token hashes are 66-character hex strings starting with "0x"
- Example: `0x722899b10c66da3b72fb60a8e71df442ee1c004547ba2227d76bed357469b4ea`
- These are NOT the same as mint transaction hashes

### Rendering Process
- Uses `node-p5` for headless p5.js rendering
- Generates deterministic artwork based on token hash entropy
- Exports as base64-encoded PNG images
- Supports customizable background colors and dimensions

### Deployment Notes
- **Vercel**: Configured for Vercel deployment with Node 16 runtime, requires `LD_LIBRARY_PATH=/var/task/node_modules/canvas/build/Release` environment variable
- **Docker**: Containerized with Node 16 Alpine, includes all canvas dependencies and proper environment setup
- Uses canvas library for image generation, requires specific system libraries for headless rendering

## Code Patterns

- Error handling returns appropriate HTTP status codes with descriptive messages
- Async/await pattern used throughout
- TypeScript interfaces for request/response typing
- Functional programming approach in the p5.js sketch
- Local JSON file used as efficient hash lookup instead of API calls