# Landlord AI Assistant - Setup Guide

A comprehensive property management application built with Next.js, React, TypeScript, Tailwind CSS, DaisyUI, Python FastAPI, SQLAlchemy, PostgreSQL, and Redis.

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### 1. Clone and Setup

```bash
git clone <repository-url>
cd landlord-ai-assistant-upwork
```

### 2. Environment Configuration

```bash
# Copy environment template
cp env.example .env

# Edit the .env file with your configuration
nano .env
```

Required environment variables:
```env
# Database
DATABASE_URL=postgresql://landlord_user:landlord_password@localhost:5432/landlord_ai_db

# Redis
REDIS_URL=redis://localhost:6379

# JWT
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# AI Service (Optional)
OPENAI_API_KEY=your-openai-api-key-here

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=Landlord AI Assistant
```

### 3. Start the Application

```bash
# Make startup script executable
chmod +x start.sh

# Start all services
./start.sh
```

Or manually with Docker Compose:
```bash
docker-compose up --build -d
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs

## 🏗️ Architecture

### Backend (FastAPI)
- **Framework**: FastAPI with async support
- **Database**: PostgreSQL with SQLAlchemy 2.0 ORM
- **Caching**: Redis for session management and caching
- **Authentication**: JWT-based authentication
- **AI Integration**: OpenAI GPT for intelligent insights

### Frontend (Next.js)
- **Framework**: Next.js 15 with React 19
- **Styling**: Tailwind CSS with DaisyUI components
- **State Management**: React Query for server state
- **Type Safety**: TypeScript throughout
- **UI Components**: Responsive, mobile-first design

## 📁 Project Structure

```
landlord-ai-assistant/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── routers/        # API routes
│   │   ├── services/       # Business logic & AI services
│   │   ├── auth.py         # Authentication utilities
│   │   ├── config.py       # Configuration
│   │   └── database.py     # Database connection
│   ├── alembic/            # Database migrations
│   ├── main.py             # FastAPI application
│   └── requirements.txt    # Python dependencies
├── frontend/               # Next.js frontend
│   ├── app/                # App router pages
│   ├── components/         # React components
│   ├── lib/                # Utilities and configurations
│   └── types/              # TypeScript definitions
├── docker-compose.yml      # Docker services
└── start.sh               # Startup script
```

## 🔧 Features

### Core Property Management
- **Property Management**: Add, edit, and manage multiple properties
- **Tenant Management**: Track tenant information and lease agreements
- **Rent Tracking**: Monitor payments, generate invoices, track history
- **Maintenance Requests**: Handle requests with status tracking and priority management

### AI-Powered Features
- **Property Insights**: AI-generated market analysis and recommendations
- **Maintenance Recommendations**: Intelligent suggestions based on property data
- **Rent Analysis**: Market analysis and rent optimization suggestions
- **Tenant Communication**: Generate professional tenant communications

### User Experience
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Updates**: Live data synchronization
- **Intuitive Interface**: Clean, modern UI with DaisyUI components
- **Dashboard**: Comprehensive overview of all activities

## 🛠️ Development

### Backend Development

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start development server
uvicorn main:app --reload
```

### Frontend Development

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Database Migrations

```bash
cd backend

# Create new migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback migration
alembic downgrade -1
```

## 🚀 Deployment

### Production Deployment

1. **Environment Setup**:
   - Set production environment variables
   - Configure secure JWT secrets
   - Set up production database
   - Configure Redis instance

2. **Docker Deployment**:
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

3. **Database Setup**:
   ```bash
   # Run migrations
   docker-compose exec backend alembic upgrade head
   ```

### Environment Variables for Production

```env
ENVIRONMENT=production
DATABASE_URL=postgresql://user:password@db-host:5432/db_name
REDIS_URL=redis://redis-host:6379
SECRET_KEY=your-production-secret-key
ALLOWED_ORIGINS=https://your-domain.com
OPENAI_API_KEY=your-openai-api-key
```

## 🔐 Security

- JWT-based authentication with secure token handling
- Password hashing with bcrypt
- CORS configuration for secure cross-origin requests
- Input validation with Pydantic schemas
- SQL injection protection with SQLAlchemy ORM

## 📊 API Documentation

The API is fully documented with OpenAPI/Swagger:
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🤖 AI Integration

The application includes AI-powered features using OpenAI's GPT models:

1. **Property Insights**: Market analysis and recommendations
2. **Maintenance Recommendations**: Intelligent maintenance suggestions
3. **Rent Analysis**: Market-based rent pricing recommendations
4. **Tenant Communication**: Professional communication generation

To enable AI features, set your OpenAI API key in the environment variables.

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the API documentation at `/docs`
- Review the code comments and documentation
- Open an issue for bugs or feature requests

## 🎉 Getting Started

1. Follow the setup guide above
2. Access the application at http://localhost:3000
3. Create your first property
4. Add tenants and start managing your properties
5. Explore the AI features for intelligent insights

Happy property managing! 🏠✨
