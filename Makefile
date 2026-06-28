APP=app
ENV_FILE=.env
ENV_EXAMPLE=.env.example

init-env:
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		JWT_SECRET=$$(openssl rand -hex 32); \
		JWT_REFRESH_SECRET=$$(openssl rand -hex 32); \
		sed -i.bak "s/^JWT_SECRET=.*/JWT_SECRET=$$JWT_SECRET/" .env; \
		sed -i.bak "s/^JWT_REFRESH_SECRET=.*/JWT_REFRESH_SECRET=$$JWT_REFRESH_SECRET/" .env; \
		rm -f .env.bak; \
		echo ".env created and JWT generated"; \
	fi

up: init-env
	docker compose up -d

rebuild: init-env
	docker compose up -d --build

reset: init-env
	docker compose down -v
	docker compose up -d --build

down:
	docker compose down

stop:
	docker compose stop

start:
	docker compose start

restart:
	docker compose restart

build: init-env
	docker compose build

ps:
	docker compose ps

logs:
	docker compose logs -f

logs-app:
	docker compose logs -f $(APP)

shell:
	docker compose exec $(APP) sh

exec:
	docker compose exec $(APP) sh

install:
	docker compose exec $(APP) npm install

dev:
	docker compose exec $(APP) npm run start:dev

prod:
	docker compose exec $(APP) npm run start:prod

build-app:
	docker compose exec $(APP) npm run build

test:
	docker compose exec $(APP) npm run test

lint:
	docker compose exec $(APP) npm run lint

format:
	docker compose exec $(APP) npm run format

clean:
	docker compose down -v