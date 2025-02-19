# Use an official Node.js runtime as the base image
FROM node:18

# Install netcat for wait-for-it.sh to work
RUN apt-get update && apt-get install -y netcat

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock to install dependencies
COPY package*.json yarn.lock ./

# Install dependencies
RUN yarn install --production

# Copy the rest of the application files
COPY . .

# Make wait-for-it.sh executable
RUN chmod +x wait-for-it.sh

# Expose the application port
EXPOSE 3000

# Start the application with wait-for-it.sh
CMD ["./wait-for-it.sh", "db:5433", "--", "npm", "start"]
