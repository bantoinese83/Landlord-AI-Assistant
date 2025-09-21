#!/bin/bash
# Activation script for the backend virtual environment

echo "Activating virtual environment for Landlord AI Assistant Backend..."
source venv/bin/activate
echo "Virtual environment activated!"
echo "Python version: $(python --version)"
echo "Pip version: $(pip --version)"
echo ""
echo "To deactivate, run: deactivate"
echo "To start the FastAPI server, run: uvicorn main:app --reload --host 0.0.0.0 --port 8000"
