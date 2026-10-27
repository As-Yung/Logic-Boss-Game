/*
 * Logic Boss Game - lógica del juego (versión web 3).
 *
 * Parte de las clases Java de src/LogicBossGame (personajes, boss,
 * experiencia, preguntas y bucle de combate) con tres cambios pedidos:
 *   - Preguntas pensadas para niños: sin negativos ni decimales, divisiones
 *     exactas, y la dificultad sube poco a poco con cada boss.
 *   - Balance nuevo: 10 bosses, probabilidades claras, curación al vencer
 *     a un boss y rachas de aciertos con golpe crítico.
 *   - Arreglos del original: los personajes secretos ya pueden ganar y la
 *     experiencia ya no tiene ramas que nunca se usan.
 * La interfaz (interfaz.js) solo dibuja el estado y anima los eventos.
 */
(function (global) {
  "use strict";

  /* ------------------------------------------------------------------ */
  /* Configuración                                                       */
  /* ------------------------------------------------------------------ */

  var NIVEL_FINAL = 10;
  var RACHA_CRITICO = 3;
  var MULTIPLICADOR_CRITICO = 1.5;
  var CURACION_AL_VENCER = 0.6;
  var VIDA_POR_PUNTO = 3;

  var PERSONAJES = {
    "1": { id: "paladin", nombre: "Paladín", vida: 34, ataque: 10, velocidad: 9, esquiva: 9, secreto: false, lema: "Aguanta muchos golpes." },
    "2": { id: "asesino", nombre: "Asesino", vida: 26, ataque: 10, velocidad: 13, esquiva: 13, secreto: false, lema: "Rápido y difícil de golpear." },
    "3": { id: "mago", nombre: "Mago", vida: 28, ataque: 15, velocidad: 7, esquiva: 11, secreto: false, lema: "Golpes muy fuertes." },
    "4": { id: "arquero", nombre: "Arquero", vida: 28, ataque: 12, velocidad: 11, esquiva: 9, secreto: false, lema: "Equilibrado en todo." },
    "777": { id: "saitama", nombre: "Saitama", vida: 40, ataque: 40, velocidad: 8, esquiva: 8, secreto: true, lema: "Un solo puñetazo." },
    "888": { id: "messi", nombre: "Messi", vida: 34, ataque: 14, velocidad: 22, esquiva: 18, secreto: true, lema: "Siempre hace doble jugada." }
  };

  var BOSSES = [
    { nombre: "Blob Sumón", forma: "blob" },
    { nombre: "Rey Blob", forma: "blob", corona: true },
    { nombre: "Robo-Resta", forma: "robot" },
    { nombre: "Mega Robo", forma: "robot", corona: true },
    { nombre: "Murciélago Tablas", forma: "murcielago" },
    { nombre: "Vampi-Tablas", forma: "murcielago", corona: true },
    { nombre: "Fantasma Cifras", forma: "fantasma" },
    { nombre: "Gran Fantasma", forma: "fantasma", corona: true },
    { nombre: "Dragón Divisor", forma: "dragon" },
    { nombre: "Dragón Supremo", forma: "dragon", corona: true }
  ];

  var DIFICULTADES = {
    facil: { nombre: "Fácil", edad: "6 a 7 años", desplazamiento: -1, danioBoss: 0.7 },
    normal: { nombre: "Normal", edad: "8 a 9 años", desplazamiento: 0, danioBoss: 1 },
    dificil: { nombre: "Difícil", edad: "10 años o más", desplazamiento: 1, danioBoss: 1.2 }
  };

  function limitar(x, min, max) {
    return Math.max(min, Math.min(max, x));
  }

  function entero(rnd, min, max) {
    return min + Math.floor(rnd() * (max - min + 1));
  }

  function elegir(rnd, lista) {
    return lista[Math.floor(rnd() * lista.length)];
  }

  /* ------------------------------------------------------------------ */
  /* Personaje (personajesUno)                                           */
  /* ------------------------------------------------------------------ */

  function Personaje(clave) {
    var base = PERSONAJES[clave];
    this.clave = clave;
    this.id = base.id;
    this.nombre = base.nombre;
    this.secreto = base.secreto;
    this.nivel = 1;
    this.vidaMax = base.vida;
    this.vida = base.vida;
    this.ataque = base.ataque;
    this.velocidad = base.velocidad;
    this.esquiva = base.esquiva;
  }

  Personaje.prototype.curar = function (cantidad) {
    var antes = this.vida;
    this.vida = Math.min(this.vidaMax, this.vida + Math.round(cantidad));
    return this.vida - antes;
  };

  /* ------------------------------------------------------------------ */
  /* Boss (bossUno)                                                      */
  /* ------------------------------------------------------------------ */

  function Boss(nivel) {
    var info = BOSSES[nivel - 1];
    this.nivel = nivel;
    this.nombre = info.nombre;
    this.forma = info.forma;
    this.corona = !!info.corona;
    this.vidaMax = 28 + 13 * (nivel - 1);
    this.vida = this.vidaMax;
    this.ataque = 2 + nivel;
    this.velocidad = 5 + nivel;
    this.esquiva = 4 + nivel;
  }

  /* ------------------------------------------------------------------ */
  /* Experiencia (aplicacionesUno)                                       */
  /* ------------------------------------------------------------------ */

  function Experiencia(rnd) {
    this.rnd = rnd;
    this.actual = 0;
    this.necesaria = 40;
  }

  // Cada golpe da experiencia según el nivel del boss, con un pequeño extra al azar.
  Experiencia.prototype.ganar = function (nivelBoss) {
    var cantidad = 8 + nivelBoss + entero(this.rnd, 0, 4);
    this.actual += cantidad;
    return cantidad;
  };

  Experiencia.prototype.faltante = function () {
    return this.necesaria - this.actual;
  };

  // La experiencia sobrante se conserva para el siguiente nivel.
  Experiencia.prototype.subirNivel = function () {
    this.actual -= this.necesaria;
    this.necesaria += 20;
  };

  /* ------------------------------------------------------------------ */
  /* Preguntas (operacionesUno)                                          */
  /* ------------------------------------------------------------------ */

  // Tramo de dificultad según el boss: sube cada dos bosses.
  function tramoPregunta(nivelBoss, dificultad) {
    var base = Math.ceil(nivelBoss / 2);
    return limitar(base + DIFICULTADES[dificultad].desplazamiento, 1, 6);
  }

  var TRAMOS = {
    1: { tipos: ["suma", "resta"], hasta: 10 },
    2: { tipos: ["suma", "resta"], hasta: 20 },
    3: { tipos: ["suma", "resta", "multiplicacion"], hasta: 20, tablas: [1, 2, 5, 10] },
    4: { tipos: ["suma", "resta", "multiplicacion", "multiplicacion"], hasta: 50, tablas: [2, 3, 4, 5, 10] },
    5: { tipos: ["suma", "resta", "multiplicacion", "division"], hasta: 100, tablas: [2, 3, 4, 5, 6, 10] },
    6: { tipos: ["suma", "resta", "multiplicacion", "division"], hasta: 100, tablas: [2, 3, 4, 5, 6, 7, 8, 9, 10] }
  };

  function crearPregunta(rnd, tramo) {
    var conf = TRAMOS[tramo];
    var tipo = elegir(rnd, conf.tipos);
    var a, b, respuesta, simbolo, nombre;

    if (tipo === "suma") {
      respuesta = entero(rnd, Math.min(4, conf.hasta), conf.hasta);
      a = entero(rnd, 1, respuesta - 1);
      b = respuesta - a;
      simbolo = "+";
      nombre = "Suma";
    } else if (tipo === "resta") {
      a = entero(rnd, Math.min(4, conf.hasta), conf.hasta);
      b = entero(rnd, 1, a - 1);
      respuesta = a - b;
      simbolo = "−";
      nombre = "Resta";
    } else if (tipo === "multiplicacion") {
      a = elegir(rnd, conf.tablas);
      b = entero(rnd, 1, 10);
      if (rnd() < 0.5) {
        var t = a; a = b; b = t;
      }
      respuesta = a * b;
      simbolo = "×";
      nombre = "Multiplicación";
    } else {
      b = elegir(rnd, conf.tablas.filter(function (x) { return x > 1; }));
      respuesta = entero(rnd, 1, 10);
      a = b * respuesta;
      simbolo = "÷";
      nombre = "División";
    }

    return {
      tipo: nombre,
      clase: tipo,
      tramo: tramo,
      a: a,
      b: b,
      simbolo: simbolo,
      respuesta: respuesta,
      opciones: crearOpciones(rnd, tipo, a, b, respuesta)
    };
  }

  // Tres opciones incorrectas parecidas a la correcta, sin negativos ni repetidas.
  function crearOpciones(rnd, tipo, a, b, respuesta) {
    var candidatos = [respuesta + 1, respuesta - 1, respuesta + 2, respuesta - 2];
    if (respuesta >= 15) {
      candidatos.push(respuesta + 10, respuesta - 10);
    }
    if (tipo === "multiplicacion") {
      candidatos.push(a * (b + 1), a * (b - 1), (a + 1) * b);
    }
    if (tipo === "resta" || tipo === "suma") {
      candidatos.push(tipo === "resta" ? a + b : Math.abs(a - b));
    }
    var vistas = {};
    vistas[respuesta] = true;
    var malas = [];
    barajar(rnd, candidatos).forEach(function (c) {
      if (malas.length < 3 && c >= 0 && !vistas[c]) {
        vistas[c] = true;
        malas.push(c);
      }
    });
    var extra = respuesta + 3;
    while (malas.length < 3) {
      if (!vistas[extra]) {
        vistas[extra] = true;
        malas.push(extra);
      }
      extra += 1;
    }
    return barajar(rnd, malas.concat([respuesta]));
  }

  function barajar(rnd, lista) {
    var copia = lista.slice();
    for (var i = copia.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1));
      var t = copia[i]; copia[i] = copia[j]; copia[j] = t;
    }
    return copia;
  }

  /* ------------------------------------------------------------------ */
  /* Probabilidades (sistemaUno)                                         */
  /* ------------------------------------------------------------------ */

  // Probabilidad de que el defensor esquive: crece con la diferencia de esquiva.
  function probEsquiva(defensor, atacante, base) {
    return limitar(base + (defensor.esquiva - atacante.esquiva) * 0.02, 0.05, 0.5);
  }

  // Probabilidad de golpear dos veces: crece con la diferencia de velocidad.
  function probDoble(atacante, defensor) {
    return limitar(0.15 + (atacante.velocidad - defensor.velocidad) * 0.03, 0.05, 0.6);
  }

  // Las respuestas a las adivinanzas bonus, como se escribían en consola.
  function seleccionar(texto) {
    var normal = String(texto).trim().toLowerCase();
    if (normal === "uno" || normal === "1") {
      return "777";
    }
    if (normal === "messi") {
      return "888";
    }
    return null;
  }

  /* ------------------------------------------------------------------ */
  /* Partida                                                             */
  /* ------------------------------------------------------------------ */

  function Juego(clave, opciones) {
    if (!PERSONAJES[clave]) {
      throw new Error("Personaje desconocido: " + clave);
    }
    opciones = opciones || {};
    this.rnd = opciones.rnd || Math.random;
    this.dificultad = DIFICULTADES[opciones.dificultad] ? opciones.dificultad : "normal";
    this.pj = new Personaje(clave);
    this.bs = new Boss(1);
    this.exp = new Experiencia(this.rnd);
    this.puntosPorNivel = this.pj.secreto ? 4 : 2;
    this.puntosPendientes = 0;
    this.racha = 0;
    this.mejorRacha = 0;
    this.aciertos = 0;
    this.turno = 0;
    this.fin = null;
    this.pregunta = this._nuevaPregunta();
  }

  Juego.prototype._nuevaPregunta = function () {
    return crearPregunta(this.rnd, tramoPregunta(this.bs.nivel, this.dificultad));
  };

  Juego.prototype._danioBoss = function () {
    return Math.max(1, Math.round(this.bs.ataque * DIFICULTADES[this.dificultad].danioBoss));
  };

  // Resuelve un turno completo con la respuesta del jugador y devuelve sus eventos.
  Juego.prototype.responder = function (valor) {
    if (this.fin || this.puntosPendientes > 0) {
      throw new Error("No se puede responder ahora");
    }
    var pj = this.pj;
    var bs = this.bs;
    var rnd = this.rnd;
    var eventos = [];
    var pregunta = this.pregunta;
    var acierto = Number(valor) === pregunta.respuesta;

    this.turno += 1;
    eventos.push({ tipo: acierto ? "acierto" : "error", respuesta: pregunta.respuesta });

    if (acierto) {
      this.aciertos += 1;
      this.racha += 1;
      this.mejorRacha = Math.max(this.mejorRacha, this.racha);
      var critico = this.racha >= RACHA_CRITICO;
      var danio = Math.round(pj.ataque * (critico ? MULTIPLICADOR_CRITICO : 1));
      var golpes = 0;

      if (rnd() < probEsquiva(bs, pj, 0.1)) {
        eventos.push({ tipo: "bossEsquiva", texto: bs.nombre + " esquivó tu ataque." });
      } else {
        golpes = 1;
        // Messi siempre hace doble jugada; el resto depende de la velocidad.
        if (pj.id === "messi" || rnd() < probDoble(pj, bs)) {
          golpes = 2;
        }
      }
      for (var g = 1; g <= golpes && bs.vida > 0; g++) {
        bs.vida = Math.max(0, bs.vida - danio);
        var ganada = this.exp.ganar(bs.nivel);
        eventos.push({
          tipo: "golpeJugador",
          danio: danio,
          golpe: g,
          critico: critico,
          exp: ganada,
          texto: (critico ? "¡Golpe crítico! " : "") + (g === 2 ? "¡Segundo golpe! " : "¡Le diste! ") + bs.nombre + " pierde " + danio + " de vida."
        });
      }
    } else {
      this.racha = 0;
      if (rnd() < probEsquiva(pj, bs, 0.25)) {
        eventos.push({ tipo: "jugadorEsquiva", texto: "¡Esquivaste el ataque de " + bs.nombre + "!" });
      } else {
        var golpesBoss = rnd() < probDoble(bs, pj) ? 2 : 1;
        var danioBoss = this._danioBoss();
        for (var h = 1; h <= golpesBoss && pj.vida > 0; h++) {
          pj.vida = Math.max(0, pj.vida - danioBoss);
          eventos.push({
            tipo: "golpeBoss",
            danio: danioBoss,
            golpe: h,
            texto: (h === 2 ? "¡Otra vez! " : "") + bs.nombre + " te quita " + danioBoss + " de vida."
          });
        }
      }
    }

    if (bs.vida <= 0) {
      eventos.push({ tipo: "bossDerrotado", nivel: bs.nivel, nombre: bs.nombre, texto: "¡Venciste a " + bs.nombre + "!" });
      if (bs.nivel >= NIVEL_FINAL) {
        return this._terminar("victoria", eventos);
      }
      var curado = pj.curar(pj.vidaMax * CURACION_AL_VENCER);
      this.bs = new Boss(bs.nivel + 1);
      eventos.push({ tipo: "nuevoBoss", nivel: this.bs.nivel, nombre: this.bs.nombre, curado: curado, texto: "¡Aparece " + this.bs.nombre + "!" + (curado > 0 ? " Recuperas " + curado + " de vida." : "") });
    }

    if (pj.vida <= 0) {
      return this._terminar("derrota", eventos);
    }

    if (this.exp.faltante() <= 0) {
      pj.nivel += 1;
      this.exp.subirNivel();
      this.puntosPendientes = this.puntosPorNivel;
      eventos.push({ tipo: "subeNivel", nivel: pj.nivel, puntos: this.puntosPorNivel, texto: "¡Subiste a nivel " + pj.nivel + "! Tienes " + this.puntosPorNivel + " puntos para mejorar." });
      return { eventos: eventos, fin: null };
    }

    this.pregunta = this._nuevaPregunta();
    return { eventos: eventos, fin: null };
  };

  // stat: "vida" | "ataque" | "velocidad" | "esquiva"
  Juego.prototype.asignarPunto = function (stat) {
    if (this.puntosPendientes <= 0) {
      throw new Error("No hay puntos por asignar");
    }
    var pj = this.pj;
    if (stat === "vida") {
      pj.vidaMax += VIDA_POR_PUNTO;
      pj.vida += VIDA_POR_PUNTO;
    } else if (stat === "ataque") {
      pj.ataque += 1;
    } else if (stat === "velocidad") {
      pj.velocidad += 1;
    } else {
      pj.esquiva += 1;
    }
    this.puntosPendientes -= 1;
    if (this.puntosPendientes === 0) {
      this.pregunta = this._nuevaPregunta();
    }
  };

  Juego.prototype._terminar = function (resultado, eventos) {
    this.fin = resultado;
    this.pregunta = null;
    return { eventos: eventos, fin: resultado };
  };

  var LogicBoss = {
    Juego: Juego,
    PERSONAJES: PERSONAJES,
    BOSSES: BOSSES,
    DIFICULTADES: DIFICULTADES,
    NIVEL_FINAL: NIVEL_FINAL,
    RACHA_CRITICO: RACHA_CRITICO,
    VIDA_POR_PUNTO: VIDA_POR_PUNTO,
    Boss: Boss,
    seleccionar: seleccionar,
    crearPregunta: crearPregunta,
    tramoPregunta: tramoPregunta,
    probEsquiva: probEsquiva,
    probDoble: probDoble
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = LogicBoss;
  } else {
    global.LogicBoss = LogicBoss;
  }
})(typeof window !== "undefined" ? window : this);
