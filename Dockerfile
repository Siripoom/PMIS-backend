# Use Node.js 18 on Alpine (smaller, optimized for container environments)
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./

# Install production dependencies only
RUN npm install --omit=dev

# Copy application code
COPY . .

# Create a directory for reports
RUN mkdir -p reports
RUN chmod 777 reports

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]