# Frontend Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /frontend

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the files and build the app
COPY . .
CMD ['npm', 'start', 'dev'] 
