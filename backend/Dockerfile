# specify the base image
FROM node:20-alpine

# Install wget for healthcheck
RUN apk add --no-cache wget

# working directory
WORKDIR /app

# Install nodemon globally
RUN npm install -g nodemon

# copy package.json
COPY package*.json ./

# Install all dependencies (including devDependencies)
RUN npm install

COPY . .
 
EXPOSE 5000

# Use nodemon with legacy watch for Docker compatibility
CMD ["nodemon", "--legacy-watch", "server.js"]