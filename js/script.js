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
      cartas.forEach(carta => this.criaCarta(carta.remetente, carta.key));
    });
  }

  criaCarta(remetente, key) {
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
    item.li.onclick = () => this.salvaKeyCarta(key);
    item.a.href = "carta.html";
    item.p.innerHTML = `De: ${remetente}`;

    this.listaCartas.appendChild(item.li);
  }

  salvaKeyCarta(key) {
    sessionStorage.setItem(CARTA_STORAGE, key);
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
    this.carta.innerHTML = carta.mensagem;
  }
}

const path = window.location.pathname;
if (path === "/index.html") new Index();
if (path === "/carta.html") new CartaPage();
