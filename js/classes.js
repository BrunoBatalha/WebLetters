class Carta {
  constructor(remetente, mensagem, key = "") {
    this.remetente = remetente;
    this.mensagem = mensagem;
    this.key = key;
  }
}

class CartaController {
  salvar({ remetente, mensagem }) {
    database
      .ref("cartas")
      .push()
      .set({ remetente, mensagem });
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

    snapshot.forEach(function(childSnapshot) {
      const { remetente, mensagem } = childSnapshot.val();
      cartas.push(new Carta(remetente, mensagem, childSnapshot.key));
    });

    return cartas;
  }
}
