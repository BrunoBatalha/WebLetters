class Index {
  constructor() {
    this.cartaController = new CartaController();
    this.listaCartas = document.querySelector(".lista-cartas");
    this.formEnviaCarta = document.querySelector("#form-envia-carta");
    this.init();
  }
  init() {
    this.formEnviaCarta.addEventListener("submit", e => this.handleSubmit(e));
    this.exibeCartas();
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
    this.exibeCartas();
  }

  exibeCartas() {
    this.listaCartas.innerHTML = "";
    this.cartaController.listar(6).then(cartas => {
      cartas.reverse();
      cartas.forEach(carta => this.criaCarta(carta.remetente));
    });
    // const a = this.cartaController.listar(6);
    // console.log(a);
  }

  criaCarta(remetente) {
    const li = document.createElement("li");
    const p = document.createElement("p");
    const a = document.createElement("a");
    const img = document.createElement("img");

    li.className = "item-carta";
    p.className = "remetente";
    img.src = "img/carta.svg";
    img.alt = "Carta de " + remetente;

    li.appendChild(p);
    li.appendChild(a);
    a.appendChild(img);

    p.innerHTML = `De: ${remetente}`;

    this.listaCartas.appendChild(li);
  }
}

new Index();

// <li class="item-carta">
//   <p class="remetente">De: Bruno Batalha</p>
//   <a href="carta.html">
//     <img src="img/carta.svg" alt="Carta de " />{" "}
//   </a>
// </li>;
