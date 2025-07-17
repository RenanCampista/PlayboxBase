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

### Scripts e Utilitários
- **Python** - Scripts para coleta de dados de jogos
- **RAWG API** - API externa para dados de jogos
- **requests** - Biblioteca Python para requisições HTTP

### Ferramentas de Desenvolvimento
- **ESLint** - Linter para JavaScript
- **Git** - Controle de versão

## Instalação
1. Clone o repositório:
   ```bash
   git clone https://github.com/RenanCampista/Playbox.git
    ```

2. Navegue até o diretório do projeto:
   ```bash
   cd Playbox
   ```

3. O arquivo `setup.sh` contém os comandos para instalar as dependências do projeto. Execute-o:
   ```bash
   ./setup.sh
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
├── client/                 # Frontend React
│   ├── public/            # Arquivos públicos
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── services/      # Serviços da API
│   │   ├── styles/        # Arquivos CSS
│   │   └── utils/         # Utilitários
│   └── package.json
├── server/                # Backend Node.js
│   ├── prisma/           # Configuração do banco
│   ├── routes/           # Rotas da API
│   ├── services/         # Lógica de negócio
│   ├── scripts/          # Scripts utilitários
│   │   └── game_data_collector/  # Coleta de dados de jogos
│   ├── server.js         # Servidor principal
│   └── package.json
├── setup.sh              # Script de instalação
└── README.md
```


## Funcionalidades

### Sistema de Autenticação
- Login e registro de usuários
- Autenticação JWT
- Recuperação de senha
- Controle de acesso (usuários e administradores)

### Gestão de Jogos
- Catálogo de jogos com informações detalhadas
- Sistema de avaliações e comentários
- Filtragem por gêneros
- Catálogos personalizados (favoritos)

### Coleta de Dados
- Script Python para coleta automática de dados de jogos via RAWG API
- Localizado em `server/scripts/game_data_collector/`

### Estrutura do Banco de Dados
- Usuários com perfis e permissões
- Jogos com metadados completos
- Sistema de reviews e ratings
- Catálogos organizados por gênero ou usuário

## Scripts Adicionais

### Coleta de Dados de Jogos
Para popular o banco de dados com jogos da RAWG API:

1. Configure a API key da RAWG no arquivo `.env` do servidor:
   ```env
   RAWG_API_KEY="sua-chave-da-rawg-api"
   ```

2. Execute o script de coleta:
   ```bash
   cd server/scripts/game_data_collector
   pip install -r requirements.txt
   python main.py
   ```

## Próximos Passos
- Terminar o frontend, incluindo a implementação de componentes de avaliação de jogos, sistema de comentários.
- Implementar testes unitários e de integração com Jest e Supertest.
- Gerar documentação de código com Swagger.