# Use Node.js official image
FROM node:20

# Set working directory
WORKDIR /app

# Copy dependencies and install
COPY package*.json ./
RUN npm install

# Copy the rest
COPY . .

# Build TypeScript
RUN npm run build

# Generate Prisma Client
RUN npx prisma generate

# Expose port (change if needed)
EXPOSE 8080

# Run the server
CMD ["node", "dist/server.js"]
