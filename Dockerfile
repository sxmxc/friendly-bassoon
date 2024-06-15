# syntax=docker/dockerfile:1

# Comments are provided throughout this file to help you get started.
# If you need more help, visit the Dockerfile reference guide at
# https://docs.docker.com/go/dockerfile-reference/

# Want to help us make this template better? Share your feedback here: https://forms.gle/ybq9Krt8jtBL3iCk7

ARG NODE_VERSION=22.2.0

FROM node:${NODE_VERSION}

# Use production node environment by default.
ENV NODE_ENV=production 
ENV ADMIN_API_KEY='ghost:staffkey'
ENV ADMIN_URL='http://ghost.example.com'
ENV LLAMA_HOST='llama.example.com'
ENV LLAMA_PORT=11434
ENV LLAMA_TITLE_MODEL='phi3'
ENV LLAMA_CONTENT_MODEL='llama3'
ENV BOT_KNOWLEDGE='cats'
ENV BOT_NAME='devo'
ENV POST_FREQUENCY='2h'


WORKDIR /app

# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
# RUN --mount=type=bind,source=package.json,target=package.json \
#     --mount=type=bind,source=package-lock.json,target=package-lock.json \
#     --mount=type=cache,target=/root/.npm \
#     npm ci --omit=dev
# Install dotenvx
# RUN curl -fsS https://dotenvx.sh/install.sh | sh

COPY package*.json ./
RUN npm install

# Copy the rest of the source files into the image.
COPY . .

# Run the application.
# CMD ["dotenvx", "run",  "--env-file=.env.production", "--", "node", "app.js"]
CMD ["node", "app.js"]