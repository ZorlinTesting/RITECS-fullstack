# # Dockerfile for React Frontend

### PRODUCTION SETTING
# FROM node:18-alpine

# # Set working directory
# WORKDIR /usr/src/app

# # Set environment variables
# ENV NODE_ENV=production


# # Install dependencies
# COPY package.json package-lock.json ./

# # Install dependencies, excluding devDependencies
# RUN npm install --only=production --omit=dev

# # Copy project files
# COPY . .

# # Build the React app
# RUN npm run build

# # Start the app
# CMD ["npm", "start"]

# DEVELOPMENT SETTING

### Dockerfile for React Frontend
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Set environment variables
ENV NODE_ENV=development

# Install dependencies
COPY package.json package-lock.json ./

# Install all dependencies, including devDependencies
RUN npm install

# Copy project files
COPY . .

# Comment out build step for development
# RUN npm run build

# Start the app
CMD ["npm", "start"]
