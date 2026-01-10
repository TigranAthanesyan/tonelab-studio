# Use the official Node.js image as a base
FROM node:25-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Build the project
RUN npm run build

# Expose the port Next.js uses
EXPOSE 3000

# Run the production build
CMD ["npm", "start"]
