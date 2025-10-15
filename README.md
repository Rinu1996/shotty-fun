# Shotty 🎬

**AI-Powered Video Generation Platform**

Shotty is a powerful application that generates engaging social media videos from URLs or text using cutting-edge AI technologies including OpenAI, Fireworks, Whisper, and ElevenLabs APIs.

## ✨ Features

- 🎥 **AI Video Generation**: Create videos from URLs or text prompts
- 🎤 **Audio Processing**: Whisper-powered speech-to-text transcription
- 🗣️ **Text-to-Speech**: ElevenLabs integration for natural voice synthesis
- 🖼️ **Image Processing**: Pexels API integration for high-quality visuals
- ⚡ **Queue System**: Redis-powered job processing for scalability
- 🐳 **Docker Ready**: Complete containerization for easy deployment
- 📊 **Health Monitoring**: Built-in health checks and monitoring endpoints

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- PostgreSQL database
- Redis instance
- API Keys (see Configuration section)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/n4ze3m/shotty-fun.git
   cd shotty-fun
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys and configuration
   ```

3. **Start the application**
   ```bash
   docker compose up -d
   ```

4. **Access the application**
   - Web UI: http://localhost:3000
   - API Health: http://localhost:3000/health

## 🔧 Configuration

### Required API Keys

| Service | Purpose | Get API Key |
|---------|---------|-------------|
| **Fireworks** | AI text generation | [fireworks.ai](https://fireworks.ai/) |
| **OpenAI** | AI processing | [platform.openai.com](https://platform.openai.com/api-keys) |
| **ElevenLabs** | Text-to-speech | [elevenlabs.io](https://elevenlabs.io/) |
| **Pexels** | Stock images | [pexels.com/api](https://www.pexels.com/api/) |

### Environment Variables

See `.env.example` for complete configuration options.

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React UI      │    │   Fastify API   │    │   Remotion      │
│   (Port 3000)   │◄──►│   (Port 3000)   │◄──►│   Video Engine  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   PostgreSQL    │
                       │   Database      │
                       └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Redis Queue   │
                       │   (Job Processing)│
                       └─────────────────┘
```

## 📚 API Documentation

### Health Endpoints

- `GET /health` - Application health status
- `GET /ready` - Readiness check for load balancers

### Video Generation

- `POST /api/v1/generate` - Generate video from URL or text
- `GET /api/v1/file/:id` - Download generated video file

## 🐳 Production Deployment

### Docker Compose (Recommended)

```bash
# Production deployment
docker compose -f docker-compose.yml up -d
```

### Manual Docker Build

```bash
# Build the application
docker build -t shotty:latest .

# Run with environment file
docker run -d \
  --name shotty \
  --env-file .env \
  -p 3000:3000 \
  shotty:latest
```

### Environment Setup

1. **Database Migration**
   ```bash
   # Run database migrations
   docker exec -it shotty npx prisma migrate deploy
   ```

2. **Health Check**
   ```bash
   # Verify application is running
   curl http://localhost:3000/health
   ```

## 🔍 Monitoring

### Health Checks

The application provides comprehensive health monitoring:

- **Database connectivity**
- **Redis queue status**
- **API endpoint availability**

### Logs

```bash
# View application logs
docker compose logs -f app

# View specific service logs
docker compose logs -f api
docker compose logs -f ui
```

## 🛠️ Development

### Local Development

```bash
# Install dependencies
pnpm install

# Start development servers
pnpm dev

# Build for production
pnpm build
```

### Project Structure

```
shotty/
├── apps/
│   ├── api/          # Fastify API server
│   └── ui/           # React frontend
├── remotion/         # Video generation engine
├── docker-compose.yml
├── Dockerfile
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📧 Email: [your-email@example.com]
- 🐛 Issues: [GitHub Issues](https://github.com/n4ze3m/shotty-fun/issues)
- 📖 Documentation: [Wiki](https://github.com/n4ze3m/shotty-fun/wiki)

## 🗺️ Roadmap

- [x] Local Whisper model integration
- [x] Local TTS implementation
- [ ] Local LLM integration
- [ ] Advanced video templates
- [ ] Batch processing capabilities
- [ ] Analytics dashboard
- [ ] Multi-language support

---

**Made with ❤️ by [n4ze3m](https://github.com/n4ze3m)**