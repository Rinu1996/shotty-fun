# Shotty 🎬

> Generate AI-powered videos from URLs or text using advanced AI models

Shotty is an AI video generation application that transforms text or web content into engaging videos. It leverages OpenAI, Fireworks AI, Whisper, and ElevenLabs APIs to create professional-quality video content automatically.

## ✨ Features

- 🤖 AI-powered video generation from text or URLs
- 🎙️ Text-to-speech with multiple voice options (ElevenLabs or local TTS)
- 📝 Automatic transcription with Whisper
- 🎨 Dynamic video composition with Remotion
- 🖼️ Stock media integration with Pexels
- ⚡ Queue-based processing with Redis
- 🐳 Easy deployment with Docker

## 🚀 Quick Start

### Prerequisites

- **Docker & Docker Compose** (recommended) OR
- **Node.js 21+** and **pnpm 8+** (for development)
- **API Keys** (see below)

### Required API Keys

1. **Fireworks AI** - Get from [https://fireworks.ai/](https://fireworks.ai/)
2. **OpenAI** - Get from [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
3. **Pexels** - Get from [https://www.pexels.com/api/](https://www.pexels.com/api/)
4. **ElevenLabs** (optional) - Get from [https://elevenlabs.io/](https://elevenlabs.io/) - Can use local TTS instead

### Installation & Running

#### Option 1: Docker Compose (Recommended)

This is the easiest way to run Shotty with all dependencies included.

```bash
# 1. Clone the repository
git clone https://github.com/n4ze3m/shotty-fun.git
cd shotty-fun

# 2. Copy and configure environment variables
cp .env.example .env

# 3. Edit .env and add your API keys
nano .env  # or use your favorite editor

# 4. Start the application
docker compose up
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **API**: http://localhost:3000/api
- **Health Check**: http://localhost:3000/health

#### Option 2: Development Mode

For local development without Docker:

```bash
# 1. Install dependencies
pnpm install

# 2. Set up environment variables
cp .env.example .env
# Edit .env with your API keys
# Important: Set REDIS_HOST=localhost for local dev

# 3. Start Redis (required)
redis-server

# 4. Set up the database
cd apps/api
npx prisma migrate dev
npx prisma generate
cd ../..

# 5. Run the application
pnpm dev
```

This will start:
- UI on http://localhost:5123
- API on http://localhost:3000

## 📋 Environment Configuration

Key environment variables (see `.env.example` for complete list):

```bash
# AI Services
FIREWORKS_API_KEY="your-fireworks-key"
OPENAI_API_KEY="your-openai-key"
PEXELS_API="your-pexels-key"
ELEVEN_LABS_API="your-elevenlabs-key"  # Optional

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/shotty"

# Redis
REDIS_HOST="cache"  # Use "localhost" for local dev
REDIS_PORT="6379"

# Application
NODE_ENV="production"
APP_MODE="production"
QUEUE_NAME="shotty-production"
```

## 🏗️ Architecture

```
shotty/
├── apps/
│   ├── api/          # Fastify backend API
│   │   ├── src/
│   │   │   ├── handlers/    # Request handlers
│   │   │   ├── plugins/     # Fastify plugins
│   │   │   ├── routes/      # API routes
│   │   │   ├── queue/       # Bull queue workers
│   │   │   └── utils/       # Utility functions
│   │   └── prisma/          # Database schema
│   └── ui/           # React + Vite frontend
│       └── src/
│           ├── components/  # React components
│           └── assets/      # Static assets
├── remotion/         # Video rendering engine
└── docker-compose.yml
```

## 🔧 Development

### Build the project

```bash
# Build all packages
pnpm build

# Build specific package
pnpm --filter api build
pnpm --filter ui build
```

### Run tests

```bash
# Run all tests
pnpm test

# Run API tests
pnpm --filter api test
```

## 🐳 Docker Compose Services

The `docker-compose.yml` includes:

- **app**: Main Shotty application (API + UI)
- **cache**: Redis for job queue
- **whisper**: Self-hosted Whisper API for transcription

## 📚 API Documentation

### Endpoints

- `GET /health` - Health check endpoint
- `GET /` - Serves the frontend UI
- `POST /api/v1/generate` - Generate video from text/URL
- `GET /api/v1/file/:id` - Get generated file

## 🗺️ Roadmap

- [x] Use Local Whisper model
- [x] Use Local TTS
- [x] Production-ready deployment setup
- [x] Security headers and rate limiting
- [x] Health check endpoints
- [ ] Use Local LLM
- [ ] Video templates
- [ ] Batch processing

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for GPT models
- Fireworks AI for fast inference
- Remotion for video rendering
- ElevenLabs for voice synthesis
- Pexels for stock media

## 💬 Support

If you have any questions or need help:

- Open an issue on GitHub
- Check existing issues for solutions
- Read the documentation

---

Made with ❤️ by [n4ze3m](https://github.com/n4ze3m)