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
- **PostgreSQL** - Sistema de gerenciamento de banco de dados
- **bcryptjs** - Biblioteca para hash de senhas
- **CORS** - Middleware para permitir requisições cross-origin
- **dotenv** - Carregamento de variáveis de ambiente
- **Nodemon** - Ferramenta de desenvolvimento para restart automático

### Autenticação e Segurança
- **JWT (JSON Web Token)** - Autenticação baseada em tokens

### Containerização
- **Docker** - Containerização da aplicação
- **Docker Compose** - Orquestração de containers
- **PostgreSQL Docker Image** - Banco de dados containerizado


### Ferramentas de Desenvolvimento
- **ESLint** - Linter para JavaScript
- **Git** - Controle de versão
- **Makefile** - Automação de comandos Docker

## Pré-requisitos

- **Docker** - Para containerização da aplicação
- **Docker Compose** - Para orquestração dos containers
- **Make** (opcional) - Para usar comandos automatizados

## Instalação e Execução

### Opção 1: Usando Docker (Recomendado)

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

Após a inicialização, você pode acessar:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Banco PostgreSQL**: localhost:5432
  - Usuário: `playbox_user`
  - Senha: `playbox_password`
  - Database: `playbox`

## Configuração do Banco de Dados

O projeto utiliza **PostgreSQL** como banco de dados. Você pode escolher entre duas opções:

### Opção A: Banco PostgreSQL na Nuvem (Neon.tech) - Recomendado
1. Crie uma conta gratuita em [Neon.tech](https://neon.tech)
2. Crie um novo banco de dados
3. Copie a connection URL fornecida
4. No arquivo `server/.env`, substitua a `DATABASE_URL` pela sua URL

### Opção B: PostgreSQL Local
1. Instale PostgreSQL na sua máquina
2. Crie um banco de dados chamado `playbox`
3. Configure a `DATABASE_URL` no arquivo `server/.env`:
   ```
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/playbox"
   ```

### Opção 2: Sem Docker
Note: Nesta opção, você deve ter o Node.js instalado localmente.
1. Clone o repositório:
   ```bash
   git clone https://github.com/RenanCampista/Playbox.git
   ```

2. Navegue até o diretório do projeto:
   ```bash
   cd Playbox
   ```
3. Instale as dependências do projeto:
   ```bash
   make setup
   ```

4. Configure o banco de dados PostgreSQL (ver opções acima)

5. Execute as migrações do banco de dados:
   ```bash
   cd server
   npx prisma migrate dev --name init
   ```

6. Inicie o servidor backend:
   ```bash
   cd server
   npm run dev
   ```

7. Em outro terminal, inicie o frontend:
   ```bash
   cd client
   npm start
   ```

Após a inicialização, você pode acessar:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
   npm run dev
   ```
8. Abra outro terminal e inicie o cliente:
   ```bash
   cd client
   npm start
   ```

Após seguir esses passos, você deve ser capaz de acessar:
- **Backend**: `http://localhost:3000` 
- **Frontend**: `http://localhost:3001`

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


## Scripts Adicionais

### Coleta de Dados de Jogos
Leia a [documentação](scripts/game_data_collector/README.md) do script.

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