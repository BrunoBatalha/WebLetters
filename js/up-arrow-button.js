const alturaTela = window.innerHeight;
const botao = document.querySelector(".up-arrow-button");

botao.style.display = "none";

window.onscroll = () => {
  const distanciaDoTopo = window.pageYOffset;

  if (distanciaDoTopo * 2 < alturaTela) {
    botao.style.display = "none";
  } else {
    botao.style.display = "flex";
  }
};

botao.addEventListener("click", () => {
  window.scroll({
    top: 0,  
    left: 0,
    behavior: "smooth"
  })
});
