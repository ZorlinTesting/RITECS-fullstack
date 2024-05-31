# Dockerfile for React Frontend
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Set environment variables
ENV NODE_ENV=production

# Install dependencies
COPY package.json package-lock.json ./

# Install dependencies, excluding devDependencies
RUN npm install --only=production

# Copy project files
COPY . .

# Build the React app
RUN npm run build

# Start the app
CMD ["npm", "start"]
