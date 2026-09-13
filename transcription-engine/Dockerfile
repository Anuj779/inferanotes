FROM node:20-slim

# Install ffmpeg and python3 for yt-dlp
RUN apt-get update && apt-get install -y python3 ffmpeg curl && rm -rf /var/lib/apt/lists/*

# Install latest yt-dlp globally
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp
RUN chmod a+rx /usr/local/bin/yt-dlp

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 8080
CMD ["node", "server.js"]
