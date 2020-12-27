firebase.analytics();
const database = firebase.database();

class Carta {
  constructor(remetente, mensagem, key = "") {
    this.remetente = remetente;
    this.mensagem = mensagem;
    this.key = key;
  }
}

class CartaController {
  salvar({ remetente, mensagem }) {
    database.ref("cartas_analise").push().set({ remetente, mensagem });
    alert("Sua mensagem será avaliada e postada, obrigado!");
  }

  async buscar(key) {
    const snapshot = await database.ref(`cartas/${key}`).once("value");
    const { remetente, mensagem } = snapshot.val();
    return new Carta(remetente, mensagem, snapshot.key);
  }

  async listar(quantidade) {
    const cartas = [];
    const snapshot = await database
      .ref("cartas")
      .limitToLast(quantidade)
      .once("value");

    snapshot.forEach((childSnapshot) => {
      const { remetente, mensagem } = childSnapshot.val();
      cartas.push(new Carta(remetente, mensagem, childSnapshot.key));
    });

    return cartas;
  }

  async paginar(pagina, quantidadePorPagina) {
    const cartas = [];
    const snapshot = await database.ref("cartas").once("value");

    snapshot.forEach((childSnapshot) => {
      const { remetente, mensagem } = childSnapshot.val();
      cartas.push(new Carta(remetente, mensagem, childSnapshot.key));
    });

    cartas.reverse();

    const inicio =
      pagina === 1 ? pagina - 1 : quantidadePorPagina * (pagina - 1);
    const fim = inicio + quantidadePorPagina;

    const totalItens = snapshot.numChildren();
    const totalPaginas = totalItens / quantidadePorPagina;

    return {
      cartas: cartas.slice(inicio, fim),
      totalPaginas: totalPaginas,
    };
  }
}
