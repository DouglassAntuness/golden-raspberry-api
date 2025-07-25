# Desafio Técnico – API Golden Raspberry Awards

API RESTful construída com **NestJS** e **SQLite em memória** para leitura e análise dos vencedores da categoria **"Pior Filme"** do Golden Raspberry Awards.

---

## 📌 Funcionalidades

- Importa automaticamente os dados de um arquivo CSV ao iniciar a aplicação.
- Salva os dados em um banco de dados em memória.
- Expõe um endpoint que retorna o produtor com:
  - **Menor intervalo** entre dois prêmios consecutivos.
  - **Maior intervalo** entre dois prêmios consecutivos.
- **Testes automatizados com Jest**

---

## 🛠 Tecnologias utilizadas
- Node.js – Ambiente de execução JavaScript
- NestJS – Framework para criação de APIs
- CSV Parser (e.g., csv-parser) – Leitura do arquivo CSV
- SQLite (in-memory) – Banco de dados temporário
- Jest – Testes automatizados
- ESLint + Prettier – Padronização de código (se usados)

## 🚀 Como rodar o projeto

### Pré-requisitos

- Node.js (v18+)
- Yarn ou NPM

### Instalação

1. Clone o repositório:

```bash
git clone https://github.com/DouglassAntuness/golden-raspberry-api.git
cd golden-raspberry-api
```

2. Instale as dependências:

```bash
yarn install
# ou
npm install
```

3. Inicie o projeto:

```bash
yarn start:dev
# ou
npm run start:dev
```

4. Acesse:
```bash
http://localhost:8000/api/movie/maxMinWinIntervalForProducers
```

5. Como rodar os testes:
```bash
yarn test
# ou
npm run test
```