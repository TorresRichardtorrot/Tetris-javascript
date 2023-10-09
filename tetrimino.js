class Tetrimino {
  constructor(nombre = random(["Z", "S", "J", "L", "T", "O", "I"])) {
    this.nombre = nombre;
    let base = tetriminosBase[nombre];
    this.color = base.color;
    this.mapa = [];

    for (const pmino of base.mapa) {
      this.mapa.push(pmino.copy());
    }
    this.posicion = createVector(int(tablero.columnas / 2), 0);
  }

  moverDerecha() {
    this.posicion.x++;
    if (this.movimientoErroneo) {
      this.moverIsquierda();
    }
  }

  moverIsquierda() {
    this.posicion.x--;
    if (this.movimientoErroneo) {
      this.moverDerecha();
    }
  }

  moverAbajo() {
    this.posicion.y++;
    if (this.movimientoErroneo) {
      this.moverArriba();
      if (tetrimino == this) {
        tablero.almacenarMinos = this;
        tetrimino = new Tetrimino();
      }
      return false;
    }
    return true;
  }

  moverArriba() {
    this.posicion.y--;
  }

  ponerEnElFondo(){
    this.posicion = this.espectro.posicion
    this.moverAbajo()

  }

  girar() {
    for (const pmino of this.mapa) {
      pmino.set(pmino.y, -pmino.x);
    }
  }

  desgirar() {
    for (const pmino of this.mapa) {
      pmino.set(-pmino.y, pmino.x);
    }

    if (this.movimientoErroneo) {
      this.desgirar();
    }
  }

  get movimientoErroneo() {
    let salio = !this.estaDentroDelTablero;
    return salio || this.colisionConMinosAlmacenados;
  }

  get colisionConMinosAlmacenados() {
    for (const pmino of this.mapaTablero) {
      if (tablero.minosAlmacenados[pmino.x][pmino.y]) {
        return true;
      }
    }
    return false;
  }

  get estaDentroDelTablero() {
    for (const pmino of this.mapaTablero) {
      if (pmino.x < 0) {
        return false;
      }
      if (pmino.x >= tablero.columnas) {
        return false;
      }
      if (pmino.y >= tablero.filas) {
        return false;
      }
    }
    return true;
  }

  get mapaTablero() {
    let retorno = [];
    for (const pmino of this.mapa) {
      let copy = pmino.copy().add(this.posicion);
      retorno.push(copy);
    }
    return retorno;
  }

  get mapaCanvas() {
    let retorno = [];
    for (const pmino of this.mapa) {
      let copy = pmino.copy().add(this.posicion);
      retorno.push(tablero.coordenada(copy.x, copy.y));
    }
    return retorno;
  }

  dibujar() {
    push();
    fill(this.color);
    for (const pmino of this.mapaCanvas) {
      Tetrimino.dibujarMino(pmino);
    }
    pop();
    if (tetrimino == this) {
      this.dibujarEspectro();
    }
  }

  dibujarEspectro() {
    this.espectro = new Tetrimino(this.nombre);
    this.espectro.posicion = this.posicion.copy();

    for (let i = 0; i < this.mapa.length; i++) {
      this.espectro.mapa[i] = this.mapa[i].copy()
    }
    while (this.espectro.moverAbajo()) push();
    drawingContext.globalAlpha = 0.3;
    this.espectro.dibujar();
    pop();
  }

  static dibujarMino(pmino) {
    rect(pmino.x, pmino.y, tablero.lados_celda);
    push();
    noStroke();
    fill(255, 255, 255, 80);
    beginShape();
    vertex(pmino.x, pmino.y);
    vertex(pmino.x + tablero.lados_celda, pmino.y);
    vertex(pmino.x + tablero.lados_celda, pmino.y + tablero.lados_celda);
    endShape(CLOSE);
    beginShape();
    fill(0, 0, 0, 80);
    vertex(pmino.x, pmino.y);
    vertex(pmino.x, pmino.y + tablero.lados_celda);
    vertex(pmino.x + tablero.lados_celda, pmino.y + tablero.lados_celda);
    endShape(CLOSE);
    pop();
  }
}
