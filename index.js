var canvas = document.getElementById("mycanvas");
var ctx = canvas.getContext("2d"); //Desenho do jogo bidimensional

alert("Player 1 (Esquerda): 'W' sobe, 'S' desce.");
alert("Player 2 (Direita): 'Up' sobe, 'Down' desce");
var comandos = {};

var bola = {
  x: canvas.width / 2 - 15, //posição inicial da bola
  y: canvas.height / 2 - 15,
  altura: 15, //dimensões da bola
  largura: 15,
  dirx: -1,
  diry: 1,
  mod: 0, //modificador de velocidade da bola conforme o número de vezes que os jogadores e as extremidades em relação ao eixo X a rebatem
  speed: 5.3  //velocidade inicial da bola
};

//especificações do Player 1
var esquerda = {
  x: 6, //posição inicial de cada player
  y: canvas.height / 2 - 60, //posicionado ao centro em relação ao eixo Y
  altura: 120, //dimensões de cada Player
  largura: 10,
  score: 0,
  speed: 17
};

//especificações do Player 2
var direita = {
  x: 834, //plano cartesiano sendo iniciado no canto superior esquerdo, sendo necessário estabelecer valores acrescidos à direita em relação ao eixo X
  y: canvas.height / 2 + 92,
  altura: 120,
  largura: 10,
  score: 0, //pontuação inicial
  speed: 17 //velocidade inicial
};

//especificações das barras do meio
var barra1 = {
  x: 0,
  y: canvas.height / 2 + 92,
  altura: 20,
  largura: 150,
  diry: 1,
  modB: 0,
  speed: 2.5,
  color: "rgba(255, 255, 255, 0.1)"
};
var barra2 = {
  x: 500,
  y: canvas.height / 2 + 92,
  altura: 20,
  largura: 150,
  diry: -1,
  modB: 0, //modificador da velocidade inicial das Barras
  speed: 2.5,
  color: "rgba(255, 255, 255, 0.1)"

};

document.addEventListener("keydown", function(e){
  comandos[e.keyCode] = true;
  //alert(e.keyCode); para saber o valor de cada tecla
}, false);

document.addEventListener("keyup", function(e){
  delete comandos[e.keyCode];
}, false);


function movimentoJogadores(){
    if (87 in comandos && esquerda.y > 0){ //teclas de comando representadas por números
    esquerda.y -= esquerda.speed;
    }
    else if (83 in comandos && esquerda.y + esquerda.altura < canvas.height){
      esquerda.y += esquerda.speed;
    }
    if (38 in comandos && direita.y > 0){
      direita.y -= direita.speed;
    }
    else if (40 in comandos && direita.y + direita.altura < canvas.height){
        direita.y += direita.speed;
    }

    //Condicionais que alteram a velocidade dos jogadores conforme o decorrer do jogo
    if (bola.mod >= 7){
      esquerda.speed = 25;
      direita.speed = 25;
    }
    else if (bola.mod >= 15){
      esquerda.speed = 36;
      direita.speed = 36;
    }else{
      esquerda.speed = 17;
      direita.speed = 17;
    }
}

function movimentoBola(){
  if (bola.y + bola.altura >= esquerda.y && bola.y <= esquerda.y + esquerda.altura && bola.x <= esquerda.x + esquerda.largura){ //se a bola encostar no jogador da esquerda
    bola.dirx = 1; //muda a direção da bola em relação ao eixo X
    bola.mod += 0.2; //multiplicador do valor da velocidade inicial da bola
    var audio = new Audio('bip.wav');
    audio.play();

  }else if (bola.y + bola.altura >= direita.y && bola.y <= direita.y + direita.altura && bola.x + bola.largura >= direita.x) { //se a bola encostar no jogador da direita
    bola.dirx = -1;
    bola.mod += 0.2; //multiplicador do valor da velocidade inicial da bola
    var audio = new Audio('bip.wav');
    audio.play();

  }
  if (bola.y <= 0){ //se a bola tocar n borda inferior do eixo Y
    bola.diry = 1; //valor de Y em relação a bola passa a ser acrescido
    var audio = new Audio('bipParede.wav');
    audio.play();

  }else if (bola.y + bola.altura >= canvas.height) { //se a bola tocar a borda superior do eixo Y
    bola.diry = -1; //valor de Y em relação a bola passa a ser decrescido
    var audio = new Audio('bipParede.wav');
    audio.play();

  }
  bola.x += (bola.speed + bola.mod) * bola.dirx; //multiplicador de velocidade em relação à direção
  bola.y += (bola.speed + bola.mod) * bola.diry;

//******* os valores subtraídos e somados nas condicionais abaixo são experimentais *********//

  if (bola.x < esquerda.x + esquerda.largura - 35){ //se a bola entrar 35 pixels à esquerda da borda em relação ao eixo X
    newGame("Player 2"); //ponto do Player 2 e o jogo reinicia
    var audio = new Audio('bipGol.wav');
    audio.play();
  }else if (bola.x + bola.largura > direita.x + 35) { //se a bola entrar 35 pixels à direita da borda em relação ao eixo Y
    newGame("Player 1"); //ponto do Player 1 e o jogo reinicia
    var audio = new Audio('bipGol.wav');
    audio.play();
  }

}


function movimentoBarra(){
  if (barra1.x + barra1.altura >= canvas.height && barra1.x <= barra.x + canvas.height){
    barra1.dix = -1;
    barra1.modB += 0.2;
  }
  else if (barra1.x + barra1.altura >= 650){
    barra1.dirx = 1;
    barra1.mod += 0.2;
  }
  barra1.x += (barra1.speed + barra1.modB);
  barra2.x -= (barra2.speed + barra2.modB);
  //adicionar uma função de tempo para que a cada meio segundo, a opacidade aumente e quando a opacidade atingir 1.0, decrescer esse valor.
}



function newGame(winner){
  if (winner == "Player 1"){
    esquerda.score++; //soma dos pontos no placar e reinício de partida (com os pontos marcados)
  }else{
    direita.score++;
  }

  //padrões resetados
  esquerda.y = canvas.height / 2 - esquerda.altura / 2;
  direita.y = esquerda.y;
  bola.y = canvas.height / 2 - bola.altura / 2;
  bola.x = canvas.width / 2 - bola.largura / 2;
  bola.mod = 0;

};

//desenho dos objetos
function desenho(){


  ctx.clearRect(0, 0, canvas.width, canvas.height); //bola
  movimentoJogadores();
  movimentoBola();
  movimentoBarra();

//desenho das barras
  ctx.fillStyle = barra1.color;
  ctx.fillRect(barra1.y, barra1.x, barra1.altura, barra1.largura);
  ctx.fillStyle = barra2.color;
  ctx.fillRect(barra2.y, barra2.x, barra2.altura, barra2.largura);

//linhas do campo
  ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
  ctx.fillRect(415, 620, 5, 10);
  ctx.fillRect(415, 600, 5, 10);
  ctx.fillRect(415, 580, 5, 10);
  ctx.fillRect(415, 560, 5, 10);
  ctx.fillRect(415, 540, 5, 10);
  ctx.fillRect(415, 520, 5, 10);
  ctx.fillRect(415, 500, 5, 10);
  ctx.fillRect(415, 480, 5, 10);
  ctx.fillRect(415, 460, 5, 10);
  ctx.fillRect(415, 440, 5, 10);
  ctx.fillRect(415, 420, 5, 10);
  ctx.fillRect(415, 400, 5, 10);
  ctx.fillRect(415, 380, 5, 10);
  ctx.fillRect(415, 360, 5, 10);
  ctx.fillRect(415, 340, 5, 10);
  ctx.fillRect(415, 320, 5, 10);
  ctx.fillRect(415, 300, 5, 10); // ~meio
  ctx.fillRect(415, 280, 5, 10);
  ctx.fillRect(415, 260, 5, 10);
  ctx.fillRect(415, 240, 5, 10);
  ctx.fillRect(415, 220, 5, 10);
  ctx.fillRect(415, 200, 5, 10);
  ctx.fillRect(415, 180, 5, 10);
  ctx.fillRect(415, 160, 5, 10);
  ctx.fillRect(415, 140, 5, 10);
  ctx.fillRect(415, 120, 5, 10);
  ctx.fillRect(415, 100, 5, 10);
  ctx.fillRect(415, 80, 5, 10);
  ctx.fillRect(415, 60, 5, 10);
  ctx.fillRect(415, 40, 5, 10);
  ctx.fillRect(415, 20, 5, 10);
  ctx.fillRect(415, 0, 5, 10);

//linhas superiores e inferiores
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, 850, 10);
  ctx.fillRect(0, 620, 850, 10);

  //jogadores
  ctx.fillStyle = "white";
  ctx.fillRect(esquerda.x, esquerda.y, esquerda.largura, esquerda.altura);
  ctx.fillRect(direita.x, direita.y, direita.largura, direita.altura);
  ctx.fillRect(bola.x, bola.y, bola.largura, bola.altura);

  //fontes do placar
  ctx.font = "130px Bit5x3";
  ctx.fillText(esquerda.score, 220, 120);
  ctx.font = "130px Bit5x3";
  ctx.fillText(direita.score, 560, 120);


}

setInterval(desenho, 15); //taxa de atualização do jogo
desenho();
