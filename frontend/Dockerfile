# Use the official Node.js image from the Docker Hub
FROM node:20.15.1-alpine

# Set the working directory
WORKDIR /app

# Install dependencies first, as they change less often than code.
COPY package.json package-lock.json* ./
RUN npm ci && npm cache clean --force
COPY . .

# Expose port 5173
EXPOSE 5173

# Start the application
CMD ["npm", "run", "dev"]
