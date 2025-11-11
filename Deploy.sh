#!/bin/bash

# 🚀 Script de Deployment - CryptoTracker realSTRU dev
# Ejecuta este script en tu servidor Ubuntu

echo "=================================="
echo "🚀 Deploying CryptoTracker"
echo "=================================="
echo ""

# Colores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Variables
APP_NAME="crypto-tracker"
APP_DIR="/var/www/crypto-tracker-realstru"

# Función para imprimir mensajes
print_status() {
    echo -e "${BLUE}➜${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# 1. Verificar que estamos en el directorio correcto
if [ ! -d "$APP_DIR" ]; then
    print_error "Directorio $APP_DIR no encontrado"
    exit 1
fi

cd $APP_DIR
print_success "En directorio: $APP_DIR"

# 2. Pull latest changes from git
print_status "Obteniendo últimos cambios de Git..."
git pull origin main
print_success "Código actualizado"

# 3. Instalar dependencias
print_status "Instalando dependencias..."
npm install --production=false
print_success "Dependencias instaladas"

# 4. Build de producción
print_status "Creando build de producción..."
npm run build
print_success "Build creado en /dist"

# 5. Crear directorio de logs si no existe
if [ ! -d "logs" ]; then
    mkdir logs
    print_success "Directorio de logs creado"
fi

# 6. Detener app si está corriendo
print_status "Deteniendo app anterior..."
pm2 delete $APP_NAME 2>/dev/null || true
print_success "App detenida"

# 7. Iniciar con PM2
print_status "Iniciando app con PM2..."
pm2 start ecosystem.config.js
print_success "App iniciada"

# 8. Guardar configuración de PM2
print_status "Guardando configuración de PM2..."
pm2 save
print_success "Configuración guardada"

# 9. Configurar PM2 para iniciar en boot
print_status "Configurando PM2 para auto-inicio..."
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u $USER --hp $HOME
print_success "Auto-inicio configurado"

# 10. Verificar estado
echo ""
echo "=================================="
print_success "🎉 Deployment completado!"
echo "=================================="
echo ""
pm2 status
echo ""
echo "Ver logs: pm2 logs $APP_NAME"
echo "Estado: pm2 status"
echo "Reiniciar: pm2 restart $APP_NAME"
echo ""
print_status "La app está corriendo en: http://localhost:3000"
print_status "Configura Nginx Proxy Manager para apuntar a localhost:3000"
echo ""