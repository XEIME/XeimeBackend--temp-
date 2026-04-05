# XEIME - Sistema de Gestão de Desempenho Escolar

## Descrição

O XEIME é uma API REST desenvolvida para centralizar e modernizar a gestão académica em Moçambique.

O sistema permite o controlo completo do ecossistema escolar, desde a infraestrutura institucional (escolas, classes e turmas) até ao acompanhamento pedagógico de professores, alunos e encarregados de educação.

A plataforma foi projetada para servir como base de um sistema digital capaz de suportar múltiplas escolas, garantindo organização, segurança e escalabilidade no tratamento de dados académicos.

---

## Objetivo do Projeto

O objetivo do XEIME é fornecer uma infraestrutura tecnológica capaz de:

- Gerir múltiplas escolas dentro do mesmo sistema
- Administrar professores, alunos e encarregados
- Organizar turmas e classes académicas
- Controlar permissões através de níveis de acesso
- Facilitar o acompanhamento do desempenho escolar

## Documentação da API (Swagger)
Para entender e testar todos os endpoints disponíveis em tempo real, aceda à nossa documentação interativa:
👉 http://localhost:3000/api-docs

Nesta página, encontrará os módulos de Autenticação, Administração Central, Gestão Académica e Matrículas.

## Stack Tecnológica

O projeto XEIME utiliza um conjunto de tecnologias modernas com foco em desempenho, segurança e manutenção a longo prazo. A escolha das ferramentas prioriza tipagem estática, escalabilidade e facilidade de desenvolvimento.

---

## Backend Core

### Node.js
Ambiente de execução JavaScript utilizado para executar o servidor da aplicação.  
O projeto utiliza **Node.js v20 ou superior**, garantindo melhor performance e suporte a funcionalidades modernas da linguagem.

### TypeScript
Superset do JavaScript que adiciona **tipagem estática ao código**.  
A utilização de TypeScript reduz erros em tempo de execução, melhora a manutenção do código e fornece melhor suporte para ferramentas de desenvolvimento.

### Express.js
Framework minimalista para construção de APIs REST.  
Responsável pelo roteamento das requisições HTTP, gestão de middlewares e organização da aplicação backend.

---

## Persistência e Base de Dados

### PostgreSQL
Sistema de gestão de base de dados relacional (SGBD) utilizado para armazenar os dados da aplicação.  
Foi escolhido pela sua confiabilidade, performance e suporte avançado a operações relacionais.

### Prisma ORM
Object-Relational Mapper responsável pela comunicação entre a aplicação e a base de dados.

Principais vantagens do Prisma no projeto:

- Abstração da comunicação com o banco de dados
- Geração automática de tipos para TypeScript
- Sistema de migrations para versionamento da base de dados
- Ferramentas visuais para inspeção e manipulação de dados

---

## Segurança e Autenticação

### JWT (JSON Web Token)
Padrão utilizado para autenticação e troca segura de informações entre cliente e servidor.

O sistema utiliza JWT para:

- geração de tokens de acesso
- validação de sessões
- proteção de rotas da API

### BcryptJS
Biblioteca utilizada para realizar **hashing seguro de palavras-passe** antes de armazená-las na base de dados.

Isso garante que credenciais sensíveis nunca sejam guardadas em texto simples.

---

## Ferramentas de Desenvolvimento

### tsx
Executor moderno de TypeScript que permite executar ficheiros `.ts` diretamente sem necessidade de compilação manual.

Principais vantagens:

- execução extremamente rápida
- suporte a **watch mode** para reinicialização automática
- substitui ferramentas como `nodemon` e `ts-node`

Documentação: https://tsx.is/

---

### ts-node-dev
Ferramenta alternativa para execução do projeto durante o desenvolvimento.

Utilizada para garantir compatibilidade em diferentes ambientes e fluxos de trabalho.

Repositório: https://github.com/wclr/ts-node-dev

---

### Prisma CLI
Interface de linha de comando utilizada para gestão da base de dados através do Prisma.

Principais funcionalidades:

- executar migrations
- gerar o cliente Prisma
- abrir o Prisma Studio para visualizar dados
- sincronizar alterações do schema

Documentação: https://www.prisma.io/docs/orm/prisma-cli 

## Arquitetura e Organização do Código

O projeto segue uma organização modular com separação clara de responsabilidades.  
Esta estrutura facilita a manutenção do código, melhora a escalabilidade do sistema e permite uma colaboração mais eficiente entre membros da equipa.

A aplicação está organizada principalmente dentro da pasta `src`, onde cada diretório representa uma responsabilidade específica dentro da arquitetura do sistema.

A estrutura principal do projeto encontra-se organizada da seguinte forma:

```
src
 ├ controllers
 │   ├ auth.controller.ts
 │   ├ school.controller.ts
 │   ├ grade.controller.ts
 │   ├ class.controller.ts
 │   └ teacher.controller.ts
 │
 ├ routes
 │   ├ auth.routes.ts
 │   ├ school.routes.ts
 │   ├ grade.routes.ts
 │   ├ class.routes.ts
 │   └ teacher.routes.ts
 │
 ├ middlewares
 │   ├ auth.middleware.ts
 │   └ role.middleware.ts
 │
 ├ lib
 │   └ prisma.ts
 │
 └ server.ts
```

---

### controllers

Responsáveis por orquestrar o fluxo das requisições HTTP.

As principais responsabilidades dos controllers incluem:

- Receber as requisições enviadas pelos clientes
- Validar dados básicos da requisição
- Invocar as operações necessárias através do Prisma
- Estruturar e enviar a resposta HTTP

Os controllers funcionam como uma camada intermediária entre as rotas da aplicação e a lógica de acesso à base de dados.

---

### routes

Define todos os **endpoints da API**.

Nesta camada são configurados:

- os caminhos das rotas
- os métodos HTTP utilizados (GET, POST, PUT, DELETE)
- os middlewares necessários para cada rota
- a ligação entre a rota e o controller responsável

Esta separação permite manter o código organizado e facilita a leitura da estrutura da API.

---

### lib

Contém configurações e instâncias de bibliotecas externas utilizadas pela aplicação.

Exemplo:

- configuração da instância do **Prisma Client**
- inicialização de serviços externos
- utilitários de infraestrutura compartilhados

Esta pasta centraliza integrações com ferramentas externas utilizadas pelo sistema.

---

### middlewares

Contém funções executadas antes do processamento das requisições.

No projeto XEIME, os middlewares são utilizados principalmente para:

- verificação de **tokens JWT**
- autenticação de utilizadores
- controlo de permissões baseado em **roles**
- proteção de rotas sensíveis da API

Os middlewares garantem que apenas utilizadores autorizados possam aceder a determinadas funcionalidades do sistema.

---

## Aplicação de Permissões

A verificação das permissões ocorre através de middlewares que analisam:

1. A validade do token JWT enviado na requisição
2. A role associada ao utilizador autenticado
3. As permissões necessárias para aceder ao endpoint solicitado

Caso o utilizador não possua a role necessária, o sistema retorna uma resposta de **acesso não autorizado (HTTP 403)**.

### Hierarquia de Permissões

SuperAdmin  
→ Admin  
→ Teacher  
→ Parent  
→ Student


## Guia de Configuração

Esta secção descreve os passos necessários para configurar e executar o projeto localmente.

---

### 1. Requisitos

Antes de iniciar, certifique-se de que possui as seguintes ferramentas instaladas:

- Node.js (versão 20 ou superior)
- PostgreSQL em execução
- Git instalado no sistema

---

### 2. Instalação do Projeto

Clone o repositório:

```bash
git clone https://github.com/XEIME/XeimeBackend--temp-
```
Entre na pasta do projeto:

```bash
cd xeime-backend
```
Instale as dependências:

```bash
npm install
```
### 3. Configuração do Ambiente

Crie um ficheiro .env na raiz do projeto e configure as seguintes variáveis:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/xeime_db"
JWT_SECRET="tua_chave_privada_aqui"
```
### 4. Configuração da Base de Dados

Gerar o cliente Prisma:
```bash
npx prisma generate
```

Executar as migrations da base de dados:
```bash
npx prisma migrate dev
```

### 5. Execução do Servidor

Para iniciar o servidor em modo de desenvolvimento:
```bash
npm run dev
```
---

A API ficará disponível em:
http://localhost:3000

---

## 📄 Licença

Este projecto está sob a licença **MIT**. Veja o ficheiro [LICENSE](./LICENSE) para mais detalhes.

Copyright © 2026 **XEIME Team**