/* ==========================================================
   CATÁLOGO — edite só este arquivo para mudar o cardápio.
   Copiado do cardápio da unidade Dom Pedro - Ipiranga (Saipos).

   Campos de cada produto:
     id          identificador único, sem espaços
     name        nome exibido
     category    id de uma das categorias abaixo
     description (opcional) descrição
     price       preço em reais (número). 0 = valor a confirmar
     priceLabel  (opcional) texto no lugar do preço, ex.: "A partir de R$ 51,96"
     image       (opcional) foto, ex.: "assets/fotos/red-velvet.jpg".
                 Sem foto, o site desenha uma ilustração com as cores de `art`.
     art         (opcional) cores da ilustração: glaze, bg, sprinkles
                 (lista de 3 cores) ou sprinkles: false; kind: "box" ou "drink"
     tag         (opcional) selo
     featured    (opcional) true para aparecer em "Os queridinhos da casa"
   ========================================================== */

(function () {
  /* cores das ilustrações */
  const C = {
    choco: "#4A2618", chocoDark: "#2E160D", white: "#FFF8EE", pink: "#FF7DB5",
    hot: "#F50078", red: "#B3122E", pistache: "#9CC46B", caramel: "#D9954A",
    sugar: "#F3D7A6", glazed: "#F6E2B8", cheese: "#F2C14E", bacon: "#E08A3C"
  };
  const BG = { pink: "#FFE1EE", choco: "#F3E3DA", cream: "#FFF4E6", sand: "#FBF0DD", green: "#EEF5E2", red: "#FBE0E4", hot: "#F50078" };
  const NO = false;
  const brownSpr = ["#6B3A24", "#2A140C", "#8A5236"];
  const whiteSpr = ["#FFFFFF", "#FFFFFF", "#F7E9EE"];
  const redSpr = ["#E3263B", "#FFFFFF", "#E3263B"];

  window.CATALOG = {
    categories: [
      { id: "top5", name: "Donuts Top 5" },
      { id: "combos", name: "Combos Donuts" },
      { id: "com-recheio", name: "Donuts com Recheio" },
      { id: "mini", name: "Mini Donuts" },
      { id: "bomb", name: "Donuts Bomb" },
      { id: "caixa", name: "Caixa Degustação" },
      { id: "sem-recheio", name: "Donuts sem Recheio" },
      { id: "bebidas", name: "Bebidas" }
    ],

    products: [
      /* ---- DONUTS TOP 5 ---- */
      { id: "top-red-velvet", category: "top5", name: "RED VELVET", price: 23.99, tag: "Top 5", featured: true, art: { glaze: C.red, bg: BG.red, sprinkles: whiteSpr } },
      { id: "top-pistache", category: "top5", name: "PISTACHE", price: 22.99, tag: "Top 5", featured: true, art: { glaze: C.pistache, bg: BG.green, sprinkles: ["#5E8A3A", "#FFFFFF", "#5E8A3A"] } },
      { id: "top-bem-querer", category: "top5", name: "BEM QUERER", price: 23.99, tag: "Top 5", featured: true, art: { glaze: C.white, bg: BG.hot, dark: true, sprinkles: ["#F50078", "#F5A623", "#34B7E8"] } },
      { id: "top-nutella-morango", category: "top5", name: "NUTELLA COM MORANGO", price: 23.99, tag: "Top 5", featured: true, art: { glaze: C.choco, bg: BG.choco, sprinkles: redSpr } },
      { id: "top-kinder-bueno", category: "top5", name: "KINDER BUENO", price: 23.99, tag: "Top 5", featured: true, art: { glaze: C.white, bg: BG.cream, sprinkles: brownSpr } },

      /* ---- COMBOS DONUTS ---- */
      { id: "combo-3-leve-4", category: "combos", name: "COMPRE 3 LEVE 4", description: "Compre 3, 5 ou 8 donuts e ganhe donuts grátis no valor de até R$ 12,99", price: 51.96, priceLabel: "A partir de R$ 51,96", art: { kind: "box", bg: BG.pink } },
      { id: "combo-5-leve-6", category: "combos", name: "COMPRE 5 LEVE 6", description: "Compre 3, 5 ou 8 donuts e ganhe donuts grátis no valor de até R$ 12,99", price: 0, art: { kind: "box", bg: BG.pink } },
      { id: "combo-8-leve-10", category: "combos", name: "COMPRE 8 LEVE 10", description: "Compre 3, 5 ou 8 donuts e ganhe donuts grátis no valor de até R$ 12,99", price: 0, art: { kind: "box", bg: BG.pink } },

      /* ---- DONUTS COM RECHEIO ---- */
      { id: "rec-boston-cream", category: "com-recheio", name: "BOSTON CREAM", description: "Cobertura: Chocolate meio amargo. Recheio: Creme", price: 18.99, art: { glaze: C.chocoDark, bg: BG.choco, sprinkles: NO } },
      { id: "rec-kit-kat", category: "com-recheio", name: "KIT KAT", description: "Cobertura: Chocolate ao leite com Kit Kat. Recheio: Brigadeiro de Oreo", price: 18.99, art: { glaze: C.choco, bg: BG.red, sprinkles: ["#C8102E", "#E8B07A", "#C8102E"] } },
      { id: "rec-oreo", category: "com-recheio", name: "OREO", description: "Cobertura: Chocolate branco com pedaços de bolacha Oreo. Recheio: Brigadeiro de Oreo", price: 18.99, art: { glaze: C.white, bg: BG.cream, sprinkles: ["#1E1A1A", "#1E1A1A", "#3A2E2A"] } },
      { id: "rec-ouro-branco", category: "com-recheio", name: "OURO BRANCO", description: "Cobertura: Chocolate branco com Ouro Branco. Recheio: Ganache cremoso de Ouro Branco", price: 22.99, art: { glaze: C.white, bg: BG.sand, sprinkles: ["#F5A623", "#D9954A", "#F5A623"] } },
      { id: "rec-ovomaltine", category: "com-recheio", name: "OVOMALTINE", description: "Cobertura: Chocolate ao leite com Ovomaltine. Recheio: Nutella", price: 22.99, art: { glaze: C.choco, bg: BG.choco, sprinkles: ["#E8B07A", "#C98A4B", "#E8B07A"] } },
      { id: "rec-ferrero-rocher", category: "com-recheio", name: "FERRERO ROCHER", description: "Cobertura: Chocolate meio amargo com castanhas e Ferrero Rocher. Recheio: Nutella", price: 24.99, art: { glaze: C.chocoDark, bg: BG.sand, sprinkles: ["#C98A4B", "#F5A623", "#C98A4B"] } },
      { id: "rec-ninho", category: "com-recheio", name: "NINHO", description: "Cobertura: Chocolate branco com Ninho. Recheio: Brigadeiro de Ninho", price: 18.99, art: { glaze: C.white, bg: BG.cream, sprinkles: whiteSpr } },
      { id: "rec-ninho-morango", category: "com-recheio", name: "NINHO COM MORANGO", description: "Cobertura: Ninho em pó, chantininho e morango. Recheio: Brigadeiro de Ninho e morangos picados", price: 23.99, art: { glaze: C.white, bg: BG.pink, sprinkles: redSpr } },
      { id: "rec-ninho-nutella", category: "com-recheio", name: "NINHO COM NUTELLA", description: "Cobertura: Chocolate branco com Ninho. Recheio: Nutella", price: 22.99, art: { glaze: C.white, bg: BG.cream, sprinkles: brownSpr } },
      { id: "rec-mm", category: "com-recheio", name: "M&M", description: "Cobertura: Chocolate ao leite com M&M. Recheio: Brigadeiro", price: 18.99, art: { glaze: C.choco, bg: BG.choco } },
      { id: "rec-bombuva", category: "com-recheio", name: "BOMBUVA", description: "Cobertura: Ninho em pó, uvas verdes e fios de chocolate branco. Recheio: Brigadeiro de Ninho", price: 19.99, art: { glaze: C.white, bg: BG.green, sprinkles: ["#9CC46B", "#FFFFFF", "#7BA84E"] } },

      /* ---- MINI DONUTS ---- */
      { id: "mini-creme", category: "mini", name: "CREME", price: 4.0, art: { glaze: C.sugar, bg: BG.sand, sprinkles: NO } },
      { id: "mini-ninho", category: "mini", name: "NINHO", price: 5.0, art: { glaze: C.white, bg: BG.cream, sprinkles: whiteSpr } },
      { id: "mini-mm", category: "mini", name: "M&M", price: 5.0, art: { glaze: C.choco, bg: BG.choco } },
      { id: "mini-kit-kat", category: "mini", name: "KIT KAT", price: 6.0, art: { glaze: C.choco, bg: BG.red, sprinkles: ["#C8102E", "#E8B07A", "#C8102E"] } },
      { id: "mini-pistache", category: "mini", name: "PISTACHE", price: 7.0, art: { glaze: C.pistache, bg: BG.green, sprinkles: ["#5E8A3A", "#FFFFFF", "#5E8A3A"] } },
      { id: "mini-doce-de-leite", category: "mini", name: "DOCE DE LEITE", price: 5.0, art: { glaze: C.caramel, bg: BG.sand, sprinkles: NO } },
      { id: "mini-nutella", category: "mini", name: "NUTELLA", price: 5.0, art: { glaze: C.choco, bg: BG.choco, sprinkles: NO } },
      { id: "mini-oreo", category: "mini", name: "OREO", price: 5.0, art: { glaze: C.white, bg: BG.cream, sprinkles: ["#1E1A1A", "#1E1A1A", "#3A2E2A"] } },
      { id: "mini-ninho-nutella", category: "mini", name: "NINHO COM NUTELLA", price: 7.0, art: { glaze: C.white, bg: BG.cream, sprinkles: brownSpr } },
      { id: "mini-acucar-canela", category: "mini", name: "AÇUCAR E CANELA", price: 4.0, art: { glaze: C.sugar, bg: BG.sand, sprinkles: NO } },
      { id: "mini-brigadeiro", category: "mini", name: "BRIGADEIRO", price: 4.0, art: { glaze: C.chocoDark, bg: BG.choco, sprinkles: brownSpr } },
      { id: "mini-presunto-queijo", category: "mini", name: "PRESUNTO E QUEIJO", price: 6.0, art: { glaze: C.cheese, bg: BG.sand, sprinkles: ["#F2A0A0", "#F2A0A0", "#E8B07A"] } },
      { id: "mini-cheddar-bacon", category: "mini", name: "CHEDDAR E BACON", price: 6.0, art: { glaze: C.bacon, bg: BG.sand, sprinkles: ["#8A2E1C", "#B5462C", "#8A2E1C"] } },
      { id: "mini-glazed", category: "mini", name: "GLAZED", price: 4.0, art: { glaze: C.glazed, bg: BG.sand, sprinkles: NO } },
      { id: "mini-homer", category: "mini", name: "HOMER", price: 4.0, art: { glaze: C.pink, bg: BG.pink } },
      { id: "mini-kinder-bueno", category: "mini", name: "KINDER BUENO", price: 7.0, art: { glaze: C.white, bg: BG.cream, sprinkles: brownSpr } },
      { id: "mini-chocolate", category: "mini", name: "CHOCOLATE", price: 4.0, art: { glaze: C.choco, bg: BG.choco } },
      { id: "mini-ovomaltine", category: "mini", name: "OVOMALTINE", price: 7.0, art: { glaze: C.choco, bg: BG.choco, sprinkles: ["#E8B07A", "#C98A4B", "#E8B07A"] } },
      { id: "mini-boston-cream", category: "mini", name: "BOSTON CREAM", price: 4.0, art: { glaze: C.chocoDark, bg: BG.choco, sprinkles: NO } },
      { id: "mini-fricasse-frango", category: "mini", name: "FRICASSE DE FRANGO", price: 6.0, art: { glaze: C.cheese, bg: BG.sand, sprinkles: ["#7BC86C", "#FFFFFF", "#E8B07A"] } },
      { id: "mini-nutella-morango", category: "mini", name: "NUTELLA COM MORANGO", price: 7.0, art: { glaze: C.choco, bg: BG.choco, sprinkles: redSpr } },
      { id: "mini-ouro-branco", category: "mini", name: "OURO BRANCO", price: 7.0, art: { glaze: C.white, bg: BG.sand, sprinkles: ["#F5A623", "#D9954A", "#F5A623"] } },
      { id: "mini-bombuva", category: "mini", name: "BOMBUVA", price: 5.0, art: { glaze: C.white, bg: BG.green, sprinkles: ["#9CC46B", "#FFFFFF", "#7BA84E"] } },
      { id: "mini-ninho-morango", category: "mini", name: "NINHO COM MORANGO", price: 7.0, art: { glaze: C.white, bg: BG.pink, sprinkles: redSpr } },

      /* ---- DONUTS BOMB ---- */
      { id: "bomb-creme", category: "bomb", name: "CREME", description: "Delicioso recheio de creme empanado no açúcar de confeiteiro", price: 18.99, art: { glaze: "#FFFFFF", bg: BG.sand, sprinkles: NO } },
      { id: "bomb-doce-de-leite", category: "bomb", name: "DOCE DE LEITE", description: "Clássico recheio de doce de leite empanado no açúcar de confeiteiro", price: 18.99, art: { glaze: "#FFFFFF", bg: BG.sand, sprinkles: NO } },
      { id: "bomb-nutella", category: "bomb", name: "NUTELLA", description: "Para os amantes de Nutella: recheio de muuuita Nutella e empanado no leite Ninho", price: 23.99, art: { glaze: C.white, bg: BG.choco, sprinkles: whiteSpr } },

      /* ---- CAIXA DEGUSTAÇÃO ---- */
      { id: "caixa-degustacao-12", category: "caixa", name: "Caixa Degustação 12 unidades", price: 59.99, art: { kind: "box", bg: BG.pink } },
      { id: "caixa-combo-net-flitz", category: "caixa", name: "Combo net flitz", price: 39.99, art: { kind: "box", bg: BG.red } },
      { id: "caixa-mata-fome-4", category: "caixa", name: "Mata Fome 4 unidades", price: 29.99, art: { kind: "box", bg: BG.sand } },

      /* ---- DONUTS SEM RECHEIO ---- */
      { id: "sr-glazed", category: "sem-recheio", name: "GLAZED - CALDA DE AÇUCAR", description: "Clássico dos Estados Unidos! Cobertura bem fininha de calda de açúcar", price: 12.99, art: { glaze: C.glazed, bg: BG.sand, sprinkles: NO } },
      { id: "sr-chocolate", category: "sem-recheio", name: "CHOCOLATE", description: "Cobertura de chocolate ao leite e granulados coloridos", price: 12.99, art: { glaze: C.choco, bg: BG.choco } },
      { id: "sr-acucar-canela", category: "sem-recheio", name: "AÇÚCAR E CANELA", description: "A combinação perfeita com um café! Donuts empanado no açúcar canela. Acrescente recheio: Doce de leite por R$5,00", price: 12.99, art: { glaze: C.sugar, bg: BG.sand, sprinkles: NO } },
      { id: "sr-homer", category: "sem-recheio", name: "HOMER", description: "Chocolate branco com corante rosa e granulados coloridos. Acrescente recheio Ninho ou Creme por R$5,00, Nutella por R$5,00", price: 12.99, art: { glaze: C.pink, bg: BG.pink } },
      { id: "sr-brigadeiro", category: "sem-recheio", name: "BRIGADEIRO", description: "Delicioso brigadeiro de panela com granulados. Acrescente recheio Brigadeiro por R$5,00", price: 12.99, art: { glaze: C.chocoDark, bg: BG.choco, sprinkles: brownSpr } },
      { id: "sr-nutella", category: "sem-recheio", name: "NUTELLA", description: "A clássica e amada Nutella. Acrescente Nutella por R$5,00", price: 18.99, art: { glaze: C.choco, bg: BG.choco, sprinkles: NO } },

      /* ---- BEBIDAS ---- */
      { id: "beb-agua-com-gas", category: "bebidas", name: "AGUA COM GÁS", price: 4.0, art: { kind: "drink", color: "#5BC0EB", bg: "#E6F5FC" } },
      { id: "beb-coca-350", category: "bebidas", name: "COCA COCA 350ML", price: 7.0, art: { kind: "drink", color: "#D7141A", bg: BG.red } },
      { id: "beb-coca-350-zero", category: "bebidas", name: "COCA COCA 350ML ZERO AÇUCAR", price: 7.0, art: { kind: "drink", color: "#171717", bg: "#EDEDED" } },
      { id: "beb-agua-sem-gas", category: "bebidas", name: "AGUA SEM GÁS", price: 4.0, art: { kind: "drink", color: "#9ED8F0", bg: "#E6F5FC" } }
    ]
  };
})();
