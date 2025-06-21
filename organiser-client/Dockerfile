# Use official Node image
FROM node:20.17

# Set working directory
WORKDIR /app

# Copy only package files first (for layer caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the app
COPY . .

# Expose default dev port
EXPOSE 3000

# Start the app
CMD ["npm", "run", "dev", "--", "--host"]
