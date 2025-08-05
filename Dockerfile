FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy package definition files and install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps --silent

# Copy the rest of the application
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the production server
CMD ["npm", "start"]