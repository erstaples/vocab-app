FROM node:18-slim

WORKDIR /app

# Install dependencies required for bcrypt (keeping for other potential native modules)
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package.json and package-lock.json
COPY package*.json ./

# Clean install dependencies
RUN rm -rf node_modules && npm ci

# Copy application code
COPY . .

# Expose the API port
EXPOSE 3001

# Start the server
CMD ["node", "index.js"]