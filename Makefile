# =========================
# Configuration
# =========================
BACKEND_DIR := apps/backend
FRONTEND_DIR := apps/frontend

GO_CMD := go
NPM_CMD := npm

# =========================
# Help
# =========================
.PHONY: help
help:
	@echo ""
	@echo "Available commands:"
	@echo ""
	@echo "  make dev              Run backend + frontend in dev mode"
	@echo "  make backend-dev      Run Go backend (hot reload optional)"
	@echo "  make frontend-dev     Run React frontend"
	@echo ""
	@echo "  make build            Build backend + frontend"
	@echo "  make build-backend    Build Go backend"
	@echo "  make build-frontend   Build React frontend"
	@echo ""

# =========================
# Development
# =========================
.PHONY: dev
dev:
	@echo "Starting backend and frontend..."
	@make -j 2 backend-dev frontend-dev

.PHONY: backend-dev
backend-dev:
	cd $(BACKEND_DIR) && $(GO_CMD) run ./cmd/server

.PHONY: frontend-dev
frontend-dev:
	cd $(FRONTEND_DIR) && $(NPM_CMD) run dev

# =========================
# Build
# =========================
.PHONY: build
build: build-backend build-frontend

.PHONY: build-backend
build-backend:
	cd $(BACKEND_DIR) && $(GO_CMD) build -o bin/server ./cmd/server

.PHONY: build-frontend
build-frontend:
	cd $(FRONTEND_DIR) && $(NPM_CMD) run build

# =========================
# Clean
# =========================
.PHONY: clean
clean:
	rm -rf \
		$(BACKEND_DIR)/bin \
		$(FRONTEND_DIR)/dist \
		$(FRONTEND_DIR)/build \
		coverage.*
