class Carta {
  constructor(remetente, mensagem) {
    this.remetente = remetente;
    this.mensagem = mensagem;
  }
}

class CartaController {
  salvar({ remetente, mensagem }) {
    database
      .ref("cartas")
      .push()
      .set({ remetente, mensagem });
  }

  async listar(quantidade) {
    const cartas = [];
    const snapshot = await database
      .ref("cartas")
      .limitToLast(quantidade)
      .once("value");

    snapshot.forEach(function(childSnapshot) {
      cartas.push(childSnapshot.val());
    });
    return cartas.map(({ remetente, mensagem }) => ({ remetente, mensagem }));
  }
}
