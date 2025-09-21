# Landlord AI Assistant

A comprehensive property management application built with Next.js, React, TypeScript, Tailwind CSS, DaisyUI, Python FastAPI, SQLAlchemy, PostgreSQL, and Redis.

## Features

- **Property Management**: Add, edit, and manage multiple properties
- **Tenant Management**: Track tenant information, lease agreements, and contact details
- **Rent Tracking**: Monitor rent payments, generate invoices, and track payment history
- **Maintenance Requests**: Handle maintenance requests with status tracking
- **AI Assistant**: Intelligent property management assistance
- **Dashboard**: Comprehensive overview of all property management activities
- **Responsive Design**: Mobile-first design with Tailwind CSS and DaisyUI

## Tech Stack

### Frontend
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- DaisyUI

### Backend
- Python 3.11+
- FastAPI
- SQLAlchemy 2.0
- PostgreSQL (via Supabase)
- Redis
- Uvicorn

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- Redis
- PostgreSQL (or Supabase account)

### Installation

1. Clone the repository
2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Set up backend virtual environment and install dependencies:
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. Set up environment variables:
   ```bash
   cp .env.example .env
   ```

5. Run the development servers:
   ```bash
   # Frontend
   cd frontend
   npm run dev

   # Backend (make sure virtual environment is activated)
   cd backend
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

### Quick Start with Virtual Environment

For easier development, you can use the provided activation script:

```bash
cd backend
./activate.sh
```

This will activate the virtual environment and show you the available commands.

## Project Structure

```
landlord-ai-assistant/
├── frontend/                 # Next.js frontend
│   ├── app/                 # App router pages
│   ├── components/          # React components
│   ├── lib/                 # Utilities and configurations
│   └── types/               # TypeScript type definitions
├── backend/                 # FastAPI backend
│   ├── app/                 # Application code
│   ├── models/              # SQLAlchemy models
│   ├── schemas/             # Pydantic schemas
│   ├── routers/             # API routes
│   └── services/            # Business logic
└── docs/                    # Documentation
```

## License

MIT License
