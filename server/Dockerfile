FROM node:20.19

WORKDIR /app

# Only copy package files first to optimize caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Install tsx globally if needed (optional, can also be dev dep)
# RUN npm install -g tsx

# Copy the rest of the app
COPY . .

# Generate Prisma client
RUN npx prisma generate

EXPOSE 3000

# Use tsx to run the dev server
CMD ["npm", "run", "dev"]