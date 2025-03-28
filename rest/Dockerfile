# Base image
FROM node:20-alpine

# Install build dependencies for bcrypt and pnpm
RUN apk add --no-cache python3 make g++ && npm install -g pnpm

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
RUN pnpm install

# Copy everything else
COPY . .

# Create uploads directory
RUN mkdir -p uploads

# Build the application
RUN npm run build

# Expose port
EXPOSE 4000

# Start the server using production build
CMD [ "pnpm", "run", "start:prod" ]
