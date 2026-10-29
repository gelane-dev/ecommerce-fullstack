# 0001 — Documentação técnica em `docs/` (vault Obsidian)

- **Data:** 2026-10-29
- **Status:** Aceita

## Contexto
O projeto só tinha o `README.md`, que mistura apresentação, instalação e detalhes técnicos. Era preciso um lugar curto e navegável para arquitetura, API, banco e setup, que funcionasse tanto no GitHub quanto no Obsidian.

## Decisão
Usar `docs/` como vault do Obsidian, com [Home](../Home.md) como ponto de entrada e **links Markdown padrão** (`[API](API.md)`), que o GitHub e o Obsidian entendem. Configuração mínima versionada em `docs/.obsidian/app.json`.

## Alternativas consideradas
- Só o `README.md` — cresce demais e mistura públicos diferentes.
- Vault na raiz do repositório — o Obsidian indexaria `node_modules`, código e arquivos locais.
- Links wiki (`[[API]]`) — não são renderizados pelo GitHub.

## Consequências
- Mudanças relevantes de arquitetura, API, banco ou setup devem atualizar a nota correspondente.
- `docs/.obsidian/` versiona apenas configuração estável; estado do workspace é ignorado.
