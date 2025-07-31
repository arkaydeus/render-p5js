# render-p5js

Headless p5.js renderer to produce transparent Chromie Squiggles from token hashes.
Note that a token hash is not the same as the hash of the mint transaction.

## API Endpoints

The service provides two main endpoints for generating Chromie Squiggle images:

### Hash Endpoint
```
GET /hash/:hash
```
Generate a squiggle directly from a 66-character token hash.

**Example:**
```
GET /hash/0x722899b10c66da3b72fb60a8e71df442ee1c004547ba2227d76bed357469b4ea
```

### Token ID Endpoint
```
GET /id/:id
```
Generate a squiggle from a numeric token ID (looks up hash from local database).

**Example:**
```
GET /id/0
GET /id/1234
```

### Query Parameters
Both endpoints support optional query parameters:
- `width` - Image width (default: 600)
- `height` - Image height (default: 400)
- `red` - Background red value 0-255 (default: 255)
- `green` - Background green value 0-255 (default: 255)
- `blue` - Background blue value 0-255 (default: 255)
- `alpha` - Background alpha value 0-255 (default: 0)

**Example with parameters:**
```
GET /hash/0x722899b10c66da3b72fb60a8e71df442ee1c004547ba2227d76bed357469b4ea?width=800&height=600&red=0&green=0&blue=0&alpha=255
```

## Token Hash Reference

Token hashes can be found at https://token.artblocks.io/{tokenId} under the `token_hash` key.

**Example response:**
```json
{
  "token_hash": "0x722899b10c66da3b72fb60a8e71df442ee1c004547ba2227d76bed357469b4ea"
}
```

## Development

### Prerequisites
- Node.js 16+ (Node.js 22 recommended for Docker)
- pnpm (specified package manager)

### Local Development
```bash
# Install dependencies
pnpm install

# Start development server
pnpm start

# Build for production
pnpm build

# Run tests
pnpm test
```

The development server will start on `http://localhost:8080` by default.

## Docker Deployment

### Quick Start
```bash
# Start with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

### Manual Docker Build
```bash
# Build image
docker build -t render-p5js .

# Run container
docker run -d -p 8080:8080 --name render-p5js-app render-p5js
```

### Environment Variables
- `PORT` - Server port (default: 8080)
- `NODE_ENV` - Environment mode (default: production in Docker)

## Deployment Options

### Vercel
Can be deployed on Vercel with Node.js 16+ runtime.

Required environment variable:
```
LD_LIBRARY_PATH=/var/task/node_modules/canvas/build/Release
```

### Docker Production
The included Docker configuration uses Node.js 22 Alpine with all required canvas dependencies pre-installed.

## Technical Details

- **Framework**: Fastify web server
- **Rendering**: node-p5 for headless p5.js rendering
- **Image Format**: PNG with base64 encoding
- **Dependencies**: Requires canvas system libraries for image generation
- **Data Source**: Local `alltokens.json` file for efficient hash lookups

## Architecture

- `src/index.ts` - Main Fastify server
- `src/squiggleRoute.ts` - API route handlers
- `src/squiggle.ts` - p5.js sketch implementation
- `src/artblocks.ts` - Token hash utilities
- `src/alltokens.json` - Local token hash database