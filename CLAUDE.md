# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Higress Console is the management UI and API for [Higress](https://higress.io/), a cloud-native API gateway. It is a split frontend/backend monorepo: a React app talks to a Spring Boot API which persists all data as Kubernetes CRDs (Istio Ingress, WasmPlugin, etc.) — there is no traditional database.

## Build & Development Commands

### Backend (Java 8 / Spring Boot 2.7 / Maven multi-module)

All Maven commands use the wrapper at `backend/mvnw` from the `backend/` directory.

```bash
# Build all modules (with PMD + CheckStyle enforcement)
cd backend && ./mvnw clean compile

# Run all tests
./mvnw test

# Run a single test class
./mvnw test -Dtest=RouteServiceImplTest -pl sdk

# Skip PMD/CheckStyle for faster iteration
./mvnw compile -Dpmd.skip=true -Dcheckstyle.skip=true

# Package the runnable Spring Boot JAR (includes frontend build via frontend-maven-plugin)
./mvnw package -pl console

# Add Apache 2.0 license headers to source files
./mvnw generate-sources -P license
```

The backend has two modules:
- **`sdk`** (`higress-admin-sdk`): Core business logic, K8s CRD client, model conversion. Runs standalone tests.
- **`console`** (`higress-console`): Spring Boot app — Controllers, session management, config. Depends on `sdk`.

### Frontend (React 18 / ICE.js 2 / TypeScript)

```bash
cd frontend

# Install dependencies
npm install

# Start dev server (proxies /api → demo.higress.io)
npm start

# Production build
npm run build

# Dev build
npm run build-dev

# ESLint
npm run eslint
npm run eslint:fix

# Stylelint
npm run stylelint

# i18n key audit
npm run check-i18n
```

The `frontend-maven-plugin` in the `console` pom automatically invokes `npm install && npm run build` and copies `frontend/build/` into the Spring Boot static resources during `mvn package`.

## Architecture

### Backend Three-Layer Model

All backend code lives under `com.alibaba.higress`.

```
Controller  (console module: console/controller/)
    ↓  accepts DTOs, returns DTOs
Service     (sdk module: sdk/service/)
    ↓  converts DTOs ↔ K8s models via KubernetesModelConverter
Engine      (sdk module: sdk/service/kubernetes/KubernetesClientService.java)
    ↓  reads/writes K8s CRDs via the io.kubernetes client-java SDK
```

**Key files:**
- [KubernetesClientService.java](backend/sdk/src/main/java/com/alibaba/higress/sdk/service/kubernetes/KubernetesClientService.java) — all K8s API read/write operations
- [KubernetesModelConverter.java](backend/sdk/src/main/java/com/alibaba/higress/sdk/service/kubernetes/KubernetesModelConverter.java) — converts between business model POJOs and K8s CRD objects (Istio Ingress, WasmPlugin, etc.)
- [HigressConsoleApplication.java](backend/console/src/main/java/com/alibaba/higress/console/HigressConsoleApplication.java) — entry point, scans `com.alibaba.higress` across both modules

**Controllers** map directly to domain concepts: Routes, Services, Domains, WasmPlugins, Consumers, TlsCertificates, ServiceSources, AiProxy, Dashboard, System, Grafana, etc. The AI sub-package (`controller/ai/`) handles LLM provider and AI route APIs. The MCP sub-package (`controller/mcp/`) handles MCP server management.

**SDK services by domain:**
- `RouteService` / `RouteServiceImpl` — route CRUD on Istio Ingress CRDs
- `ServiceService` / `ServiceServiceImpl` — upstream service resolution
- `WasmPluginService` / `WasmPluginServiceImpl` — WasmPlugin CRD management
- `DomainService`, `TlsCertificateService`, `ServiceSourceService`, `ConsumerService`
- `ai/LlmProviderService` — LLM provider management with per-provider handlers (OpenAI, Azure, Claude, Bedrock, Vertex, Ollama, Qwen, ZhipuAI, VLLM)
- `ai/AiRouteService` — AI route management
- `mcp/McpServerService` — MCP server configuration

**Code style:** Alibaba Java coding conventions enforced via P3C-PMD + CheckStyle. Eclipse formatter config at `backend/style/higress_formatter.xml`. All files require Apache 2.0 license header.

### Frontend Structure

Built on [ICE.js v3](https://v3.ice.work/) with Ant Design Pro.

```
frontend/src/
  app.ts              — App entry, auth/store config, data loader (user info, config, system info)
  pages/              — Route-based pages: dashboard, route, service, plugin, ai/, mcp/, consumer/, etc.
  pages/_defaultProps.tsx  — Sidebar menu definition (routes with i18n keys + visibility predicates)
  pages/layout.tsx    — ProLayout shell with menu, nav, i18n, avatar
  services/           — API client functions per domain (route.ts, plugin.ts, ai-route.ts, etc.)
  components/         — Shared components: CodeEditor, ServiceWeightTable, Navbar, etc.
  interfaces/         — TypeScript interfaces matching backend DTOs (route.ts, wasm-plugin.ts, etc.)
  models/             — ICE store models (user, config, system)
  locales/            — i18n JSON (zh-CN, en-US)
```

**Key patterns:**
- API calls go through [services/request.tsx](frontend/src/services/request.tsx) — an Axios instance with auth token injection and response unwrapping (`.data.data` → caller).
- Menu visibility is controlled by `visiblePredicate` functions in `_defaultProps.tsx` that check config properties.
- The app uses `@ice/plugin-auth` for role-based access (admin/user) and `@ice/plugin-store` for global state.
- Monaco Editor is bundled via a custom webpack CopyPlugin in [ice.config.mts](frontend/ice.config.mts).

### Helm Chart

The chart at `helm/` deploys the console along with optional observability stack (Grafana, Prometheus, Loki). Set `global.local: true` for local/k3d/kind clusters.

## Testing

- Backend tests use JUnit 5 + Mockito. Tests exist under `sdk/src/test/` covering services (ConsumerServiceTest, AiRouteServiceTest, WasmPluginServiceTest, McpServerServiceTest), models (RouteTest, KeyedRoutePredicateTest), and utilities (StringUtilTest, ValidateUtilTest). The console module has a single smoke test `HigressConsoleApplicationTests`.
- There is no frontend test suite.

# Checkstyle
Obey ./backend/style/higress_formatter.xml ruleset.