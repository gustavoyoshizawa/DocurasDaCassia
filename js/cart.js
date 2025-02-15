export default function cart() {
  function loadProducts() {
    fetch("/produtos.json")
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

    fetch("/produtos.json")
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

          const filtroAtivo =
            produto.type === "bolos" ? filtroBolos : filtroDoces;
          const filtroInativo =
            produto.type === "bolos" ? filtroDoces : filtroBolos;

          if (produto.type === "sobremesas") {
            filtroAtivo.classList.remove("ativo");
            filtroInativo.classList.remove("ativo");
            document.querySelector(".product-price").textContent =
              produto.preco;
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

    document.querySelector(
      ".product-price"
    ).innerText = `R$ ${precoTotal.toFixed(2)}`;
  }

  singleProdutosLoad();

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

  let carrinho = [];

  const salvarCarrinho = () =>
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
  const carregarCarrinho = () => {
    const carrinhoSalvo = localStorage.getItem("carrinho");
    if (carrinhoSalvo) {
      carrinho = JSON.parse(carrinhoSalvo);
      renderCarrinho();
    }
  };

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

    if (produto.filtro.charAt(0) !== "0") {
      const existente = carrinho.find(
        (item) => item.nome === produto.nome && item.filtro === produto.filtro
      );

      if (existente) {
        existente.quantidade++;
      } else {
        carrinho.push(produto);
      }

      renderCarrinho();
      salvarCarrinho();
      totalCarrinho();
      ativarCarrinho();
    } else {
      alert(
        "Por favor, selecione uma quantidade válida antes de adicionar ao carrinho."
      );
    }
  };

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
    salvarCarrinho();
    totalCarrinho();
  };

  window.alterarQuantidade = alterarQuantidade;

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

  const ativarCarrinho = () => body.classList.add("showCart");
  const fecharCarrinho = () => body.classList.remove("showCart");
  const eventos = ["touchstart", "click"];

  if (iconCart) {
    eventos.forEach((evento) => {
      iconCart.addEventListener(evento, ativarCarrinho);
    });
  }
  if (btnClose) {
    eventos.forEach((evento) => {
      btnClose.addEventListener(evento, fecharCarrinho);
    });
  }
  if (btnAddToCart) {
    eventos.forEach((evento) => {
      btnAddToCart.addEventListener(evento, addToCart);
    });
  }

  function totalCarrinho() {
    const totalCarrinho = document.querySelector(".total span");

    if (totalCarrinho) {
      if (carrinho.length === 0) {
        totalCarrinho.innerText = "R$ 00.00";

        localStorage.setItem("valorTotalCarrinho", "0.00");
        return;
      }

      let total = 0;
      carrinho.forEach((item) => {
        let quantidade = item.quantidade;
        let valorProdutos = +item.preco.replace("R$ ", "") * quantidade;

        total += valorProdutos;
      });

      totalCarrinho.innerText = `R$ ${total.toFixed(2)}`;

      localStorage.setItem("valorTotalCarrinho", total.toFixed(2));
    }
  }

  window.addEventListener("DOMContentLoaded", () => {
    const totalCarrinho = document.querySelector(".total span");
    const valorSalvo = localStorage.getItem("valorTotalCarrinho");

    if (totalCarrinho && valorSalvo) {
      totalCarrinho.innerText = `R$ ${parseFloat(valorSalvo).toFixed(2)}`;
    }
  });

  carregarCarrinho();
}
