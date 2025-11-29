#!/bin/bash

# Phi-3.5 Mini Setup Script for Mac/Linux
# This script helps set up Ollama and pull the Phi-3.5 Mini model

echo ""
echo "============================================"
echo "Phi-3.5 Mini Setup for AI-Agri Assistant"
echo "============================================"
echo ""

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo "[ERROR] Ollama is not installed or not in PATH"
    echo ""
    echo "Please download and install Ollama from: https://ollama.ai"
    echo ""
    exit 1
fi

echo "[OK] Ollama found!"
echo ""

# Check if Ollama is running
echo "Checking if Ollama is running..."
if ! curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "[WARNING] Ollama service is not running"
    echo ""
    echo "Please start Ollama first:"
    echo "1. Open Ollama application"
    echo "2. Or run: ollama serve"
    echo ""
    exit 1
fi

echo "[OK] Ollama is running!"
echo ""

# Pull Phi-3.5 model
echo "Pulling Phi-3.5 Mini model..."
echo "This may take a few minutes on first run..."
echo ""

ollama pull phi3.5

echo ""
echo "============================================"
echo "Setup Complete!"
echo "============================================"
echo ""
echo "Phi-3.5 Mini is now installed and running."
echo ""
echo "You can now use the FAQ generation with real responses."
echo "Test it with: http://localhost:8000/api/faq/generate?question=How%20to%20grow%20wheat?"
echo ""
