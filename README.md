# Extensão Pomodoro dos Crias – PWA + API + Docker

Aplicação **Progressive Web App** de Pomodoro com tema claro/escuro, botão de instalação e destaque de links, integrada a uma **API Node/Express** de frases motivacionais e empacotada em um ambiente **Docker Compose** com CI no GitHub Actions.

---

## Arquitetura do projeto

- `apps/web`  
  - PWA em HTML/CSS/JS (vanilla)  
  - Instalação como app (manifest + service worker)  
  - Tema claro/escuro e botões de controle do Pomodoro  
  - Consome a API de frases quando o backend está rodando

- `apps/api`  
  - API em Node.js + Express  
  - Endpoint principal: `GET /api/quote`  
  - Retorna frases motivacionais em formato JSON

- `docker-compose.yml`  
  - Sobe duas services:
    - `web` (frontend PWA)
    - `api` (backend Express)
  - Facilita subir todo o ambiente com um único comando

---

## Como rodar localmente (ambiente completo)

Pré‑requisitos:
- Docker e Docker Compose instalados

Passos:

1. Clonar o repositório:
git clone https://github.com/PedroAlves2707/Entrega-Final.git
cd Entrega-Final


2. Subir o ambiente com Docker Compose:
docker compose up --build


3. Acessar:
- PWA (frontend):  
  `http://localhost:8080`
- API de frases:  
  `http://localhost:3000/api/quote`

Para parar os containers:
docker compose down

---

## Como rodar os testes

### Web (PWA)

Dentro de `apps/web`:

npm install
npm test


### API (Node/Express)

Dentro de `apps/api`:

npm install
npm test


### Testes E2E (Playwright)

Com o frontend rodando (via Docker ou `npm`):

cd apps/web/public/tests/e2e
npx playwright test


---

## PWA e instalação

### Versão local (Docker)

1. Acesse `http://localhost:8080`.
2. O navegador detecta o PWA (manifest + service worker).
3. Use o botão **“Instalar App”** na interface ou o menu do navegador para instalar.
4. O app funciona como aplicação independente, com:
   - Timer Pomodoro
   - Tema claro/escuro
   - Frase do dia consumindo a API local (`http://localhost:3000/api/quote`)

### Versão publicada (GitHub Pages)

- URL pública (PWA estático):  
  `https://pedroalves2707.github.io/Entrega-Final/`

- Nessa versão:
  - O PWA continua instalável (Chrome/Chromium).
  - Tema claro/escuro funciona normalmente.
  - A “Frase do dia” exibe uma mensagem explicando que a frase dinâmica só está disponível quando a **API local (Docker)** está rodando.

---

## Observação importante sobre a API no GitHub Pages

A API de frases foi projetada para rodar em `http://localhost:3000/api/quote` (via Docker ou Node local).  
Por questões de segurança (CORS e mixed content), navegadores não permitem que um site hospedado em `https://github.io` acesse diretamente `http://localhost:3000` na máquina do usuário.

Por isso:

- **Localmente (Docker):**  
  - A PWA consome a API normalmente e exibe frases dinâmicas.

- **Publicação no GitHub Pages:**  
  - O frontend detecta que está em `github.io` e mostra uma mensagem fixa informando que a frase dinâmica só está disponível quando a API local está rodando.

Essa escolha foi feita para evitar erros de CORS no console e deixar o comportamento bem explicado para o usuário e para a correção do trabalho.

---

## CI/CD no GitHub Actions

O repositório possui pipeline de CI configurado para:

- Instalar dependências
- Rodar testes do frontend e da API (quando configurados)
- Construir o frontend
- Publicar os artefatos estáticos para o GitHub Pages

Sempre que há um `push` na branch `main`:

1. O workflow é disparado na aba **Actions**.
2. Em caso de sucesso, o GitHub Pages é atualizado automaticamente com a versão mais recente da PWA.

---

## Links úteis para correção

- **Repositório:**  
  `https://github.com/PedroAlves2707/Entrega-Final`

- **PWA no GitHub Pages:**  
  `https://pedroalves2707.github.io/Entrega-Final/`

- **Último run do CI (GitHub Actions):**  
  `https://github.com/PedroAlves2707/Entrega-Final/actions`

- **Vídeo/GIF de demonstração:**  
  (inserir link do vídeo ou GIF mostrando: uso do timer, instalação do PWA e consumo da API local)

---
