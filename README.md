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
- **JWT (JSON Web Token)** - Autenticação baseada em tokens

### Containerização
- **Docker** - Containerização da aplicação
- **Docker Compose** - Orquestração de containers


## Instalação e Execução

### Opção 1: Usando Docker (Recomendado)
Note: Nesta opção é necessário ter o Docker e Docker Compose instalados.
1. Clone o repositório:
   ```bash
   git clone https://github.com/RenanCampista/Playbox.git
   ```

2. Navegue até o diretório do projeto:
   ```bash
   cd Playbox
   ```

3. Execute o setup automático:
   ```bash
   make setup
   ```

   O script automaticamente:
   - Instala dependências do backend e frontend
   - Cria arquivo `.env` a partir do `.env.example`
   - Configura links simbólicos necessários

4. Edite o arquivo `.env` com suas configurações.

5. Inicie a aplicação completa:
   ```bash
   make dev
   ```

Após seguir esses passos, você deve ser capaz de acessar:
- **Backend**: `http://localhost:5000` 
- **Frontend**: `http://localhost:5001`


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

3. Execute o setup inicial:
   ```bash
   make setup
   ```

4. Configure o arquivo `.env` na raiz do projeto:

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

Após seguir esses passos, você deve ser capaz de acessar:
- **Backend**: `http://localhost:5000` 
- **Frontend**: `http://localhost:5001`


## Scripts Adicionais

### Coleta de Dados de Jogos
Leia a [documentação](scripts/game_data_collector/README.md) do script.

### Logs de Debug (Docker)
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