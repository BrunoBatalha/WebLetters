const CARTA_STORAGE = "key_carta";

class Index {
  constructor() {
    this.cartaController = new CartaController();
    this.listaCartas = document.querySelector(".lista-cartas");
    this.formEnviaCarta = document.querySelector("#form-envia-carta");
    this.init();
  }

  init() {
    this.formEnviaCarta.addEventListener("submit", e => this.handleSubmit(e));
    this.exibeUltimasCartas();
  }

  handleSubmit(e) {
    e.preventDefault();

    const remetente = document.querySelector(
      "#form-envia-carta input[name=remetente]"
    );
    const mensagem = document.querySelector(
      "#form-envia-carta textarea[name=mensagem]"
    );

    const carta = new Carta(remetente.value, mensagem.value);
    this.cartaController.salvar(carta);

    remetente.value = "";
    mensagem.value = "";

    this.exibeUltimasCartas();
  }

  exibeUltimasCartas() {
    this.listaCartas.innerHTML = "";
    this.cartaController.listar(6).then(cartas => {
      cartas.reverse();
      cartas.forEach(carta =>
        criaCarta(carta.remetente, carta.key, this.listaCartas)
      );
    });
  }
}

class CartaPage {
  constructor() {
    this.cartaController = new CartaController();
    this.carta = document.querySelector(".carta");
    this.key = sessionStorage.getItem(CARTA_STORAGE);
    this.init();
  }

  async init() {
    const carta = await this.cartaController.buscar(this.key);
    this.exibeCarta(carta);
  }

  exibeCarta(carta) {
    const quebrasDeLinha = "\n";
    const regex = new RegExp(quebrasDeLinha, "g");

    let mensagem = carta.mensagem;
    mensagem = mensagem.replace(regex, "<br>");

    this.carta.innerHTML = mensagem;
  }
}

class CartasPage {
  constructor() {
    this.cartaController = new CartaController();
    this.listaCartas = document.querySelector(".lista-cartas");
    this.botaoProximaPagina = document.querySelector("#botaoProximaPagina");
    this.pagina = 1;
    this.totalPaginas = 1;
    this.quantidadePorPagina = 9;
    this.init();
  }

  async init() {
    this.setButtons();
    this.paginarCartas(this.pagina, this.quantidadePorPagina);
  }

  async paginarCartas(
    pagina = this.pagina,
    quantidadePorPagina = this.quantidadePorPagina
  ) {
    const { cartas, totalPaginas } = await this.cartaController.paginar(
      pagina,
      quantidadePorPagina
    );

    cartas.forEach(carta =>
      criaCarta(carta.remetente, carta.key, this.listaCartas)
    );

    this.totalPaginas = totalPaginas;

    if (pagina >= totalPaginas) {
      this.botaoProximaPagina.style.display = "none";
    } else {
      this.botaoProximaPagina.style.display = "block";
    }
  }

  setButtons() {
    this.botaoProximaPagina.addEventListener("click", () => {
      this.pagina = this.pagina + 1;
      this.paginarCartas(this.pagina, this.quantidadePorPagina);
    });
  }
}

const path = window.location.pathname;
if (path === "/index.html" || path === "/") new Index();
if (path === "/carta.html") new CartaPage();
if (path === "/cartas.html") new CartasPage();

function criaCarta(remetente, key, elementoPai) {
  const item = {
    li: document.createElement("li"),
    p: document.createElement("p"),
    a: document.createElement("a"),
    img: document.createElement("img")
  };

  item.li.className = "item-carta";
  item.p.className = "remetente";
  item.img.src = "img/carta.svg";
  item.img.alt = "Carta de " + remetente;

  item.li.appendChild(item.p);
  item.li.appendChild(item.a);
  item.a.appendChild(item.img);

  item.li.dataset.key = key;
  item.li.onclick = () => salvaKeyCarta(key);
  item.a.href = "carta.html";
  item.p.innerHTML = `De: ${remetente}`;

  elementoPai.appendChild(item.li);
}

function salvaKeyCarta(key) {
  sessionStorage.setItem(CARTA_STORAGE, key);
}

window.SimpleAnime = class {
  constructor() {
    (this.items = document.querySelectorAll("[data-anime]")), this.init();
  }
  animateItems() {
    this.items.forEach(t => {
      const e = Number(t.getAttribute("data-anime"));
      isNaN(e) ||
        setTimeout(() => {
          t.classList.add("anime");
        }, e);
    });
  }
  handleVisibility() {
    void 0 !== document.visibilityState
      ? "visible" === document.visibilityState && this.animateItems()
      : this.animateItems();
  }
  init() {
    (this.handleVisibility = this.handleVisibility.bind(this)),
      this.handleVisibility(),
      document.addEventListener("visibilitychange", this.handleVisibility);
  }
};

if (window.SimpleAnime) {
  new SimpleAnime();
}
