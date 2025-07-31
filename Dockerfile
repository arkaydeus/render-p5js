# Use Node.js 16 (required for canvas compatibility as noted in README)
FROM node:22-alpine

# Install system dependencies required for canvas and p5.js rendering
RUN apk add --no-cache \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev \
    pkgconfig \
    python3 \
    make \
    g++

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Expose port 8080
EXPOSE 8080

# Set environment variable for canvas (as required by Vercel deployment notes)
ENV LD_LIBRARY_PATH=/app/node_modules/canvas/build/Release

# Start the application
CMD ["node", "dist/index.js"]