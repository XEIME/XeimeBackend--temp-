## Guia de Contribuição - XEIME

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