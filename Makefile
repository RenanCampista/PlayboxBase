.PHONY: help dev build up down logs logs-f clean migrate shell-be shell-fe shell-db

# Ajuda
help:
	@echo "Comandos disponíveis:"
	@echo "  dev        - Inicia ambiente de desenvolvimento"
	@echo "  build      - Constrói containers"
	@echo "  up         - Sobe containers"
	@echo "  down       - Para todos os containers"
	@echo "  logs       - Mostra logs dos containers"
	@echo "  logs-f     - Mostra logs em tempo real"
	@echo "  clean      - Remove containers, volumes e imagens"
	@echo "  migrate    - Executa migrações do banco"
	@echo "  shell-be   - Acessa shell do backend"
	@echo "  shell-fe   - Acessa shell do frontend"
	@echo "  shell-db   - Acessa MySQL"

# Desenvolvimento
dev: build up migrate
	@echo "✅ Ambiente de desenvolvimento iniciado!"

# Build
build:
	docker-compose build

# Up
up:
	docker-compose up -d

# Down
down:
	docker-compose down

# Logs
logs:
	docker-compose logs

logs-f:
	docker-compose logs -f

# Utilitários
migrate:
	@echo "⏳ Aguardando banco de dados..."
	@sleep 15
	@echo "🗃️ Executando migrações..."
	docker-compose exec backend npx prisma migrate deploy

shell-be:
	docker-compose exec backend sh

shell-fe:
	docker-compose exec frontend sh

shell-db:
	docker-compose exec database mysql -u playbox_user -p

# Limpeza
clean:
	docker-compose down -v --rmi all --remove-orphans || true
	docker system prune -f

# Setup inicial
setup:
	@if [ ! -f "server/.env" ]; then \
		echo "📝 Criando arquivo .env..."; \
		cp server/.env.example server/.env; \
	fi
