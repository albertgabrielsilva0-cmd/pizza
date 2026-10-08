/* ==========================================================
   CATÁLOGO — edite só este arquivo para mudar o cardápio.

   ATENÇÃO: os itens abaixo são EXEMPLOS provisórios. Substitua
   pelos nomes, categorias, descrições e preços reais da loja.

   Campos de cada produto:
     id          identificador único, sem espaços
     name        nome exibido
     category    id de uma das categorias abaixo
     description descrição curta
     price       preço em reais (número, ex.: 9.9)
     image       (opcional) caminho da foto, ex.: "assets/fotos/morango.jpg".
                 Sem foto, o site desenha um donut com as cores de `art`.
     art         (opcional) cores da ilustração: glaze, dough, sprinkles
                 (lista de 3 cores) ou sprinkles: false
     tag         (opcional) selo, ex.: "Da casa"
     featured    (opcional) true para aparecer em "Os queridinhos da casa"
   ========================================================== */

window.CATALOG = {
  categories: [
    { id: "classicos", name: "Clássicos" },
    { id: "recheados", name: "Recheados" },
    { id: "especiais", name: "Especiais" }
  ],

  products: [
    {
      id: "morango",
      name: "Donut de morango",
      category: "classicos",
      description: "Cobertura cremosa de morango e confeitos coloridos.",
      price: 9.9,
      art: { glaze: "#FF7DB5", bg: "#FFE1EE" },
      featured: true
    },
    {
      id: "chocolate",
      name: "Donut de chocolate",
      category: "classicos",
      description: "Cobertura de chocolate ao leite e confeitos coloridos.",
      price: 9.9,
      art: { glaze: "#4A2618", bg: "#F3E3DA" },
      featured: true
    },
    {
      id: "acucar-canela",
      name: "Açúcar e canela",
      category: "classicos",
      description: "Massa fofinha passada no açúcar com canela.",
      price: 7.9,
      art: { glaze: "#F3D7A6", bg: "#FBF0DD", sprinkles: false }
    },
    {
      id: "ninho-nutella",
      name: "Ninho com Nutella",
      category: "recheados",
      description: "Recheio de Nutella e cobertura de leite Ninho.",
      price: 12.9,
      tag: "Recheado",
      art: { glaze: "#FFF8EE", bg: "#FFF4E6", sprinkles: ["#5A3222", "#7A4630", "#5A3222"] }
    },
    {
      id: "doce-de-leite",
      name: "Doce de leite",
      category: "recheados",
      description: "Recheado e coberto com doce de leite cremoso.",
      price: 11.9,
      tag: "Recheado",
      art: { glaze: "#D9954A", bg: "#FBEBD6", sprinkles: false }
    },
    {
      id: "brigadeiro",
      name: "Brigadeiro",
      category: "recheados",
      description: "Recheio de brigadeiro e granulado de chocolate.",
      price: 11.9,
      tag: "Recheado",
      art: { glaze: "#3B2016", bg: "#F1E2DA", sprinkles: ["#6B3A24", "#2A140C", "#8A5236"] }
    },
    {
      id: "pink-bem-querer",
      name: "Pink Bem Querer",
      category: "especiais",
      description: "Chocolate branco, creme de frutas vermelhas e confeitos.",
      price: 13.9,
      tag: "Da casa",
      art: { glaze: "#FFFFFF", bg: "#F50078", dark: true, sprinkles: ["#F50078", "#F5A623", "#34B7E8"] },
      featured: true
    },
    {
      id: "red-velvet",
      name: "Red Velvet",
      category: "especiais",
      description: "Massa red velvet com recheio de cream cheese.",
      price: 13.9,
      art: { glaze: "#B3122E", bg: "#FBE0E4", sprinkles: ["#FFFFFF", "#FFFFFF", "#F7E9EE"] }
    }
  ]
};
