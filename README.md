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

### Containerização
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
- **Banco MySQL**: localhost:3307
  - Usuário: `playbox_user`
  - Senha: `playbox_password`
  - Database: `playbox`

### Opção 2: Sem Docker
Note: Nesta opção, você deve ter o Node.js e o MySQL instalados localmente.
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

4. Crie um banco de dados MySQL chamado `playbox` executando os seguintes comandos no MySQL:
   
   4.1. Abra o terminal MySQL e execute o seguinte comando:
   ```bash
   mysql -u root -p
   ```
   4.2. Insira a senha do usuário root do MySQL quando solicitado. Em seguida, crie o banco de dados:
   ```bash
   CREATE DATABASE play_box CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
   4.3. Saia do MySQL:
   ```bash
   EXIT;
   ```

5. Configure as variáveis de ambiente:
    Na pasta `server`, crie um arquivo `.env` e adicione as seguintes variáveis:
   ```env
    # Configuração do Banco de Dados
    DATABASE_URL="mysql://root:root@localhost:3306/play_box"

    # Configuração do Servidor
    PORT=3000

    JWT_SECRET="sua-chave-secreta-super-segura-aqui-com-pelo-menos-32-caracteres"
   ```

   **Observação**: O script `setup.sh` criará automaticamente os arquivos `.env` se eles não existirem.

6. Configure o Prisma:
   ```bash
   cd server
   npx prisma generate
   npx prisma db push
   ```

7. Inicie o servidor de desenvolvimento:
   ```bash
   cd server
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