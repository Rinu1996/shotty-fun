# Shotty

🎬 **Shotty** is an AI-powered video generation platform that creates engaging social media videos from URLs or text. It combines OpenAI, Fireworks AI, Whisper, and ElevenLabs APIs to automatically generate videos with synchronized audio, text overlays, and dynamic visuals.

## ✨ Features

- 🤖 **AI-Powered Content Generation** - Transform text or URLs into engaging video content
- 🎵 **Audio Synthesis** - Generate natural-sounding voiceovers with ElevenLabs TTS
- 📝 **Smart Transcription** - Automatic speech-to-text with timestamp synchronization
- 🎨 **Dynamic Video Composition** - Automated video editing with text overlays and transitions
- 🔄 **Queue Processing** - Background job processing for video generation
- 📱 **Modern Web Interface** - Clean, responsive UI built with React and Mantine
- 🐳 **Docker Ready** - Easy deployment with Docker Compose
- 🔒 **Production Ready** - Security hardening, health checks, and monitoring

## 🚀 Quick Start

### Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/n4ze3m/shotty-fun.git
   cd shotty-fun
   ```

2. **Set up environment**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Start development environment**
   ```bash
   docker compose up
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - API: http://localhost:3000/api

### Production Deployment

For production deployment, see our comprehensive [Deployment Guide](DEPLOYMENT.md).

```bash
# Quick production setup
cp .env.production .env
# Edit .env with your production values
docker-compose -f docker-compose.prod.yml up -d
```

## 📋 Prerequisites

### Required API Keys
- **OpenAI API Key** - For AI text generation ([Get here](https://platform.openai.com/api-keys))
- **Fireworks AI API Key** - For additional AI capabilities ([Get here](https://fireworks.ai/))
- **ElevenLabs API Key** - For text-to-speech ([Get here](https://elevenlabs.io/))
- **Pexels API Key** - For stock media ([Get here](https://www.pexels.com/api/))

### System Requirements
- Docker and Docker Compose
- 4GB+ RAM
- 20GB+ storage space

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React UI      │    │   Fastify API   │    │   PostgreSQL    │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Remotion      │    │   Bull Queue    │    │     Redis       │
│   (Video Gen)   │◄──►│   (Jobs)        │◄──►│   (Cache)       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │   Whisper API   │
                    │   (Speech)      │
                    └─────────────────┘
```

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript, Mantine UI, Vite
- **Backend**: Node.js, Fastify, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Queue**: Bull/BullMQ with Redis
- **Video Processing**: Remotion, FFmpeg
- **AI Services**: OpenAI, Fireworks AI, ElevenLabs
- **Deployment**: Docker, Docker Compose

## 📚 API Documentation

### Health Endpoints
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed system status
- `GET /ready` - Readiness probe
- `GET /live` - Liveness probe

### Video Generation
- `POST /api/v1/generate` - Create new video generation job
- `GET /api/v1/generate/:id` - Get job status
- `GET /api/v1/file/:id` - Download generated video

## 🔧 Development

### Project Structure
```
shotty-fun/
├── apps/
│   ├── api/          # Fastify backend
│   └── ui/           # React frontend
├── remotion/         # Video generation
├── docker-compose.yml
└── Dockerfile
```

### Available Scripts
```bash
# Development
pnpm dev              # Start all services in development
pnpm ui:dev          # Start only frontend
pnpm api:dev         # Start only backend

# Building
pnpm build           # Build all applications
pnpm build:ui        # Build frontend only
pnpm build:api       # Build backend only

# Testing
pnpm test            # Run tests
pnpm lint            # Run linting
```

## 🚦 Roadmap

- [x] ✅ Local Whisper model integration
- [x] ✅ Local TTS support
- [x] ✅ Production-ready deployment
- [x] ✅ Security hardening
- [x] ✅ Health monitoring
- [ ] 🔄 Local LLM integration
- [ ] 🔄 Multi-language support
- [ ] 🔄 Advanced video templates
- [ ] 🔄 Batch processing
- [ ] 🔄 API rate limiting dashboard

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Remotion](https://remotion.dev) - For video generation capabilities
- [Fastify](https://fastify.io) - For the high-performance backend
- [Mantine](https://mantine.dev) - For the beautiful UI components
- [Prisma](https://prisma.io) - For the excellent database toolkit

## 📞 Support

- 📧 **Issues**: [GitHub Issues](https://github.com/n4ze3m/shotty-fun/issues)
- 📖 **Documentation**: [Wiki](https://github.com/n4ze3m/shotty-fun/wiki)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/n4ze3m/shotty-fun/discussions)

---

<div align="center">
  <strong>Made with ❤️ by the Shotty team</strong>
</div>