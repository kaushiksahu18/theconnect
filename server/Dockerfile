# Read the doc: https://huggingface.co/docs/hub/spaces-sdks-docker
# you will also find guides on how best to write your Dockerfile

FROM node:22

WORKDIR /app
RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

# Ensure permissions are set correctly for the application directory
RUN mkdir -p /app/dist && chown -R node:node /app

# Copy the application source code
COPY --chown=node:node . .

EXPOSE 7860

ENV NODE_ENV='production'

CMD ["sh", "-c", "pnpm run dev && pnpm pm2 logs"]
