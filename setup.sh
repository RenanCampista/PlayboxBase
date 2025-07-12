#!/bin/bash
#curl -X POST http://localhost:3000/admin/create-first-admin   -H "Content-Type: application/json"   -d '{"name": "Admin", "email": "admin@email.com", "password": "admin123"}'
# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Função para verificar se um comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Função para verificar se um diretório existe
dir_exists() {
    [ -d "$1" ]
}

# Header
echo -e "${BLUE}================================${NC}"
echo -e "${BLUE}         SETUP SCRIPT           ${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Verificar se Node.js está instalado
print_info "Verificando Node.js..."
if command_exists node; then
    NODE_VERSION=$(node --version)
    print_success "Node.js encontrado: $NODE_VERSION"
else
    print_error "Node.js não encontrado. Por favor, instale Node.js primeiro."
    echo "Visite: https://nodejs.org/"
    exit 1
fi

# Verificar se npm está instalado
print_info "Verificando npm..."
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    print_success "npm encontrado: $NPM_VERSION"
else
    print_error "npm não encontrado. Por favor, instale npm primeiro."
    exit 1
fi

# Obter o diretório do script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
print_info "Diretório do projeto: $SCRIPT_DIR"

# Verificar estrutura do projeto
print_info "Verificando estrutura do projeto..."

if ! dir_exists "$SCRIPT_DIR/server"; then
    print_error "Diretório 'server' não encontrado!"
    exit 1
fi

if ! dir_exists "$SCRIPT_DIR/client"; then
    print_error "Diretório 'client' não encontrado!"
    exit 1
fi

print_success "Estrutura do projeto verificada"

# Configurar Backend
echo ""
print_info "Configurando Backend..."
cd "$SCRIPT_DIR/server"

if [ ! -f "package.json" ]; then
    print_error "package.json não encontrado no server!"
    exit 1
fi

print_info "Instalando dependências do server..."
npm install

if [ $? -eq 0 ]; then
    print_success "Dependências do server instaladas com sucesso"
else
    print_error "Falha ao instalar dependências do server"
    exit 1
fi

# Verificar se o Prisma está configurado
print_info "Configurando Prisma..."
if [ -f "prisma/schema.prisma" ]; then
    print_info "Gerando cliente Prisma..."
    npx prisma generate
    
    if [ $? -eq 0 ]; then
        print_success "Cliente Prisma gerado com sucesso"
    else
        print_error "Falha ao gerar cliente Prisma"
        exit 1
    fi
else
    print_warning "Schema do Prisma não encontrado. Pule se não for necessário."
fi

# Configurar Frontend
echo ""
print_info "Configurando Frontend..."
cd "$SCRIPT_DIR/client"

if [ ! -f "package.json" ]; then
    print_error "package.json não encontrado no client!"
    exit 1
fi

print_info "Instalando dependências do client..."
npm install

if [ $? -eq 0 ]; then
    print_success "Dependências do client instaladas com sucesso"
else
    print_error "Falha ao instalar dependências do client"
    exit 1
fi

# Criar arquivo .env se não existir
if [ ! -f ".env" ]; then
    print_info "Criando arquivo .env para o client..."
    cat > .env << EOF
# Configuração da API Backend
REACT_APP_API_URL=http://localhost:3000
EOF
    print_success "Arquivo .env criado"
else
    print_info "Arquivo .env já existe"
fi

# Verificar se o arquivo .env do server existe
print_info "Verificando configuração do server..."
cd "$SCRIPT_DIR/server"

if [ ! -f ".env" ]; then
    print_warning "Arquivo .env não encontrado no server"
    print_info "Criando arquivo .env básico para o server..."
    cat > .env << EOF
# Configuração do Banco de Dados
DATABASE_URL="mysql://root:root@localhost:3306/play_box"

# Configuração do Servidor
PORT=3000

JWT_SECRET="sua-chave-secreta-super-segura-aqui-com-pelo-menos-32-caracteres"

EOF
    print_success "Arquivo .env criado para o server"
    print_warning "IMPORTANTE: Configure a DATABASE_URL com suas credenciais do banco"
else
    print_info "Arquivo .env do server já existe"
fi

# Resumo final
echo ""
echo -e "${GREEN}================================${NC}"
echo -e "${GREEN}     SETUP CONCLUÍDO COM SUCESSO${NC}"
echo -e "${GREEN}================================${NC}"
echo ""

print_info "Próximos passos:"
echo ""
echo "   Terminal 1: cd server && npm run dev"
echo "   Terminal 2: cd client && npm start"
echo ""

print_info "URLs do projeto:"
echo "   Backend:  http://localhost:3000"
echo "   Frontend: http://localhost:3001"
echo ""

print_success "Setup concluído! 🚀"
