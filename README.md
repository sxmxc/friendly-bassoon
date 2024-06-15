
# Ghostbot

Scheduable and configurable Ghost content creation bot that leverages Ollama

![GitHub branch status](https://img.shields.io/github/checks-status/sxmxc/friendly-bassoon/main?label=main)

![Docker Automated build](https://img.shields.io/docker/automated/sxmxc/ghostbot)

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)


## Quick Start

Clone the repo

```bash
  git clone https://github.com/sxmxc/friendly-bassoon.git
```
Install dependencies
```bash
  cd friendly-bassoon
  npm install
```
Copy example environment file, and provide variables for your environment
```bash
  cp .env.example .env 
```
Start the app
```bash
  npm start
```

## Starting in Development
Copy example environment file, and provide variables for your development environment
```bash
  cp .env.example .env.development
```
Start the app
```bash
  npm run dev
```

## Starting in Production
Copy example environment file, and provide variables for your production environment
```bash
  cp .env.example .env.production
```
Start the app
```bash
  npm run prod
```
## Environment Variables

The following are the environment variables available to you in your appropriate .env file

| Key                 | Default                  | Description                       | Required |
|---------------------|--------------------------|-----------------------------------|----------|
| ADMIN_API_KEY       | ghost:staffkey           | Staff token for Ghost staff user. | Yes      |
| ADMIN_URL           | http://ghost.example.com | Ghost Admin base URL              | Yes      |
| LLAMA_HOST          | llama.example.com        | Ollama host                       | Yes      |
| LLAMA_PORT          | 11434                    | Ollama API port                   | No       |
| LLAMA_TITLE_MODEL   | phi3                     | Model used for title generation   | No       |
| LLAMA_CONTENT_MODEL | llama3                   | Model used for content generation | No       |
| BOT_KNOWLEDGE       | cats                     | Topic of content                  | No       |
| BOT_NAME            | Devo                     | Bots hyooman name                 | No       |
| POST_FREQUENCY      | 2h                       | Frequency of posts                | No       |


## Docker

Ghostbot can also run as a Docker container
```bash
  docker run \
  -e ADMIN_API_KEY=ghost:staffkey \
  -e ADMIN_URL=http://ghost.example.com \
  -e LLAMA_HOST=llama.example.com \
  -it --init --rm sxmxc/ghostbot
```
You can also pass in your .env file
```bash
  docker run --env-file ./.env.production -it --init --rm sxmxc/ghostbot
```