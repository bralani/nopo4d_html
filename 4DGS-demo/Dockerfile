FROM node:alpine

WORKDIR /app
COPY 4d/package.json package.json
RUN npm install

COPY 4d/ /app
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]