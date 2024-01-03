FROM node:18-alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY public/ /app/public
COPY src/ /app/src
COPY package.json* package-lock.json* tsconfig.json /app
RUN npm install
CMD ["npm", "start"]
EXPOSE 3000
