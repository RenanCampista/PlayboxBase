# PlayBox
Plataforma web de avaliação de jogos desenvolvido na disciplina de Projeto Integrado.z

# Diagrama de Classes
Clique no link para acessar o diagrama de classes do projeto no figma: [Diagrama de Classes](https://www.figma.com/proto/QDnrFeOwIcdeOkrhybck0W/Trabalho-PI?node-id=51-180&t=V2FmtJweQSe3p507-1)

Um jogo pode estar associado a um ou mais gêneros. Além disso, ele pode receber diversos reviews publicados pelos usuários da plataforma. Ao criar uma conta, o usuário recebe automaticamente um catálogo vazio, que funciona como uma lista de favoritos, onde poderá adicionar os jogos do seu interesse.

# Ferramentas Utilizadas
#### **Git**
- **GitHub**: Repositório remoto utilizado para versionamento do código e colaboração entre os membros da equipe.

#### **Build**
- **Npm**: Gerenciador de pacotes utilizado para instalar dependências do projeto.

#### **Testes**
- **React Testing Library**: Utilizada para testes de componentes React.
- **Jest**: Framework de testes utilizado para executar os testes automatizados.

#### **Issue Tracking**
- **GitHub Issues**: Utilizado para rastreamento de problemas e gerenciamento de tarefas.

#### **CI/CD**
- **GitHub Actions**: Configurado para executar testes automatizados e implantar o projeto.

#### **Containerização**
- **Docker**: Utilizado para criar contêineres do projeto, facilitando o ambiente de desenvolvimento e implantação.

#### **Banco de Dados**
- **PostgreSQL**: Sistema de gerenciamento de banco de dados relacional utilizado para armazenar os dados do projeto.
Observação: Na primeira etapa do trabalho havia sido mencionado o uso do MySQL, mas foi alterado para PostgreSQL.

#### **Documentação de código**
- **JSDoc**: Utilizado para gerar documentação do código JavaScript.

### **Outras ferramentas**
- **Figma**: Utilizado para design de interfaces e prototipagem.
- **Makefile**: Arquivo utilizado para automatizar tarefas comuns do projeto, como instalação de dependências e execução de scripts.


# Framewoks utilizados
- **React**: Biblioteca JavaScript para construção de interfaces de usuário.
- **Express**: Framework para construção de APIs em Node.js.
- **Node.js**: Ambiente de execução JavaScript no lado do servidor.
- **Prisma**: ORM utilizado para interagir com o banco de dados PostgreSQL.

# Gerar documentação de código
A ser implementado.

# Instalação e Execução
1. Clone o repositório:
   ```bash
   git clone https://github.com/RenanCampista/Playbox.git
   ```
2. Navegue até o diretório do projeto:
   ```bash
    cd Playbox
   ```
3. Crie um arquivo `.env` na raiz do projeto e configure as variáveis de ambiente necessárias. Um exemplo de arquivo `.env` pode ser encontrado em `.env.example`.
   ```bash
    cp .env.example .env
   ```
    Edite o arquivo `.env` com as configurações apropriadas para o seu ambiente.

4. Execute o seguinte comando para instalar as dependências do projeto:
   ```bash
    make install
   ```
   
5. Para iniciar a aplicação, execute o seguinte comando:
   ```bash
    make start
   ```
   Isso iniciará o servidor Express e a aplicação React. Certifique-se de que o banco de dados PostgreSQL esteja em execução e configurado corretamente.

6. Acesse a aplicação no navegador em [http://localhost:5001](http://localhost:5001).

   