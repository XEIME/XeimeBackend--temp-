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

## Módulos Implementados

O sistema XEIME encontra-se organizado em módulos funcionais que representam diferentes áreas do domínio escolar. Cada módulo possui controllers e rotas específicas responsáveis por tratar as operações relacionadas com aquela área do sistema.

---

### Auth

Controller: `auth.controller`

Responsável pela autenticação de utilizadores no sistema.

Principais funcionalidades:

- Login utilizando **E-mail ou Telefone**
- Verificação de credenciais do utilizador
- Geração de **JSON Web Tokens (JWT)** para autenticação
- Gestão de sessões através de tokens

Este módulo é responsável por garantir que apenas utilizadores autenticados possam aceder às rotas protegidas da API.

---

### School

Controller: `school.controller`

Responsável pela gestão das instituições escolares dentro da plataforma.

Principais funcionalidades:

- Criação de novas escolas no sistema
- Criação automática de um **Administrador da escola**
- Utilização de **Prisma Transactions** para garantir atomicidade durante o processo de criação

A criação da escola e do administrador ocorre dentro de uma única transação para garantir consistência na base de dados.

---

### Academic Structure

Controllers: `grade.controller` e `class.controller`

Responsáveis pela organização da estrutura académica da escola.

Principais funcionalidades:

- Criação e gestão de **Classes** (ex: 1ª Classe, 2ª Classe)
- Criação de **Turmas** associadas a uma classe específica
- Associação de turmas a uma escola

Este módulo define a estrutura hierárquica necessária para organizar alunos e professores dentro do sistema.

---

### Teachers

Controller: `teacher.controller`

Responsável pela gestão do corpo docente das escolas.

Principais funcionalidades:

- Cadastro de professores
- Atualização de dados de professores
- Listagem de professores por escola
- Associação de professores às turmas que lecionam

Este módulo permite controlar a distribuição e gestão dos professores dentro de cada unidade escolar.

## Módulos em Desenvolvimento

Os seguintes módulos encontram-se atualmente em desenvolvimento:

- Cadastro de alunos e encarregados
- Exclusão lógica (soft delete) de professores
- Sistema de validação de dados com Zod
- Listagem de turmas por escola
- Documentação da API

## Modelo de Roles do Sistema

O XEIME utiliza um modelo de controlo de acesso baseado em roles (RBAC - Role-Based Access Control).

Cada utilizador do sistema possui uma role que define quais funcionalidades da plataforma podem ser acedidas. Este mecanismo permite restringir operações sensíveis e garantir que cada utilizador apenas interage com as funcionalidades apropriadas ao seu nível de permissão.

As permissões são aplicadas através de **middlewares de autorização** que verificam o token JWT e a role associada ao utilizador autenticado.

---

### SuperAdmin

O SuperAdmin possui o nível máximo de controlo dentro do sistema.

Principais responsabilidades:

- Criar e gerir escolas dentro da plataforma
- Criar administradores de cada escola
- Visualizar todas as escolas registadas
- Realizar operações globais de gestão do sistema

Este papel representa normalmente a entidade responsável pela administração geral da plataforma.

---

### Admin

O Admin é o responsável pela gestão interna de uma escola específica.

Principais responsabilidades:

- Gerir professores da escola
- Criar e organizar classes e turmas
- Gerir alunos e encarregados
- Consultar dados académicos da sua escola

Cada Admin tem acesso apenas aos dados da escola à qual está associado.

---

### Teacher

Representa os professores vinculados a uma escola e a uma ou mais turmas.

Principais responsabilidades:

- Consultar turmas atribuídas
- Acompanhar alunos da sua turma
- Registar ou consultar informações pedagógicas

Os professores possuem acesso limitado apenas às turmas pelas quais são responsáveis.

---

### Parent

Representa os encarregados de educação dos alunos.

Principais responsabilidades:

- Consultar informações do aluno associado
- Acompanhar o desempenho académico
- Aceder a notificações ou informações escolares

Cada encarregado pode estar associado a um ou mais alunos.

---

### Student

Representa os alunos matriculados numa escola.

Principais responsabilidades:

- Consultar a sua própria informação académica
- Aceder a dados relacionados com a sua turma

Os alunos possuem acesso restrito apenas aos seus próprios dados.

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

## Fluxo de Autenticação da API

O sistema XEIME utiliza autenticação baseada em **JSON Web Tokens (JWT)** para garantir comunicação segura entre o cliente e a API.

Este mecanismo permite identificar o utilizador autenticado e aplicar regras de autorização baseadas na sua role.

---

### Etapas do Processo de Autenticação

1. Envio de Credenciais

O utilizador envia uma requisição para o endpoint de autenticação contendo as suas credenciais.

Endpoint:

POST /auth/login

Exemplo de corpo da requisição:

{
  "login": "user@email.com",
  "password": "password123"
}

O campo `login` permite autenticação utilizando **email ou número de telefone**.

---

2. Validação das Credenciais

O servidor executa os seguintes passos:

- procura o utilizador na base de dados
- compara a palavra-passe utilizando **Bcrypt**
- verifica se o utilizador está ativo

Caso as credenciais sejam inválidas, a API retorna:

HTTP 401 - Unauthorized

---

3. Geração do Token JWT

Se a autenticação for bem-sucedida, o servidor gera um **JSON Web Token** contendo informações básicas do utilizador.

Exemplo de payload do token:

{
  "userId": "uuid",
  "role": "Admin",
  "schoolId": "uuid"
}

Este token é assinado utilizando a chave definida em `JWT_SECRET`.

---

4. Envio do Token ao Cliente

O token é enviado na resposta da API:

{
  "accessToken": "jwt_token_aqui"
}

O cliente deve armazenar este token e utilizá-lo nas requisições seguintes.

---

5. Acesso a Rotas Protegidas

Para aceder a rotas protegidas, o cliente deve enviar o token no cabeçalho HTTP:

Authorization: Bearer <token>

---

6. Validação do Token

Antes de processar a requisição, um middleware executa:

- verificação da assinatura do token
- validação da expiração
- extração das informações do utilizador

Se o token for inválido ou inexistente, a API retorna:

HTTP 401 - Unauthorized

---

7. Verificação de Permissões

Após validar o token, o sistema verifica se a role do utilizador possui permissão para aceder ao endpoint solicitado.

Caso o utilizador não possua permissão suficiente, a API retorna:

HTTP 403 - Forbidden

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

## Endpoints Principais

Abaixo estão alguns dos principais endpoints disponíveis na API:

```bash

POST   /auth/login
POST   /schools
GET    /schools
POST   /teachers
GET    /teachers

```
---

## Fluxo de Trabalho e Organização da Equipa

Para garantir qualidade de código, rastreabilidade de tarefas e colaboração eficiente, o projeto XEIME segue um fluxo de desenvolvimento baseado em **GitFlow**, **GitHub Issues** e **GitHub Projects**.

O processo de trabalho da equipa segue sempre a seguinte sequência:

Issue → Branch → Pull Request → Merge

Nenhuma funcionalidade deve ser desenvolvida fora deste fluxo.

---

## 1. Gestão de Tarefas (GitHub Issues e Projects)

Toda tarefa começa com a criação de uma **Issue** no repositório.

As Issues representam unidades de trabalho individuais, como por exemplo:

- criação de um endpoint
- implementação de uma funcionalidade
- correção de um bug
- melhoria de documentação
  
```bash
Exemplo de Issue:
feature: implementar soft delete de professores
```

```bash
Cada Issue possui um identificador numérico automático:
#12
```

Este número será utilizado para ligar commits e Pull Requests à tarefa correspondente.

---

### Organização com GitHub Projects

O projeto utiliza um **Project Board (Kanban)** para acompanhar o progresso das tarefas.

As Issues devem sempre estar associadas ao quadro do projeto.

Colunas utilizadas:

**Todo**

Tarefas prontas para serem iniciadas.

**In Progress**

Tarefas que já estão a ser desenvolvidas por um membro da equipa.

**Done**

Tarefas concluídas e aprovadas após revisão de código.

---

## 2. Política de Branches (GitFlow)

O repositório segue uma estrutura baseada no modelo **GitFlow**.

| Branch | Nível | Descrição |
|------|------|------|
| main | Crítico | Código estável em produção |
| develop | Estável | Branch principal de desenvolvimento |
| feature/* | Trabalho | Branches temporárias para novas funcionalidades |

### main

Contém apenas código pronto para produção.

- Apenas o **Lead Developer** deve realizar merge nesta branch.
- Nenhum desenvolvimento direto deve ocorrer nesta branch.

### develop

Branch principal de integração da equipa.

- Todas as funcionalidades aprovadas são integradas aqui.
- Todos os **Pull Requests devem ter como destino a branch develop**.

### feature branches

Cada funcionalidade deve ser desenvolvida numa branch separada.

```bash
Formato recomendado:
feature/issue-12-delete-teacher
```

---

## 3. Processo de Desenvolvimento

Para iniciar o desenvolvimento de uma tarefa, o membro da equipa deve seguir os seguintes passos.

### 1. Escolher uma Issue

Selecionar uma tarefa no **Project Board** e atribuir a si mesmo como **Assignee**.

---

### 2. Atualizar a branch develop local

```bash
git checkout develop
git pull origin develop
```

---

### 3. Criar uma branch de feature

A branch deve incluir o número da Issue.
```bash
git checkout -b feature/issue-12-delete-teacher
```

---

### 4. Desenvolver a funcionalidade

Durante o desenvolvimento, os commits devem seguir um padrão semântico.

Exemplo:
```bash
git add .
git commit -m "feat: implement soft delete for teachers (#12)"
```

---

### 5. Enviar a branch para o GitHub

```bash
git push origin feature/issue-12-delete-teacher
```
---

## 4. Pull Requests e Code Review

Após enviar a branch para o repositório remoto, o desenvolvedor deve abrir um **Pull Request (PR)** com destino à branch `develop`.

### Regra de revisão

Nenhum desenvolvedor deve aprovar o seu próprio código.

Outro membro da equipa deve:

- ler o código
- verificar a lógica
- testar a funcionalidade
- aprovar o Pull Request

---

### Ligação entre Pull Request e Issue

Na descrição do Pull Request deve ser utilizado:

```
Closes #12
```

Quando o PR for aprovado e fizer merge, a Issue será automaticamente fechada.

---

### Merge

Após aprovação:

- o Pull Request é integrado na branch `develop`
- a branch `feature` deve ser apagada

---

## Padrão de Commits (Conventional Commits)

Para manter um histórico de commits organizado, utilizamos o padrão **Conventional Commits**.

| Tipo | Descrição |
|-----|-----|
| feat | Nova funcionalidade |
| fix | Correção de bug |
| docs | Alterações na documentação |
| refactor | Melhoria de código sem alterar funcionalidade |
| test | Adição ou modificação de testes |

### Exemplos:

```bash
feat: add endpoint to create teachers
```

```bash
fix: correct validation of phone number
```

```bash
docs: update API documentation
```
---

## Licença

Este projeto encontra-se sob a licença MIT.
---

Autor: Equipa XEIME
---
