FROM node:16-bullseye

# Instala pip (já vem com python3.9)
RUN apt-get update && apt-get install -y python3-pip

WORKDIR /app

ENV NODE_ENV=production

# Dependências Node.js
COPY package.json yarn.lock ./
RUN yarn install

# Dependências Python
COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

# Código da aplicação
COPY . .

RUN yarn build

EXPOSE 3333

CMD ["node", "dist/shared/infra/http/server.js"]

