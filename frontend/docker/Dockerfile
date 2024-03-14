# Use an official Node.js runtime as the base image
FROM node:18.19.1-slim

# Set the working directory in the container
WORKDIR /usr/src/frontend

COPY ./frontend/package*.json .

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application source code to the container
COPY ./frontend .

RUN npm install -g serve

CMD ["npm", "run", "build"]