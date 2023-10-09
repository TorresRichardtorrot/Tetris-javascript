const MARGEN_TABLERO = 10;
let regulador_velocidad_teclas = 0;
let regualador_de_caida = 0;
let score = 0;
let angulo_fondo = Math.random()*360
let tono_fondo = Math.random()*360

setInterval(()=>{
  document.body.style.background = `linear-gradient(
    ${angulo_fondo}deg ,
     hsl(${tono_fondo},100%,50%),
     hsl(${tono_fondo},100%,5%)
      )`
      angulo_fondo+=Math.random()
      tono_fondo+=Math.random()
}, 20)


setInterval(() => {
  if (millis() - regualador_de_caida < 200) {
    return;
  }
  regualador_de_caida = millis();
  tetrimino.moverAbajo();
}, 500);

function setup() {
  createCanvas(900, 600);
  tablero = new Tablero();
  crearMapeoBaseTetriminos();
  tetrimino = new Tetrimino();

  resizeCanvas(
    tablero.ancho + 2 * MARGEN_TABLERO,
    tablero.alto + 2 * MARGEN_TABLERO + tablero.lados_celda
  );
}

function draw() {
  clear();
  dibujarPuntaje();
  tablero.dibujar();
  tetrimino.dibujar();
  keyEventsTetris();
}

function dibujarPuntaje() {
  push();
  textSize(20);
  strokeWeight(4);
  stroke("black");
  fill("white");
  text(
    "Líneas :" + score,
    tablero.posicion.x,
    tablero.posicion.y - tablero.lados_celda / 2
  );
  pop();
}

let limite_regulador_celocidad_teclas =100
function keyEventsTetris() {
  if (millis() - regulador_velocidad_teclas < limite_regulador_celocidad_teclas) {
   
    return;
  }
  limite_regulador_celocidad_teclas =100
  regulador_velocidad_teclas = millis();
  if (keyIsDown(RIGHT_ARROW)) {
    tetrimino.moverDerecha();
    regualador_de_caida = millis();
  }
  if (keyIsDown(LEFT_ARROW)) {
    tetrimino.moverIsquierda();
    regualador_de_caida = millis();
  }
  if (keyIsDown(UP_ARROW)) {
    limite_regulador_celocidad_teclas = 150
    tetrimino.girar();
    regualador_de_caida = millis();
  }
  if (keyIsDown(DOWN_ARROW)) {
    tetrimino.moverAbajo();
    regualador_de_caida = millis();
  }
  if (keyIsDown(32)) {
    limite_regulador_celocidad_teclas = 200
    tetrimino.ponerEnElFondo();
    regualador_de_caida = millis();
  }
}

class Tablero {
  constructor() {
    this.columnas = 10;
    this.filas = 20;
    this.lados_celda = 25;
    this.ancho = this.columnas * this.lados_celda;
    this.alto = this.filas * this.lados_celda;
    this.posicion = createVector(
      MARGEN_TABLERO,
      MARGEN_TABLERO + this.lados_celda
    );

    this.minosAlmacenados = [];
    for (let fila = 0; fila < this.filas; fila++) {
      this.minosAlmacenados[fila] = [];
      for (let columna = 0; columna < this.columnas; columna++) {
        this.minosAlmacenados[fila].push("");
      }
    }
  }

  set almacenarMinos(tetrimino) {
    for (const pmino of tetrimino.mapaTablero) {
      if (pmino.y < 0) {
        score = 0;
        tablero = new Tablero();
        tetrimino = new Tetrimino();
      }
      this.minosAlmacenados[pmino.x][pmino.y] = tetrimino.nombre;
    }
    this.buscarLineasHorizontalesBorrar();
  }

  buscarLineasHorizontalesBorrar() {
    let lineas = [];
    for (let fila = this.filas; fila >= 0; fila--) {
      let agreagar = true;
      for (let columna = 0; columna < this.columnas; columna++) {
        if (!this.minosAlmacenados[columna][fila]) {
          agreagar = false;
          break;
        }
      }
      if (agreagar) {
        lineas.push(fila);
      }
    }
    this.borrarLineasHorizontales(lineas);
  }

  borrarLineasHorizontales(lineas) {
    score += lineas.length;
    for (const linea of lineas) {
      for (let fila = linea; fila >= 0; fila--) {
        for (let columna = 0; columna < this.columnas; columna++) {
          if (fila == 0) {
            this.minosAlmacenados[columna][fila] = "";
            continue;
          }
          this.minosAlmacenados[columna][fila] =
            this.minosAlmacenados[columna][fila - 1];
        }
      }
    }
  }

  coordenada(x, y) {
    return createVector(x, y).mult(this.lados_celda).add(this.posicion);
  }

  dibujar() {
    push();
    noStroke();
    for (let columna = 0; columna < this.columnas; columna++) {
      for (let fila = 0; fila < this.filas; fila++) {
        if ((columna + fila) % 2 == 0) {
          fill("black");
        } else {
          fill("#002");
        }
        let c = this.coordenada(columna, fila);
        rect(c.x, c.y, this.lados_celda);
      }
    }
    pop();
    this.dibujarMinosAlmacenados();
  }
  dibujarMinosAlmacenados() {
    push();
    for (let columna = 0; columna < this.columnas; columna++) {
      for (let fila = 0; fila < this.filas; fila++) {
        let nombreMino = this.minosAlmacenados[columna][fila];
        if (nombreMino) {
          fill(tetriminosBase[nombreMino].color);
          Tetrimino.dibujarMino(this.coordenada(columna, fila));
        }
      }
    }
    pop();
  }
}

function crearMapeoBaseTetriminos() {
  tetriminosBase = {
    Z: {
      color: "red",
      mapa: [
        createVector(),
        createVector(-1, -1),
        createVector(0, -1),
        createVector(1, 0),
      ],
    },
    S: {
      color: "green",
      mapa: [
        createVector(),
        createVector(1, -1),
        createVector(0, -1),
        createVector(-1, 0),
      ],
    },
    J: {
      color: "orange",
      mapa: [
        createVector(),
        createVector(-1, 0),
        createVector(-1, -1),
        createVector(1, 0),
      ],
    },
    L: {
      color: "dodgerblue",
      mapa: [
        createVector(),
        createVector(-1, 0),
        createVector(1, -1),
        createVector(1, 0),
      ],
    },
    T: {
      color: "magenta",
      mapa: [
        createVector(),
        createVector(-1, 0),
        createVector(1, 0),
        createVector(0, -1),
      ],
    },
    O: {
      color: "yellow",
      mapa: [
        createVector(),
        createVector(0, -1),
        createVector(1, -1),
        createVector(1, 0),
      ],
    },
    I: {
      color: "cyan",
      mapa: [
        createVector(),
        createVector(-1, 0),
        createVector(1, 0),
        createVector(2, 0),
      ],
    },
  };
}
