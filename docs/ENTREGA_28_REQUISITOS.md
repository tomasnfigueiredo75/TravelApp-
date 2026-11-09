# Guia de entrega — 28 critérios

Este documento organiza as evidências solicitadas na grelha de avaliação. **As capturas devem ser feitas pelo aluno na aplicação real depois de executar e testar cada fluxo.** Não utilizar imagens simuladas como prova.

## Preparação
- [ ] Criar repositório GitHub público e enviar o código.
- [ ] Confirmar que `docs/HISTORIAS_DE_UTILIZADOR.md` contém as histórias.
- [ ] Criar no Figma os dois conjuntos de ecrãs indicados pelo docente.

## Ficheiros de evidência
| Nº | Nome solicitado | O que deve mostrar |
|---:|---|---|
| 3 | `figma-evidence1.png` | Login, registo, detalhe e favoritos no Figma |
| 4 | `figma-evidence2.png` | API, menu, definições e notificações no Figma |
| 6 | `signup_screen_evidence.png` | Nome, email, palavra-passe, botão registar e link login |
| 7 | `signup_error.png` | Erro real de validação no registo |
| 9 | `login_screen_evidence.png` | Email, palavra-passe, botão login e link registo |
| 10 | `login_error.png` | Erro real de login |
| 12 | `home-screen-evidence.png` | Ecrã inicial e identidade visual |
| 14 | `evidence-detail-navigation.png` | Ação de navegação para detalhes |
| 15 | `evidence-detail-screen.png` | Detalhes de destino |
| 17 | `evidence-persistence.png` | Favoritos/viagens guardados depois de reiniciar |
| 18 | `evidence-integrateScreen-persistence.png` | Dados persistidos apresentados na interface |
| 20 | `evidence-api-ux.png` | Destinos recebidos da REST Countries API |
| 22 | `evidence-menu-icon.jpg` | Ícone/entrada do menu |
| 23 | `evidence-menu-items.jpg` | Itens de menu/definições |
| 25 | `evidence-settings-screen.png` | Ecrã de definições |
| 27 | `evidence-notification-configure.png` | Configuração/permissão de notificações |
| 28 | `evidence-notification-alert.png` | Notificação de teste recebida no dispositivo |

## Links de código GitHub a submeter
| Critério | Localização sugerida |
|---|---|
| Registo | `src/services/storage.ts` e `app/index.tsx` |
| Login | `src/services/storage.ts` e `app/index.tsx` |
| Ecrã inicial | `app/index.tsx` |
| Detalhes | `app/index.tsx` |
| Armazenamento local | `src/services/storage.ts` |
| Integração API | `src/data/destinations.ts` |
| Menu/definições | `app/index.tsx` |
| Notificações | `app/_layout.tsx` e `app/index.tsx` |

## Antes da submissão
- [ ] Executar em Android físico/emulador e testar todos os fluxos.
- [ ] Confirmar que a API externa responde.
- [ ] Testar a persistência depois de fechar e reabrir.
- [ ] Testar notificações num dispositivo/emulador nativo; notificações locais não funcionam no preview web.
- [ ] Confirmar que o repositório está público.
- [ ] Substituir todos os links genéricos pelos URLs reais dos ficheiros GitHub.
- [ ] Não declarar como concluído qualquer critério que não tenha sido demonstrado.
