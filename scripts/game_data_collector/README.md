# Coletor de dados de jogos
Script para coletar dados de jogos usando a [RAWG Video Games Database API (v1.0)](https://api.rawg.io/docs/) e salvar em um json.

## Requisitos
- [Python 3.8](https://www.python.org/downloads/) ou superior.
- [Pip](https://pip.pypa.io/en/stable/installation/) (gerenciador de pacotes do Python).

## Instalação
1. Instale as dependências:
    ```bash
    pip install -r requirements.txt
    ```

2. Copie o arquivo `.env.example` para `.env` e adicione sua chave de API da RAWG:
    ```bash
    cp .env.example .env
    ```

3. Adicione sua chave de API da RAWG no arquivo `.env`:
    ```bash
    RAWG_API_KEY=your_api_key
    ```

## Uso
No terminal, execute o script:
```bash
python main.py
```
O script irá coletar dados de jogos e salvar em um arquivo `games.json` na pasta `data/`.
O arquivo `games.json` conterá os dados coletados, incluindo informações como nome do jogo, data de lançamento, desenvolvedor, editor, plataformas, gêneros e muito mais.

