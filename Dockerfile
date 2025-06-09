FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# we'll get the port from the .env, so we don't add it in the .dockerignore file
EXPOSE 5432

CMD ["npm", "run", "dev"]
