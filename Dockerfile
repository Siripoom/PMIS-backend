# Use an official Node.js runtime as the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application files, including wait-for-it.sh
COPY . .
#COPY wait-for-it.sh .

# Make wait-for-it.sh executable
# RUN chmod +x wait-for-it.sh



# Expose the application port
EXPOSE 3000
#"./wait-for-it.sh",
# Start the application with wait-for-it script
CMD [ "db", "5433", "--", "npm", "start"]
