# Shotty

Shotty is an AI-powered video generation platform that creates engaging videos from URLs or text using OpenAI, Fireworks, Whisper, and ElevenLabs APIs. Built with Fastify, React, and Remotion for high-performance video processing.

## Features ✨

- 🎥 **AI Video Generation**: Create videos from text or URLs using advanced AI models
- 🎵 **Audio Processing**: Whisper integration for speech-to-text and text-to-speech
- 🎨 **Modern UI**: Beautiful React interface with Mantine components
- ⚡ **High Performance**: Fastify backend with Redis queue processing
- 🐳 **Docker Ready**: Complete containerization with Docker Compose
- 🔒 **Production Ready**: Security headers, rate limiting, health checks
- 📊 **Monitoring**: Comprehensive logging and health monitoring

## Architecture 🏗️

- **Frontend**: React + TypeScript + Vite + Mantine UI
- **Backend**: Fastify + TypeScript + Prisma
- **Video Processing**: Remotion + FFmpeg
- **Queue**: Redis + Bull
- **Database**: PostgreSQL (via Prisma)
- **AI Services**: OpenAI, Fireworks, ElevenLabs, Whisper

## Getting Started 🚀

### Prerequisites 📋

- Docker & Docker Compose
- API Keys for:
  - OpenAI API
  - Fireworks API
  - ElevenLabs API
  - Pexels API (optional)

### Quick Start 🏃‍♂️

1. **Clone the repository**
   ```bash
   git clone https://github.com/n4ze3m/shotty-fun.git
   cd shotty-fun
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Start the application**
   ```bash
   docker compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - API: http://localhost:3000/api
   - Health Check: http://localhost:3000/health

### Development Setup 🛠️

1. **Install dependencies**
   ```bash
   pnpm install
   ```

2. **Start development servers**
   ```bash
   # Start all services
   pnpm dev
   
   # Or start individually
   pnpm ui:dev    # Frontend on :5173
   pnpm api:dev   # Backend on :3000
   ```

3. **Database setup**
   ```bash
   cd apps/api
   pnpm prisma:migrate
   pnpm prisma:generate
   ```

## API Documentation 📚

### Health Endpoints

- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed health with dependencies

### Video Generation

- `POST /api/v1/generate` - Generate video from text/URL
- `GET /api/v1/generate/:id/info` - Get video generation status

## Environment Variables 🔧

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `OPENAI_API_KEY` | OpenAI API key | Yes | - |
| `FIREWORKS_API_KEY` | Fireworks API key | Yes | - |
| `ELEVEN_LABS_API` | ElevenLabs API key | Yes | - |
| `PEXELS_API` | Pexels API key | No | - |
| `DATABASE_URL` | PostgreSQL connection string | Yes | - |
| `REDIS_HOST` | Redis host | Yes | `cache` |
| `REDIS_PORT` | Redis port | Yes | `6379` |
| `WHISPER_URL` | Whisper service URL | Yes | `http://whisper/v1/audio/transcriptions` |
| `NODE_ENV` | Environment mode | No | `production` |

## Production Deployment 🚀

### Docker Compose

The included `docker-compose.yml` is production-ready with:
- Health checks for all services
- Proper restart policies
- Volume persistence
- Resource limits
- Security configurations

### Environment Setup

1. **Set production environment variables**
   ```bash
   export NODE_ENV=production
   export DATABASE_URL="postgresql://user:password@host:5432/shotty"
   # ... other variables
   ```

2. **Deploy with Docker Compose**
   ```bash
   docker compose -f docker-compose.yml up -d
   ```

### Health Monitoring

- **Basic Health**: `GET /health`
- **Detailed Health**: `GET /health/detailed`
- **Docker Health**: Built-in Docker health checks

## Security 🔒

- Rate limiting (100 requests/minute)
- CORS configuration
- Security headers via Helmet
- Input validation and sanitization
- Error handling without sensitive data exposure

## Performance ⚡

- Redis caching for queue processing
- Multi-stage Docker builds
- Optimized bundle sizes
- Connection pooling
- Request/response compression

## Contributing 🤝

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License 📄

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Roadmap 📋

- [x] Use Local Whisper model
- [x] Use Local TTS
- [x] Production-ready deployment
- [x] Health monitoring
- [x] Security enhancements
- [ ] Use Local LLM
- [ ] Video templates
- [ ] Batch processing
- [ ] Analytics dashboard

## Support 💬

For support, please open an issue on GitHub or contact the maintainers.

---

Built with ❤️ by [n4ze3m](https://github.com/n4ze3m)