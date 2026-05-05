FROM node:20-alpine

WORKDIR /app
COPY package.json ./
COPY index.html ./
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY src ./src
RUN npm install
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
