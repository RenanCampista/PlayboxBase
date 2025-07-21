# PlayBox
Desenvolvimento de uma plataforma web de avaliação de jogos para a disciplina de Projeto Integrado.

## Tecnologias Utilizadas

### Frontend
- **React** - Biblioteca JavaScript para construção de interfaces
- **React Scripts** - Ferramenta de build e desenvolvimento do Create React App
- **Axios** - Cliente HTTP para comunicação com a API
- **React Testing Library** - Biblioteca de testes para componentes React
- **Jest** - Framework de testes JavaScript
- **Web Vitals** - Métricas de performance web

### Backend
- **Node.js** - Runtime JavaScript para servidor
- **Express** - Framework web para Node.js
- **Prisma** - ORM moderno para TypeScript e JavaScript
- **MySQL** - Sistema de gerenciamento de banco de dados
- **bcryptjs** - Biblioteca para hash de senhas
- **CORS** - Middleware para permitir requisições cross-origin
- **dotenv** - Carregamento de variáveis de ambiente
- **Nodemon** - Ferramenta de desenvolvimento para restart automático

### Autenticação e Segurança
- **JWT (JSON Web Token)** - Autenticação baseada em tokens

### Containerização e DevOps
- **Docker** - Containerização da aplicação
- **Docker Compose** - Orquestração de containers
- **MySQL Docker Image** - Banco de dados containerizado


### Ferramentas de Desenvolvimento
- **ESLint** - Linter para JavaScript
- **Git** - Controle de versão
- **Makefile** - Automação de comandos Docker

## Pré-requisitos

- **Docker** - Para containerização da aplicação
- **Docker Compose** - Para orquestração dos containers
- **Make** (opcional) - Para usar comandos automatizados

## Instalação e Execução

### Opção 1: Usando Makefile (Recomendado)

1. Clone o repositório:
   ```bash
   git clone https://github.com/RenanCampista/Playbox.git
   ```

2. Navegue até o diretório do projeto:
   ```bash
   cd Playbox
   ```

3. Inicie a aplicação completa:
   ```bash
   make dev
   ```

### Opção 2: Usando Docker Compose

1. Clone o repositório:
   ```bash
   git clone https://github.com/RenanCampista/Playbox.git
   ```

2. Navegue até o diretório do projeto:
   ```bash
   cd Playbox
   ```

3. Inicie os containers:
   ```bash
   docker-compose up --build -d
   ```

4. Execute as migrações do banco:
   ```bash
   docker-compose exec backend npx prisma migrate deploy
   ```

### Acesso à Aplicação

Após a inicialização, você pode acessar:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Banco MySQL**: localhost:3307
  - Usuário: `playbox_user`
  - Senha: `playbox_password`
  - Database: `playbox`

### Comandos Úteis

```bash
# Parar todos os containers
make down

# Ver logs em tempo real
make logs-f

# Executar migrações
make migrate

# Acessar shell do backend
make shell-be

# Acessar shell do frontend
make shell-fe

# Acessar MySQL
make shell-db

# Limpar containers e volumes
make clean
```

## Estrutura do Projeto

```
PlayBox/
├── client/                    # Frontend React
│   ├── public/               # Arquivos públicos
│   ├── src/
│   │   ├── components/       # Componentes reutilizáveis
│   │   ├── pages/           # Páginas da aplicação
│   │   ├── services/        # Serviços da API
│   │   ├── styles/          # Arquivos CSS
│   │   └── utils/           # Utilitários
│   ├── Dockerfile           # Configuração Docker do frontend
│   └── package.json
├── server/                   # Backend Node.js
│   ├── prisma/              # Configuração do banco
│   ├── routes/              # Rotas da API
│   ├── services/            # Lógica de negócio
│   ├── scripts/             # Scripts utilitários
│   │   └── game_data_collector/  # Coleta de dados de jogos
│   ├── Dockerfile           # Configuração Docker do backend
│   ├── server.js            # Servidor principal
│   └── package.json
├── docker-compose.yml       # Orquestração dos containers
├── Makefile                # Comandos automatizados
├── README-DOCKER.md        # Documentação detalhada do Docker
└── README.md              # Este arquivo
```


### Funcionalidades Principais

#### Sistema de Autenticação
- Login e registro de usuários
- Autenticação JWT
- Recuperação de senha
- Controle de acesso (usuários e administradores)

#### Gestão de Jogos
- Catálogo de jogos com informações detalhadas
- Sistema de avaliações e comentários
- Filtragem por gêneros
- Catálogos personalizados (favoritos)

#### Arquitetura Containerizada
- Aplicação totalmente containerizada com Docker
- Banco de dados MySQL isolado
- Hot reload para desenvolvimento
- Configuração simplificada via Makefile

### Estrutura do Banco de Dados
- Usuários com perfis e permissões
- Jogos com metadados completos
- Sistema de reviews e ratings
- Catálogos organizados por gênero ou usuário


## Scripts Adicionais

### Coleta de Dados de Jogos
Para popular o banco com mais jogos da RAWG API:

1. Acesse o container do backend:
   ```bash
   make shell-be
   ```

2. Navegue até o script de coleta:
   ```bash
   cd scripts/game_data_collector
   ```

3. Configure a API key da RAWG (se necessário):
   ```bash
   echo 'RAWG_API_KEY="sua-chave-da-rawg-api"' >> .env
   ```

4. Execute o script:
   ```bash
   python main.py
   ```

### Backup do Banco de Dados

```bash
# Fazer backup
docker-compose exec database mysqldump -u playbox_user -p playbox > backup.sql

# Restaurar backup
docker-compose exec -T database mysql -u playbox_user -p playbox < backup.sql
```

## Solução de Problemas

### Portas em Uso
Se alguma porta estiver em uso, verifique:
```bash
lsof -i :3000  # Frontend
lsof -i :5000  # Backend
lsof -i :3307  # MySQL
```

### Logs de Debug
```bash
# Ver logs de todos os serviços
make logs-f

# Ver logs específicos
docker-compose logs frontend
docker-compose logs backend
docker-compose logs database
```

## Próximos Passos
- Implementar componentes de avaliação de jogos e sistema de comentários
- Adicionar testes unitários e de integração
- Implementar documentação da API com Swagger
- Adicionar configuração de produção (quando necessário)