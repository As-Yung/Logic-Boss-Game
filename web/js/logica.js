/*
 * Logic Boss Game - lógica del juego.
 *
 * Traducción a JavaScript de las clases Java de src/LogicBossGame
 * (personajesUno, bossUno, aplicacionesUno, operacionesUno y sistemaUno).
 * Las fórmulas, probabilidades y el orden de cada turno son los mismos que
 * en la versión de consola; aquí solo cambia la forma de pedir y mostrar
 * los datos, que ahora la hace la interfaz gráfica (interfaz.js).
 */
(function (global) {
  "use strict";

  var SHORT_MAX = 32767;

  // Emula los casts (short) e int de Java para que los desbordes coincidan.
  function aShort(x) {
    return (x << 16) >> 16;
  }

  function aInt(x) {
    return x | 0;
  }

  // División entera de Java: trunca hacia cero.
  function divEntera(a, b) {
    return Math.trunc(a / b);
  }

  /* ------------------------------------------------------------------ */
  /* personajesUno                                                       */
  /* ------------------------------------------------------------------ */

  var PERSONAJES = {
    "1": { id: "paladin", nombre: "Paladín", vida: 10, ataque: 10, velocidad: 10, esquiva: 10, secreto: false },
    "2": { id: "asesino", nombre: "Asesino", vida: 8, ataque: 10, velocidad: 11, esquiva: 11, secreto: false },
    "3": { id: "mago", nombre: "Mago", vida: 8, ataque: 14, velocidad: 6, esquiva: 12, secreto: false },
    "4": { id: "arquero", nombre: "Arquero", vida: 9, ataque: 12, velocidad: 10, esquiva: 8, secreto: false },
    "777": { id: "saitama", nombre: "Saitama", vida: 899999999, ataque: 899999999, velocidad: 899999999, esquiva: 899999999, secreto: true },
    "888": { id: "messi", nombre: "Messi", vida: 799, ataque: 799, velocidad: 799, esquiva: 799, secreto: true }
  };

  function Personaje(clave) {
    var base = PERSONAJES[clave];
    this.clave = clave;
    this.id = base.id;
    this.nombre = base.nombre;
    this.secreto = base.secreto;
    this.nivelPj = 1;
    this.vida = base.vida;
    this.ataque = base.ataque;
    this.velocidad = base.velocidad;
    this.esquiva = base.esquiva;
    this.estVIDA = this.vida;
    this.estATAQUE = this.ataque;
    this.estVELOCIDAD = this.velocidad;
    this.estESQUIVA = this.esquiva;
  }

  Personaje.prototype.nivelPersonaje = function () {
    this.nivelPj += 1;
  };

  // Igual que en Java, subir la vida también cura: estVIDA vuelve a la vida máxima.
  Personaje.prototype.aumentarVida = function (a) {
    this.vida = aInt(this.vida + a);
    this.estVIDA = this.vida;
  };

  Personaje.prototype.aumentarAtaque = function (a) {
    this.ataque = aInt(this.ataque + a);
    this.estATAQUE = this.ataque;
  };

  Personaje.prototype.aumentarVelocidad = function (a) {
    this.velocidad = aInt(this.velocidad + a);
    this.estVELOCIDAD = this.velocidad;
  };

  Personaje.prototype.aumentarEsquiva = function (a) {
    this.esquiva = aInt(this.esquiva + a);
    this.estESQUIVA = this.esquiva;
  };

  Personaje.prototype.disminuirVida = function (a) {
    this.estVIDA = aInt(this.estVIDA - a);
  };

  /* ------------------------------------------------------------------ */
  /* bossUno                                                             */
  /* ------------------------------------------------------------------ */

  function Boss() {
    this.nivelPjs = 1;
    this.nivelBoss = 1;
    this.vidaBoss = 50;
    this.ataqueBoss = 2;
    this.velocidadBoss = 8 + ((2 * this.nivelBoss) - this.nivelPjs);
    this.esquivaBoss = 4;
    this.esTvidaBoss = this.vidaBoss;
    this.esTataqueBoss = this.ataqueBoss;
    this.esTvelocidadBoss = this.velocidadBoss;
    this.esTesquivaBoss = this.esquivaBoss;
  }

  Boss.prototype.nivelPersonajeBoss = function () {
    this.nivelPjs += 1;
  };

  Boss.prototype.subirNivel = function () {
    this.nivelBoss += 1;
  };

  // Restaura la vida del boss al nuevo máximo.
  Boss.prototype.aumertarVidaBoss = function (veces) {
    this.vidaBoss = aInt(this.vidaBoss + 20 * (veces || 1));
    this.esTvidaBoss = this.vidaBoss;
  };

  Boss.prototype.aumentarAtaqueBoss = function (veces) {
    this.ataqueBoss = aInt(this.ataqueBoss + 2 * (veces || 1));
    this.esTataqueBoss = this.ataqueBoss;
  };

  Boss.prototype.aumentarVelocidadBoss = function () {
    this.velocidadBoss = 7 + ((2 * this.nivelBoss) - this.nivelPjs);
    this.esTvelocidadBoss = this.velocidadBoss;
  };

  Boss.prototype.aumentarEsquivaBoss = function (veces) {
    this.esquivaBoss = aInt(this.esquivaBoss + 3 * (veces || 1));
    this.esTesquivaBoss = this.esquivaBoss;
  };

  Boss.prototype.disminuirVidaBoss = function (a) {
    this.esTvidaBoss = aInt(this.esTvidaBoss - a);
  };

  /* ------------------------------------------------------------------ */
  /* aplicacionesUno (experiencia)                                       */
  /* ------------------------------------------------------------------ */

  function Experiencia(rnd) {
    this.rnd = rnd;
    this.nivelBoosApli = 1;
    this.nivelPjApli = 1;
    this.expTotal = 60;
    this.exp = 0;
    this.estExp = this.exp;
  }

  Experiencia.prototype.probabilidad = function () {
    return aShort(Math.floor(this.rnd() * 5000) + 1);
  };

  Experiencia.prototype.aumentarExp1 = function () {
    this.estExp = aShort(this.estExp + aShort(15 + (this.nivelBoosApli * 2) - this.nivelPjApli));
  };

  Experiencia.prototype.aumentarExp2 = function () {
    var x = Math.floor(this.rnd() * 10) + 1;
    // Las dos primeras condiciones vienen tal cual del original y nunca se
    // cumplen (x no puede valer 3 y 5 a la vez), así que siempre se suma 1-9.
    if (x === 3 && x === 5 && x === 7 && x === 9) {
      this.estExp = aShort(this.estExp + aShort(this.nivelBoosApli * this.probabilidad()));
    } else if (x === 2 && x === 4 && x === 6 && x === 8) {
      this.estExp = aShort(this.estExp + aShort(divEntera(this.nivelBoosApli * this.probabilidad(), 2)));
    } else {
      this.estExp = aShort(this.estExp + aShort(Math.floor(this.rnd() * 9) + 1));
    }
  };

  Experiencia.prototype.aumentarExpJuego = function () {
    var x = Math.floor(this.rnd() * 2) + 1;
    if (x === 1) {
      this.aumentarExp2();
    } else {
      this.aumentarExp1();
    }
  };

  // Sube el requisito en 60 y reinicia la experiencia actual a 0.
  Experiencia.prototype.aumentarExpTotal = function () {
    this.expTotal = aShort(this.expTotal + 60);
    this.estExp = this.exp;
  };

  Experiencia.prototype.faltante = function () {
    return this.expTotal - this.estExp;
  };

  /* ------------------------------------------------------------------ */
  /* operacionesUno (preguntas)                                          */
  /* ------------------------------------------------------------------ */

  function Operaciones(rnd) {
    this.rnd = rnd;
  }

  Operaciones.prototype.randomUno = function () {
    return aShort(Math.floor(2 + this.rnd() * 45));
  };

  Operaciones.prototype.randomDos = function () {
    return aShort(Math.floor(3 + this.rnd() * 15));
  };

  Operaciones.prototype.randomResp = function () {
    return aShort(Math.floor(1 + this.rnd() * 4));
  };

  Operaciones.prototype.randomFinal = function () {
    return Math.floor(1 + this.rnd() * 4);
  };

  Operaciones.prototype.potenciar = function (a, b) {
    var poten = a;
    if (b === 0) {
      poten = a === 0 ? SHORT_MAX : 1;
    } else {
      for (var i = 0; i < b - 1; i++) {
        poten = aShort(poten * a);
      }
    }
    return poten;
  };

  // Devuelve las opciones en el orden en que el original las imprimía.
  // Una opción incorrecta que vale 0 no se muestra, igual que en Java.
  Operaciones.prototype.randomPreguntas = function (pregunta) {
    var resp = [
      aShort(pregunta + this.randomResp() + 1),
      aShort(pregunta),
      aShort(pregunta + this.randomResp() + this.randomResp()),
      aShort(pregunta + this.randomResp() - this.randomResp() + 2)
    ];
    var opciones = [];
    var cont = 0;
    var valor = true;

    if (resp[1] === 0) {
      resp[1] = SHORT_MAX;
    }

    while (valor) {
      var num = this.randomFinal();
      if (resp[num - 1] !== 0) {
        opciones.push(resp[num - 1] === SHORT_MAX ? 0 : resp[num - 1]);
        resp[num - 1] = 0;
      }
      for (var i = 0; i < 4; i++) {
        if (resp[i] === 0) {
          cont += 1;
        }
        if (cont === 420) {
          valor = false;
        }
      }
    }
    return opciones;
  };

  Operaciones.prototype.crearPregunta = function () {
    var tipo = Math.floor(this.rnd() * 5) + 1;
    var uno, dos, respuesta, simbolo, nombre;

    switch (tipo) {
      case 1:
        uno = this.randomUno();
        dos = this.randomDos();
        respuesta = aShort(uno + dos);
        simbolo = "+";
        nombre = "Suma";
        break;
      case 2:
        uno = this.randomUno();
        dos = this.randomDos();
        respuesta = aShort(uno - dos);
        simbolo = "−";
        nombre = "Resta";
        break;
      case 3:
        uno = aShort((this.randomResp() * 2) - divEntera(this.randomResp(), 2));
        dos = this.randomResp();
        respuesta = aShort(uno * dos);
        simbolo = "×";
        nombre = "Multiplicación";
        break;
      case 4:
        uno = this.randomUno();
        dos = this.randomDos();
        respuesta = aShort(divEntera(uno, dos));
        simbolo = "÷";
        nombre = "División entera";
        break;
      default:
        uno = aShort((this.randomResp() * 2) - divEntera(this.randomResp(), 2));
        dos = this.randomResp();
        respuesta = this.potenciar(uno, dos);
        simbolo = "^";
        nombre = "Potencia";
        break;
    }

    return {
      tipo: nombre,
      a: uno,
      b: dos,
      simbolo: simbolo,
      respuesta: respuesta,
      opciones: this.randomPreguntas(respuesta)
    };
  };

  /* ------------------------------------------------------------------ */
  /* sistemaUno (probabilidades y bucle de juego)                        */
  /* ------------------------------------------------------------------ */

  function decidirEsquivaAtaque(rnd, a, b) {
    var proba1, proba2;
    if (b >= a) {
      proba1 = Math.floor(1 + rnd() * 10);
      proba2 = 10 - proba1;
    } else {
      proba2 = Math.floor(1 + rnd() * 10);
      proba1 = 10 - proba2;
    }
    return proba1 <= proba2;
  }

  function decidirAtaqueDoble(rnd, a, b) {
    var proba;
    if (a <= b) {
      proba = Math.floor(rnd() * b);
      return proba >= a;
    }
    proba = Math.floor(rnd() * a);
    return proba >= b;
  }

  // Las respuestas a las adivinanzas bonus, como se escribían en consola.
  function seleccionar(texto) {
    var pjs = String(texto).trim();
    var normal = pjs.toLowerCase();
    if (normal === "uno") {
      return "777";
    }
    if (normal === "messi") {
      return "888";
    }
    return pjs;
  }

  var NIVEL_FINAL_NORMAL = 25;
  var NIVEL_FINAL_SECRETO = 35;

  function Juego(clave, opciones) {
    if (!PERSONAJES[clave]) {
      throw new Error("Personaje desconocido: " + clave);
    }
    this.rnd = (opciones && opciones.rnd) || Math.random;
    this.pj = new Personaje(clave);
    this.bs = new Boss();
    this.ap = new Experiencia(this.rnd);
    this.pr = new Operaciones(this.rnd);
    this.puntosPorNivel = this.pj.secreto ? 4 : 2;
    this.puntosPendientes = 0;
    this.fin = null;
    this.turno = 0;
    this.pregunta = this.pr.crearPregunta();
  }

  Juego.PERSONAJES = PERSONAJES;

  // Resuelve un turno completo con la respuesta del jugador, en el mismo
  // orden que el while de sistemaUno.main. Devuelve los eventos del turno.
  Juego.prototype.responder = function (valor) {
    if (this.fin || this.puntosPendientes > 0) {
      throw new Error("No se puede responder ahora");
    }
    var pj = this.pj;
    var bs = this.bs;
    var ap = this.ap;
    var rnd = this.rnd;
    var eventos = [];
    var pregunta = this.pregunta;
    var acierto = Number(valor) === pregunta.respuesta;
    var expPorGolpe = pj.secreto ? 2 : 1;
    var i;

    this.turno += 1;
    eventos.push({ tipo: acierto ? "acierto" : "error", respuesta: pregunta.respuesta });

    if (acierto) {
      if (!decidirEsquivaAtaque(rnd, bs.esquivaBoss, pj.esquiva)) {
        bs.disminuirVidaBoss(pj.ataque);
        for (i = 0; i < expPorGolpe; i++) ap.aumentarExpJuego();
        eventos.push({ tipo: "golpeJugador", danio: pj.ataque, golpe: 1, texto: "¡Has logrado darle al boss! (x1)" });
        if (decidirAtaqueDoble(rnd, bs.velocidadBoss, pj.velocidad)) {
          bs.disminuirVidaBoss(pj.ataque);
          for (i = 0; i < expPorGolpe; i++) ap.aumentarExpJuego();
          eventos.push({ tipo: "golpeJugador", danio: pj.ataque, golpe: 2, texto: "¡Has logrado darle al boss un segundo ataque! (x2)" });
        }
      } else {
        eventos.push({ tipo: "bossEsquiva", texto: "Has fallado, el boss te ha esquivado." });
      }
    } else {
      if (decidirEsquivaAtaque(rnd, bs.esquivaBoss, pj.esquiva)) {
        pj.disminuirVida(bs.ataqueBoss);
        eventos.push({ tipo: "golpeBoss", danio: bs.ataqueBoss, golpe: 1, texto: "Has fallado, no lograste esquivar al boss. (x1)" });
        if (!decidirAtaqueDoble(rnd, bs.velocidadBoss, pj.velocidad)) {
          pj.disminuirVida(bs.ataqueBoss);
          eventos.push({ tipo: "golpeBoss", danio: bs.ataqueBoss, golpe: 2, texto: "Has fallado, no lograste esquivar al boss de nuevo. (x2)" });
        }
      } else {
        eventos.push({ tipo: "jugadorEsquiva", texto: "¡Has logrado esquivar el ataque del boss!" });
        if (pj.secreto) {
          eventos.push({ tipo: "bossEvoluciona", nivel: bs.nivelBoss, texto: "¡El boss de nivel " + bs.nivelBoss + " ha evolucionado!" });
          bs.subirNivel();
          bs.nivelPersonajeBoss();
          bs.aumentarVelocidadBoss();
          if (pj.clave === "777") {
            bs.aumertarVidaBoss(35000);
            bs.aumentarAtaqueBoss(3500000);
            bs.aumentarEsquivaBoss(3500000);
          } else {
            bs.aumertarVidaBoss(15);
            bs.aumentarAtaqueBoss(15);
            bs.aumentarEsquivaBoss(15);
          }
        }
      }
    }

    if (bs.esTvidaBoss <= 0) {
      eventos.push({ tipo: "bossDerrotado", nivel: bs.nivelBoss, texto: "¡Felicidades, has vencido al boss de nivel " + bs.nivelBoss + "!" });
      bs.subirNivel();
      if (pj.secreto) {
        bs.nivelPersonajeBoss();
        bs.aumentarVelocidadBoss();
        if (pj.clave === "777") {
          bs.aumertarVidaBoss(75000);
          bs.aumentarAtaqueBoss(7000000);
          bs.aumentarEsquivaBoss(7000000);
        } else {
          bs.aumertarVidaBoss(30);
          bs.aumentarAtaqueBoss(30);
          bs.aumentarEsquivaBoss(30);
        }
      } else {
        bs.aumertarVidaBoss();
        bs.aumentarAtaqueBoss();
        bs.aumentarEsquivaBoss();
        bs.nivelPersonajeBoss();
        bs.aumentarVelocidadBoss();
      }
    }

    if (pj.secreto) {
      if (bs.nivelBoss === NIVEL_FINAL_SECRETO && bs.esTvidaBoss <= 0 && pj.nivelPj > 4) {
        return this._terminar("victoria", eventos);
      } else if (bs.nivelBoss === NIVEL_FINAL_SECRETO && bs.esTvidaBoss > 0 && pj.nivelPj <= 4) {
        return this._terminar("fracaso", eventos);
      }
    } else if (bs.nivelBoss === NIVEL_FINAL_NORMAL) {
      return this._terminar("victoria", eventos);
    }

    if (ap.faltante() <= 0) {
      pj.nivelPersonaje();
      ap.nivelBoosApli += 1;
      ap.nivelPjApli += 1;
      ap.aumentarExpTotal();
      this.puntosPendientes = this.puntosPorNivel;
      eventos.push({ tipo: "subeNivel", nivel: pj.nivelPj, puntos: this.puntosPorNivel, texto: "¡Subiste a nivel " + pj.nivelPj + "! Tienes " + this.puntosPorNivel + " puntos para mejorar tus stats." });
      return { eventos: eventos, fin: null };
    }

    return this._siguienteTurno(eventos);
  };

  // stat: "vida" | "ataque" | "velocidad" | "esquiva"
  Juego.prototype.asignarPunto = function (stat) {
    if (this.puntosPendientes <= 0) {
      throw new Error("No hay puntos por asignar");
    }
    if (stat === "vida") {
      this.pj.aumentarVida(1);
    } else if (stat === "ataque") {
      this.pj.aumentarAtaque(1);
    } else if (stat === "velocidad") {
      this.pj.aumentarVelocidad(1);
    } else {
      this.pj.aumentarEsquiva(1);
    }
    this.puntosPendientes -= 1;
    if (this.puntosPendientes === 0) {
      return this._siguienteTurno([]);
    }
    return { eventos: [], fin: null };
  };

  Juego.prototype._siguienteTurno = function (eventos) {
    if (this.pj.estVIDA <= 0) {
      return this._terminar("derrota", eventos);
    }
    this.pregunta = this.pr.crearPregunta();
    return { eventos: eventos, fin: null };
  };

  Juego.prototype._terminar = function (resultado, eventos) {
    this.fin = resultado;
    this.pregunta = null;
    return { eventos: eventos, fin: resultado };
  };

  var LogicBoss = {
    Juego: Juego,
    PERSONAJES: PERSONAJES,
    seleccionar: seleccionar,
    decidirEsquivaAtaque: decidirEsquivaAtaque,
    decidirAtaqueDoble: decidirAtaqueDoble,
    Operaciones: Operaciones,
    Experiencia: Experiencia,
    Boss: Boss,
    Personaje: Personaje,
    NIVEL_FINAL_NORMAL: NIVEL_FINAL_NORMAL,
    NIVEL_FINAL_SECRETO: NIVEL_FINAL_SECRETO
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = LogicBoss;
  } else {
    global.LogicBoss = LogicBoss;
  }
})(typeof window !== "undefined" ? window : this);
