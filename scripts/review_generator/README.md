# Gerador de Reviews Aleatórias
Script para gerar reviews aleatórias no Playbox usando a API.

## Requisitos
- [Python 3.8](https://www.python.org/downloads/) ou superior.
- [Pip](https://pip.pypa.io/en/stable/installation/) (gerenciador de pacotes do Python).

## Instalação
1. Instale as dependências:
    ```bash
    pip install -r requirements.txt
    ```
2. Certifique-se que a API do Playbox está rodando:
    ```bash
    # Vá para o diretório server e execute:
    cd ../../server
    npm start
    # A API deve estar rodando em http://localhost:5000
    ```
3. Execute o script:
    ```bash
    python3 random_reviews.py
    ```