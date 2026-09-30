# Contrato: POST /api/encomendas (público)

Body:
```json
{ "produtoId": "665f...", "quantidade": 30, "nome": "Ana", "email": "ana@x.com", "telefone": "19981234567", "descricao": "Para brinde de fim de ano", "website": "" }
```

| Caso | Resposta |
|---|---|
| Válido | `201 { ok: true }`: grava, avisa a loja e confirma ao cliente (e-mails best-effort) |
| `website` preenchido (robô) | `201 { ok: true }` sem gravar |
| `quantidade` ausente, não inteira, < 1 ou > 10000 | `400 { erros: { quantidade } }` |
| `produtoId` inválido ou inexistente | `400 { erros: { produtoId } }` |
| Sem `produtoId` e sem `descricao` | `400 { erros: { descricao } }` |
| Nome, e-mail ou telefone inválidos | `400 { erros: {...} }` (regras atuais) |

`produtoNome` é preenchido pelo servidor a partir do produto (nunca do cliente).
