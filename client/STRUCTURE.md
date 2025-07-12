# Frontend Structure - Playbox Client

```
src/
├── components/          # Componentes reutilizáveis (.jsx)
│   ├── index.js        # Barrel exports dos components
│   ├── Header.jsx      # Cabeçalho da aplicação
│   ├── UserList.jsx    # Lista de usuários
│   └── UserForm.jsx    # Formulário de usuários
├── pages/              # Páginas principais (.jsx)
│   ├── index.js        # Barrel exports das pages
│   ├── App.jsx         # Componente principal
│   ├── Login.jsx       # Página de login
│   ├── Register.jsx    # Página de registro
│   └── ForgotPassword.jsx # Página recuperação de senha
├── services/           # Serviços e APIs (.js)
│   └── api.js          # Configuração da API e endpoints
├── styles/             # Todos os arquivos CSS
│   ├── App.css         # Estilos globais
│   ├── index.css       # Estilos base
│   ├── Header.css      # Estilos do header
│   ├── Login.css       # Estilos do login
│   ├── Register.css    # Estilos do registro
│   ├── ForgotPassword.css # Estilos recuperação
│   ├── UserList.css    # Estilos da lista
│   └── UserForm.css    # Estilos do formulário
├── utils/              # Utilitários (.js)
│   ├── reportWebVitals.js # Performance metrics
│   └── setupTests.js   # Configuração de testes
├── index.js            # Ponto de entrada
└── App.test.js         # Testes
```