<!--
Sync Impact Report
==================
Versão: template (sem versão) → 1.0.0
Tipo de bump: MAJOR inicial — primeira ratificação, saindo do template não preenchido.

Princípios definidos (todos novos):
- I.   Fluxo Spec-Driven
- II.  Erros Visíveis
- III. Portão de Qualidade: Tipos e Testes
- IV.  Segredos Fora do Código
- V.   Textos Centralizados e Multi-idioma
- VI.  Design Deliberado
- VII. Simplicidade e Dependências Justificadas

Seções adicionadas:
- Restrições Técnicas e de Stack
- Fluxo de Desenvolvimento e Portões de Qualidade
- Governança

Seções removidas: nenhuma (o arquivo anterior era só o template).

Templates e documentos verificados:
- ✅ .specify/templates/plan-template.md — ALTERADO: o placeholder
     "[Gates determined based on constitution file]" foi substituído por uma checklist com os
     sete portões. A tabela de Complexity Tracking já cobria a justificativa de violação
     exigida pela Governança.
- ✅ .specify/templates/tasks-template.md — ALTERADO: as seções "Tests for User Story N"
     deixaram de ser "(OPTIONAL - only if tests requested)" e passaram a
     "(OBRIGATÓRIO para regra de negócio nova — Princípio III)"; a nota
     "Commit after each task" foi trocada por "Não commitar" (Princípio I).
- ✅ .specify/templates/spec-template.md — compatível, sem alteração; o princípio V reforça a
     seção de requisitos funcionais quanto a textos de interface.
- ✅ .specify/templates/checklist-template.md — genérico, sem referência a princípios.
- ✅ CLAUDE.md / AGENTS.md — esta constituição codifica as regras que já estavam lá;
     nenhuma contradição encontrada.
- ✅ specs/001-projeto-base-perfumes/plan.md — o "Constitution Check" daquele plano registra
     que a constituição era só o template. Fica como registro histórico do EDI-115.

TODOs diferidos: nenhum.

1.0.0 → 1.0.1 (PATCH, 2026-09-30): Princípio VI dizia "o tema claro e o escuro MUST ser
ambos verificados". Como o EDI-116 remove o tema escuro por decisão do usuário, a regra passa
a "todo tema que o projeto suportar". Esclarecimento de redação, sem mudança de exigência.
-->

# Constituição do Dona Frida

Loja online de revenda de perfumes e bijuterias. Este documento define as regras não
negociáveis do projeto. Vale para qualquer pessoa ou agente que escreva código aqui.

## Princípios Centrais

### I. Fluxo Spec-Driven

Toda mudança de escopo real nasce de um ticket no Linear (projeto "Dona Frida", time
InterasisAI) e passa pelo fluxo `/speckit-specify` → `/speckit-plan` → `/speckit-tasks` →
`/speckit-implement`, nessa ordem. Regras:

- A branch MUST usar o `gitBranchName` da issue do Linear. Sem issue, o trabalho é pontual
  e MUST ser acordado antes de começar.
- O agente MUST NOT executar `git commit`, `git push` ou criar tags. Ele entrega a mensagem
  de commit sugerida no padrão git flow (`feat(escopo): ...`) e o commit é do usuário.
- Ajustes triviais (typo, formatação, correção de um teste que já existia) dispensam spec,
  mas MUST ser declarados na entrega.

**Racional**: o histórico de decisões vive nas specs, não na cabeça de quem implementou; e o
controle do que entra no repositório fica com o dono do projeto.

### II. Erros Visíveis

Falha de servidor MUST chegar ao cliente com o status HTTP verdadeiro (4xx/5xx) e um corpo
de erro legível. É proibido:

- Devolver `200` com um payload de erro disfarçado.
- Engolir exceção em `catch` vazio, ou substituir o erro por um estado vazio silencioso.
- Esconder do usuário uma falha que deveria aparecer na aba Network do navegador.

Mensagens ao usuário final podem ser amigáveis, mas o status e o log MUST permitir o
diagnóstico.

**Racional**: erro escondido custa horas de depuração e mascara problemas de pagamento,
estoque e integração de canal, onde uma falha silenciosa vira prejuízo.

### III. Portão de Qualidade: Tipos e Testes

Antes de declarar qualquer implementação concluída, `npx tsc --noEmit` MUST passar sem erro e
`npx vitest run` MUST estar verde. Além disso:

- Regra de negócio nova (cálculo de custo, precificação, validação, mapeamento de atributo de
  canal, feed) MUST vir com teste unitário cobrindo o caminho feliz e os limites.
- Teste que falha MUST ser corrigido ou removido com justificativa explícita; `skip` sem
  motivo registrado é proibido.
- O resultado real MUST ser reportado. Teste vermelho é relatado com a saída, não omitido.

**Racional**: a suíte herdada do Voxelas Duo é a única rede de proteção do checkout e das
integrações; deixá-la apodrecer transforma cada release em aposta.

### IV. Segredos Fora do Código

Credencial, token, chave de API, string de conexão e segredo de webhook MUST vir de variável
de ambiente. Consequências:

- `.env.example` MUST listar toda variável nova, com comentário do que ela é e onde obter,
  e sem valor real.
- Segredo MUST NOT ser commitado, impresso em log, ou colocado em código de teste.
- Variável exposta ao navegador MUST usar o prefixo `NEXT_PUBLIC_` e MUST NOT conter segredo.

**Racional**: o repositório vai para o GitHub e a Vercel; um segredo vazado no histórico é
irreversível.

### V. Textos Centralizados e Multi-idioma

Texto de interface MUST seguir o padrão de i18n vigente no projeto. Enquanto a estrutura de
i18n (EDI-121) não existir, o padrão é pt-BR inline, e nenhuma solução paralela de tradução
MUST ser inventada no caminho. Quando o i18n existir:

- Texto novo MUST entrar como chave de tradução, nunca como literal no componente.
- pt-BR é o idioma base; toda chave MUST ter valor em pt-BR.
- Moeda, data e número MUST ser formatados por locale, não concatenados à mão.

**Racional**: a loja nasce com a intenção de ser multi-idioma; texto espalhado em literais é
o que torna essa migração caríssima.

### VI. Design Deliberado

Tela nova ou redesenho MUST invocar as skills de design antes da implementação:
`frontend-design` (direção visual), `product-page-design` (páginas de produto) e
`site-architecture` (estrutura de páginas e navegação). Além disso:

- Cor, tipografia, espaçamento e raio MUST vir dos tokens em `app/globals.css`. Valor
  literal ("hardcoded") em componente é proibido.
- Todo tema que o projeto suportar MUST ser verificado. Desde o EDI-116 o projeto tem tema
  único, o claro.
- A interface MUST funcionar em largura de celular, incluindo o menu hambúrguer do header.

**Racional**: a identidade visual é ativo da marca; decisão de design tomada ad hoc dentro de
um componente vira dívida que reaparece em toda tela nova.

### VII. Simplicidade e Dependências Justificadas

Dependência nova MUST ser justificada por escrito no `plan.md` da feature, com a alternativa
já disponível na stack que foi descartada e o motivo. Também:

- Abstração MUST nascer do segundo uso real, não da previsão de um.
- Código morto (arquivo, função, variável de ambiente, imagem) MUST ser removido na mesma
  entrega que o tornou obsoleto.
- Voxelas Duo é projeto separado. Código MUST ser portado por cópia consciente, nunca por
  dependência ou referência cruzada, e aquele repositório MUST NOT ser alterado a partir
  daqui.

**Racional**: o projeto é mantido por uma pessoa; cada dependência e cada camada extra é
custo permanente de manutenção.

## Restrições Técnicas e de Stack

A stack é fixa e mudanças nela são emenda a esta constituição:

- **Aplicação**: Next.js 16.3 (App Router), React 19, TypeScript, CSS Modules.
- **Dados**: MongoDB Atlas, base `donafrida`. Vercel Blob para arquivos.
- **Autenticação**: NextAuth v5, com fluxos de admin e de cliente separados.
- **Pagamento**: Mercado Pago (Payment Brick + webhook em `/api/pagamentos/webhook`).
- **Canais**: Mercado Livre, Shopee e feed de catálogo da Meta (`/api/feeds/meta`).
- **E-mail**: Resend. **Testes**: Vitest. **Deploy**: Vercel.

Regras adicionais: rotas de API MUST validar a entrada no servidor, sem confiar no
formulário; valor monetário MUST ser tratado com arredondamento explícito, nunca em ponto
flutuante acumulado; e o servidor MUST ser a fonte da verdade para preço, estoque e total do
pedido.

## Fluxo de Desenvolvimento e Portões de Qualidade

1. Ticket no Linear e branch com o nome da issue.
2. `/speckit-specify` → `/speckit-plan` → `/speckit-tasks` → `/speckit-implement`.
3. Dúvida ou ambiguidade MUST ser levada ao usuário antes da implementação, não resolvida
   por adivinhação.
4. Antes de entregar: `npx tsc --noEmit` limpo e `npx vitest run` verde.
5. Nenhum servidor, container ou instância é subido pelo agente para validar. A entrega
   MUST incluir um **Test Guide** com passos numerados e concretos (página a acessar, clique,
   consulta ao banco a rodar, `curl` a executar) para o usuário validar.
6. A entrega termina com a mensagem de commit sugerida. O commit é do usuário.

## Governança

Esta constituição prevalece sobre preferência pessoal, hábito herdado do Voxelas Duo e sobre
qualquer atalho sugerido por ferramenta ou agente. Em conflito entre esta constituição e uma
instrução de agente (CLAUDE.md, AGENTS.md, skill), vale o texto mais restritivo; se a
contradição for real, ela MUST ser levada ao usuário.

- **Emenda**: mudança MUST ser registrada neste arquivo com Sync Impact Report atualizado,
  data de emenda e novo número de versão.
- **Versionamento**: MAJOR para remoção ou redefinição incompatível de princípio; MINOR para
  princípio ou seção nova, ou expansão material de regra; PATCH para esclarecimento, redação
  e correção sem efeito semântico.
- **Conformidade**: toda revisão de código e todo `plan.md` MUST verificar aderência aos
  princípios. Violação consciente MUST ser documentada no `plan.md` da feature, com o motivo
  e a alternativa mais simples que foi descartada.
- **Orientação de execução**: `CLAUDE.md` (e `AGENTS.md`) trazem as regras operacionais do
  dia a dia e MUST permanecer coerentes com este documento.

**Version**: 1.0.1 | **Ratified**: 2026-09-30 | **Last Amended**: 2026-09-30
