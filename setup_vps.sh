#!/bin/bash

# Script to setup VPS for RoengVaree Quotation
# Usage: chmod +x setup_vps.sh && ./setup_vps.sh

echo "🚀 Starting VPS Setup..."

# 1. Update System
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# 2. Install Docker
echo "🐳 Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    echo "✅ Docker installed successfully."
else
    echo "ℹ️ Docker is already installed."
fi

# 3. Install Docker Compose
echo "🛠 Installing Docker Compose..."
sudo apt install -y docker-compose-plugin
echo "✅ Docker Compose installed successfully."

# 4. Configure Firewall (UFW)
echo "🔥 Configuring Firewall..."
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
echo "y" | sudo ufw enable
echo "✅ Firewall configured (SSH, 80, 443, 3000 allowed)."

echo "-----------------------------------------------"
echo "🎉 Setup Complete!"
echo "⚠️ Please LOG OUT and LOG IN again to apply Docker group changes."
echo "-----------------------------------------------"
