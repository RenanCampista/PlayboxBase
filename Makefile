.PHONY: help dev build up down logs logs-f status clean migrate shell-be shell-fe shell-db

# Ajuda
help:
	@echo "Comandos disponíveis:"
	@echo "  dev        - Inicia ambiente de desenvolvimento"
	@echo "  build      - Constrói containers"
	@echo "  up         - Sobe containers"
	@echo "  down       - Para todos os containers"
	@echo "  logs       - Mostra logs dos containers"
	@echo "  logs-f     - Mostra logs em tempo real"
	@echo "  status     - Mostra status dos containers e health checks"
	@echo "  clean      - Remove containers, volumes e imagens"
	@echo "  migrate    - Executa migrações do banco"
	@echo "  shell-be   - Acessa shell do backend"
	@echo "  shell-fe   - Acessa shell do frontend"
	@echo "  shell-db   - Acessa PostgreSQL"
	@echo "  setup      - Executa script de setup inicial para configuração sem Docker"
	@echo "  reset      - Remove node_modules e executa setup completo"
	@echo "  docker-permissions - Configura permissões do Docker"

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

# Status dos containers
status:
	@echo "📊 Status dos containers:"
	docker-compose ps
	@echo ""
	@echo "🏥 Health checks:"
	docker-compose exec database pg_isready -U playbox_user -d playbox && echo "✅ Database: OK" || echo "❌ Database: FAIL"

# Utilitários
migrate:
	@echo "⏳ Aguardando banco de dados ficar disponível..."
	@until docker-compose exec database pg_isready -U playbox_user -d playbox; do \
		echo "Banco ainda não está pronto, aguardando 5 segundos..."; \
		sleep 5; \
	done
	@echo "✅ Banco de dados está pronto!"
	@echo "🗃️ Executando migrações..."
	docker-compose exec backend npx prisma migrate deploy

shell-be:
	docker-compose exec backend sh

shell-fe:
	docker-compose exec frontend sh

shell-db:
	docker-compose exec database psql -U playbox_user -d playbox

# Limpeza
clean:
	docker-compose down -v --rmi all --remove-orphans || true
	docker system prune -f

# Setup inicial (usar script de setup)
setup:
	chmod +x ./scripts/setup.sh
	./scripts/setup.sh

# Reset completo do projeto (remove node_modules e reinstala)
reset:
	@echo "🧹 Limpando node_modules..."
	sudo rm -rf server/node_modules client/node_modules || true
	@echo "🧹 Limpando cache npm..."
	npm cache clean --force || true

# Permissões Docker
docker-permissions:
	@echo "🔧 Configurando permissões do Docker..."
	sudo usermod -aG docker $USER
