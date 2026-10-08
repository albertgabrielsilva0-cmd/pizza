# Bem Querer Donuts — site

Site estático (HTML, CSS e JavaScript puro) com a identidade visual da Bem Querer Donuts:
cardápio com filtros, pedido com carrinho salvo no navegador e finalização pelo WhatsApp.

Para ver: abra `index.html` no navegador.

## Arquivos

| Arquivo | O que é |
|---|---|
| `css/tokens.css` | Tokens da identidade: cores, fontes, espaçamentos, raios, sombras, animações |
| `css/style.css` | Componentes e layout (usa só os tokens) |
| `js/catalog.js` | **Cardápio**: categorias e produtos — edite aqui |
| `js/main.js` | Renderização do cardápio, carrinho e WhatsApp |

## Antes de publicar (pendências)

- [x] **Cardápio real**: `js/catalog.js` copiado do cardápio da unidade Dom Pedro - Ipiranga (Saipos). Itens com preço 0 aparecem como "Consulte o valor".
- [x] **Foto do hero**: `assets/hero-donut*` aprovada para uso.
- [ ] **Fotos**: colocar as fotos em `assets/fotos/` e preencher `image` de cada produto. Sem foto, o site desenha um donut ilustrado.
- [ ] **Logo**: trocar o texto "BEM QUERER" no header e no rodapé de `index.html` pela logo original (`<img src="assets/logo.png" ...>`), sem distorcer.
- [ ] **WhatsApp**: preencher `WHATSAPP_NUMBER` em `js/main.js` (ex.: `5511999999999`).
- [ ] **Instagram**: link no rodapé de `index.html`.
- [ ] **Nossa história**: texto de exemplo; substituir pela história real.

## Identidade (resumo)

| Token | Cor | Uso |
|---|---|---|
| `--color-pink` | `#F50078` | Botões, destaques |
| `--color-pink-strong` | `#D10066` | Hover e textos rosa pequenos (contraste AA) |
| `--color-white` | `#FFFFFF` | Fundo principal |
| `--color-ink` | `#171717` | Textos e contornos |
| `--color-pink-light` | `#F7E9EE` | Seções alternadas |
| `--color-gold` | `#F5A623` | Apoio, com moderação |

Fontes: **Fredoka** (títulos), **Nunito Sans** (textos e botões), carregadas do Google Fonts.
