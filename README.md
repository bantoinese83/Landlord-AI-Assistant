# 🏠 Landlord AI Assistant

<div align="center">

![Landlord AI Assistant](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14.2.32-black)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104.1-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

**A comprehensive, AI-powered property management solution designed to streamline landlord operations and enhance tenant relationships.**

[Live Demo](#) • [Documentation](#) • [Report Bug](#) • [Request Feature](#)

</div>

## 🚀 Overview

The Landlord AI Assistant is a modern, full-stack property management platform that combines cutting-edge technology with intuitive design to revolutionize how landlords manage their rental properties. Built with enterprise-grade architecture and powered by artificial intelligence, it provides everything needed to efficiently manage properties, tenants, and finances.

## ✨ Key Features

### 🏢 **Property Management**
- **Multi-Property Support**: Manage unlimited rental properties with detailed information
- **Property Analytics**: Track property performance, occupancy rates, and financial metrics
- **Document Management**: Store and organize property-related documents and photos
- **Market Analysis**: AI-powered rent optimization and market trend analysis

### 👥 **Tenant Management**
- **Comprehensive Tenant Profiles**: Complete tenant information with lease tracking
- **Lease Management**: Automated lease renewal reminders and document generation
- **Communication Hub**: AI-assisted tenant communication and automated responses
- **Tenant Portal**: Self-service portal for rent payments and maintenance requests

### 💰 **Financial Management**
- **Rent Tracking**: Automated rent collection tracking and payment history
- **Financial Reporting**: Comprehensive financial reports and analytics
- **Expense Management**: Track maintenance costs and property expenses
- **Tax Preparation**: Generate reports for tax filing and accounting

### 🔧 **Maintenance Management**
- **Request Tracking**: Streamlined maintenance request submission and tracking
- **Vendor Management**: Manage maintenance vendors and service providers
- **AI Recommendations**: Intelligent maintenance scheduling and cost optimization
- **Priority Management**: Automated priority assignment based on urgency

### 🤖 **AI-Powered Features**
- **Smart Insights**: AI-generated property performance insights and recommendations
- **Predictive Analytics**: Forecast maintenance needs and tenant turnover
- **Automated Communication**: AI-assisted tenant communication and responses
- **Market Intelligence**: Real-time market analysis and rent optimization suggestions

### 📱 **Modern User Experience**
- **Responsive Design**: Mobile-first design that works on all devices
- **Intuitive Interface**: Clean, modern UI built with Tailwind CSS and DaisyUI
- **Real-time Updates**: Live data synchronization across all devices
- **Accessibility**: Full accessibility compliance with ARIA standards

## 🛠️ Technology Stack

### Frontend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.2.32 | React framework with App Router |
| **React** | 18.2.0 | UI library with hooks and context |
| **TypeScript** | 5.0.0 | Type-safe JavaScript development |
| **Tailwind CSS** | 3.3.0 | Utility-first CSS framework |
| **DaisyUI** | 4.4.0 | Component library for Tailwind |
| **React Query** | 3.39.0 | Data fetching and caching |
| **React Hook Form** | 7.47.0 | Form handling with validation |
| **Zod** | 3.22.0 | Schema validation |

### Backend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| **Python** | 3.8+ | Core programming language |
| **FastAPI** | 0.104.1 | Modern, fast web framework |
| **SQLAlchemy** | 2.0.23 | Python SQL toolkit and ORM |
| **PostgreSQL** | Latest | Primary database system |
| **Redis** | 5.0.1 | Caching and session storage |
| **Uvicorn** | 0.24.0 | ASGI server implementation |
| **Alembic** | 1.12.1 | Database migration tool |
| **OpenAI** | 1.3.0 | AI integration and insights |

### DevOps & Deployment
- **Docker** & **Docker Compose** for containerization
- **Git** for version control
- **GitHub** for code repository and CI/CD
- **Environment-based configuration** for different deployment stages

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** 18.0.0 or higher
- **Python** 3.8 or higher
- **Git** for version control
- **Docker** (optional, for containerized deployment)
- **PostgreSQL** 12+ or **Supabase** account
- **Redis** 6.0+ (for caching and sessions)

### 📦 Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/bantoinese83/Landlord-AI-Assistant.git
cd Landlord-AI-Assistant
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
```

#### 3. Backend Setup
```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

#### 4. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit the .env file with your configuration
# Required variables:
# - DATABASE_URL
# - REDIS_URL
# - SECRET_KEY
# - OPENAI_API_KEY (optional, for AI features)
```

#### 5. Database Setup
```bash
# Run database migrations
cd backend
source venv/bin/activate
alembic upgrade head
```

### 🏃‍♂️ Running the Application

#### Development Mode
```bash
# Terminal 1 - Backend
cd backend
source venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev
```

#### Using Docker (Recommended)
```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

#### Quick Start Script
```bash
# Use the provided activation script
cd backend
./activate.sh
```

### 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **Admin Panel**: http://localhost:8000/admin

## 📁 Project Structure

```
landlord-ai-assistant/
├── 📁 frontend/                    # Next.js 14 Frontend Application
│   ├── 📁 app/                     # App Router (Next.js 14)
│   │   ├── 📁 auth/               # Authentication pages
│   │   ├── 📁 properties/         # Property management pages
│   │   ├── 📁 tenants/            # Tenant management pages
│   │   ├── 📁 maintenance/        # Maintenance request pages
│   │   ├── 📁 rent/               # Rent tracking pages
│   │   ├── 📁 ai-assistant/       # AI features pages
│   │   ├── layout.tsx             # Root layout component
│   │   └── page.tsx               # Home page
│   ├── 📁 components/             # Reusable React components
│   │   ├── 📁 dashboard/          # Dashboard components
│   │   ├── 📁 properties/         # Property-related components
│   │   ├── 📁 tenants/            # Tenant-related components
│   │   ├── 📁 maintenance/        # Maintenance components
│   │   ├── 📁 rent/               # Rent tracking components
│   │   ├── 📁 ai/                 # AI assistant components
│   │   ├── 📁 layout/             # Layout components
│   │   └── 📁 ui/                 # UI utility components
│   ├── 📁 lib/                    # Utilities and configurations
│   │   ├── api.ts                 # API client configuration
│   │   ├── auth-context.tsx       # Authentication context
│   │   └── auth-server.ts         # Server-side auth utilities
│   ├── package.json               # Frontend dependencies
│   ├── tailwind.config.js         # Tailwind CSS configuration
│   └── next.config.js             # Next.js configuration
├── 📁 backend/                    # FastAPI Backend Application
│   ├── 📁 app/                    # Main application code
│   │   ├── 📁 models/             # SQLAlchemy database models
│   │   ├── 📁 schemas/            # Pydantic data schemas
│   │   ├── 📁 routers/            # API route handlers
│   │   ├── 📁 services/           # Business logic services
│   │   ├── auth.py                # Authentication utilities
│   │   ├── config.py              # Application configuration
│   │   └── database.py            # Database connection setup
│   ├── 📁 alembic/                # Database migration files
│   ├── 📁 venv/                   # Python virtual environment
│   ├── requirements.txt           # Python dependencies
│   ├── main.py                    # FastAPI application entry point
│   └── activate.sh                # Virtual environment activation script
├── 📄 docker-compose.yml          # Docker services configuration
├── 📄 README.md                   # Project documentation
├── 📄 SETUP.md                    # Detailed setup instructions
└── 📄 .gitignore                  # Git ignore rules
```

## 🤝 Contributing

We welcome contributions to the Landlord AI Assistant! Here's how you can help:

### 🐛 Reporting Issues
- Use the [GitHub Issues](https://github.com/bantoinese83/Landlord-AI-Assistant/issues) page
- Provide detailed descriptions and steps to reproduce
- Include system information and error logs

### 💡 Suggesting Features
- Open a [Feature Request](https://github.com/bantoinese83/Landlord-AI-Assistant/issues/new?template=feature_request.md)
- Describe the feature and its benefits
- Consider implementation complexity and user impact

### 🔧 Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and add tests
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

### 📋 Code Standards
- Follow TypeScript/JavaScript best practices
- Use meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support & Contact

- **Documentation**: [Project Wiki](https://github.com/bantoinese83/Landlord-AI-Assistant/wiki)
- **Issues**: [GitHub Issues](https://github.com/bantoinese83/Landlord-AI-Assistant/issues)
- **Discussions**: [GitHub Discussions](https://github.com/bantoinese83/Landlord-AI-Assistant/discussions)
- **Email**: [Your Email Here]

## 🙏 Acknowledgments

- **Next.js Team** for the amazing React framework
- **FastAPI Team** for the high-performance Python web framework
- **Tailwind CSS** for the utility-first CSS framework
- **DaisyUI** for the beautiful component library
- **OpenAI** for AI integration capabilities
- **All Contributors** who help make this project better

---

<div align="center">

**Made with ❤️ for landlords and property managers**

[⭐ Star this repo](https://github.com/bantoinese83/Landlord-AI-Assistant) • [🐛 Report Bug](https://github.com/bantoinese83/Landlord-AI-Assistant/issues) • [💡 Request Feature](https://github.com/bantoinese83/Landlord-AI-Assistant/issues)

</div>
