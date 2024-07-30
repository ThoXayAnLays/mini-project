# Stage 1: Build
FROM node:20-alpine as builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./

RUN npm install

# Copy source files
COPY . .

# Build the project
RUN npm run build

# Stage 2: Production
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=builder /app/build /app/build 
COPY --from=builder /app/package*.json /app/build  

WORKDIR /app/build

RUN npm install --production
# Expose port
EXPOSE 3333

# Start the server
CMD ["node", "bin/server.js"]
# CMD ["sh", "-c", "node ace migration:run && node bin/server.js"]
