// Nav
function initNav() {
  const bntMobile = document.getElementById("btn-mobile");

  function toggleMenu(event) {
    if (event.type === "touchstart") event.preventDefault();
    const nav = document.getElementById("nav");
    nav.classList.toggle("active");
    const active = nav.classList.contains("active");
    event.currentTarget.setAttribute("aria-expanded", active);
  }

  bntMobile.addEventListener("click", toggleMenu);
  bntMobile.addEventListener("touchstart", toggleMenu);
}
initNav();

// Slider
function initSlider() {
  var radio = document.querySelector(".manual-btn");
  var cont = 1;

  if (radio) {
    document.getElementById("radio1").checked = true;

    setInterval(() => {
      proximaImg();
    }, 5000);

    function proximaImg() {
      cont++;
      if (cont > 4) {
        cont = 1;
      }
      document.getElementById("radio" + cont).checked = true;
    }
  }
}
initSlider();

function loadProducts() {
  fetch("produtos.json")
    .then((response) => response.json())
    .then((produtos) => {
      const containerElement = document.querySelector("#products-container");
      const page = window.location.pathname.split("/").pop();
      let productType;

      if (page === "bolos.html") {
        productType = "bolos";
      } else if (page === "docinhos.html") {
        productType = "doces";
      } else if (page === "sobremesas.html") {
        productType = "sobremesas";
      }

      produtos.forEach((produto) => {
        if (produto.type === productType) {
          const card = document.createElement("div");
          card.classList.add("bolos-sabores");
          const text = document.createElement("h1");
          text.textContent = produto.nome;
          const img = document.createElement("img");
          img.src = produto.imagem;
          img.alt = produto.nome;
          const button = document.createElement("button");
          button.innerText = "Ver Sobre";
          button.addEventListener("click", () => {
            window.location.href = `single-produtos.html?produto=${produto.id}`;
          });

          card.appendChild(text);
          card.appendChild(img);
          card.appendChild(button);
          containerElement.appendChild(card);
        }
      });
    });
}
loadProducts();

function singleProdutosLoad() {
  const params = new URLSearchParams(window.location.search);
  const produtoId = params.get("produto");

  fetch("produtos.json")
    .then((response) => response.json())
    .then((produtos) => {
      const produto = produtos.find((p) => p.id == produtoId);
      if (produto) {
        document.querySelector("#product-name").textContent = produto.nome;
        document.querySelector("#product-image").src = produto.imagem;
        document.querySelector("#product-description").textContent =
          produto.descricao;

        const filtroDoces = document.querySelector("#filtroDoces");
        const filtroBolos = document.querySelector("#filtroBolos");

        // Define o filtro correto e oculta o outro
        const filtroAtivo =
          produto.type === "bolos" ? filtroBolos : filtroDoces;
        const filtroInativo =
          produto.type === "bolos" ? filtroDoces : filtroBolos;

        if (produto.type === "sobremesas") {
          filtroAtivo.classList.remove("ativo");
          filtroInativo.classList.remove("ativo");
          document.querySelector(".product-price").textContent = produto.preco;
        }

        filtroInativo.classList.remove("ativo");

        filtroAtivo.addEventListener("change", () =>
          calcularPreco(produto, filtroAtivo)
        );
      }
    });
}

function calcularPreco(produto, filtro) {
  const pesoSelecionado = parseFloat(filtro.value);
  const valorProduto = parseFloat(
    produto.preco.replace("R$ ", "").replace(",", ".")
  );
  const precoTotal = valorProduto * pesoSelecionado;

  document.querySelector(".product-price").innerText = `R$ ${precoTotal.toFixed(
    2
  )}`;
}

singleProdutosLoad();

// Seleção de elementos
const iconCart = document.querySelector(".carrito");
const body = document.body;
const btnClose = document.querySelector(".close");
const carrinhoItens = document.querySelector(".cart");
const btnAddToCart = document.querySelector("#add-to-cart");
const h1 = document.querySelector("#product-name");
const price = document.querySelector(".product-price");
const filtroDoces = document.querySelector("#filtroDoces");
const filtroBolos = document.querySelector("#filtroBolos");
const linkFoto = document.querySelector("#product-image");

// Carrinho de compras
let carrinho = [];

// Salvar e carregar carrinho no localStorage
const salvarCarrinho = () =>
  localStorage.setItem("carrinho", JSON.stringify(carrinho));
const carregarCarrinho = () => {
  const carrinhoSalvo = localStorage.getItem("carrinho");
  if (carrinhoSalvo) {
    carrinho = JSON.parse(carrinhoSalvo);
    renderCarrinho();
  }
};

// Exibir e fechar carrinho
const ativarCarrinho = () => body.classList.add("showCart");
const fecharCarrinho = () => body.classList.remove("showCart");

// Adicionar produto ao carrinho
const addToCart = () => {
  const filtroSelecionado = filtroDoces?.classList.contains("ativo")
    ? `${filtroDoces.value} uni`
    : filtroBolos?.classList.contains("ativo")
    ? `${filtroBolos.value} kg`
    : "";

  const produto = {
    nome: h1.innerText,
    preco: price.innerText,
    imagem: linkFoto.src,
    filtro: filtroSelecionado,
    quantidade: 1,
  };

  const existente = carrinho.find(
    (item) => item.nome === produto.nome && item.filtro === produto.filtro
  );

  existente ? existente.quantidade++ : carrinho.push(produto);

  renderCarrinho();
  salvarCarrinho(); // Salva no localStorage
  totalCarrinho();
};

// Renderizar carrinho na interface
const renderCarrinho = () => {
  carrinhoItens.innerHTML = carrinho
    .map(
      (produto) => `
      <div class="carrinho-itens">
        <div class="imagem">
          <img src="${produto.imagem}" alt="${produto.nome}">
        </div>
        <div class="info">
        <div class="info-name">
          <h2>${produto.nome}</h2>
        </div>
        <div class="info-quantidade">
          <p>${produto.filtro}</p>
        </div>
        <div class="info-preco">
          <p>${produto.preco}</p>
          </div>
        </div>
        <div class="contador">
          <i class="fa-solid fa-minus" onclick="alterarQuantidade('${produto.nome}', '${produto.filtro}', -1)"></i>
          <span>${produto.quantidade}</span>
          <i class="fa-solid fa-plus" onclick="alterarQuantidade('${produto.nome}', '${produto.filtro}', 1)"></i>
        </div>
      </div>
    `
    )
    .join("");
};

// Alterar quantidade no carrinho
const alterarQuantidade = (nome, filtro, incremento) => {
  const produto = carrinho.find(
    (item) => item.nome === nome && item.filtro === filtro
  );

  if (produto) {
    produto.quantidade += incremento;
    if (produto.quantidade <= 0) {
      carrinho = carrinho.filter((item) => item !== produto);
    }
  }

  renderCarrinho();
  salvarCarrinho(); // Salva no localStorage
  totalCarrinho();
};

// Eventos
if (iconCart) {
  iconCart.addEventListener("click", ativarCarrinho);
}
if (btnClose) {
  btnClose.addEventListener("click", fecharCarrinho);
}
if (btnAddToCart) {
  btnAddToCart.addEventListener("click", addToCart);
}

// Carregar carrinho salvo ao iniciar
carregarCarrinho();

function totalCarrinho() {
  const totalCarrinho = document.querySelector(".total span");

  // Se o carrinho estiver vazio, zera o total
  if (carrinho.length === 0) {
    totalCarrinho.innerText = "R$ 00.00";
    return; // Sai da função, não precisa calcular mais nada
  }

  // Calcula o total caso existam itens no carrinho
  let total = 0;
  carrinho.forEach((item) => {
    let quantidade = item.quantidade;
    let valorProdutos = +item.preco.replace("R$ ", "") * quantidade;

    total += valorProdutos; // Soma o valor dos produtos
  });

  // Atualiza o total no HTML
  totalCarrinho.innerText = `R$ ${total.toFixed(2)}`;
}

totalCarrinho();
