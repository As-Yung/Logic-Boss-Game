/*
 * Logic Boss Game - interfaz gráfica.
 *
 * La mecánica vive en logica.js y los dibujos en dibujos.js; este archivo
 * pinta el estado, recoge las respuestas y anima los eventos de cada turno.
 */
(function () {
  "use strict";

  var LB = window.LogicBoss;
  var D = window.Dibujos;
  var $ = function (id) { return document.getElementById(id); };

  var juego = null;
  var ocupado = false;
  var bossPintado = 0;
  var dificultad = leerPreferencia("lbg-dificultad", "normal");
  var sonidoActivo = leerPreferencia("lbg-sonido", "si") === "si";

  var reducido = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var NUM = new Intl.NumberFormat("es");
  function n(x) { return NUM.format(x); }

  /* ---------- Preferencias (solo comodidad, el juego funciona sin ellas) ---------- */

  function leerPreferencia(clave, porDefecto) {
    try {
      return window.localStorage.getItem(clave) || porDefecto;
    } catch (e) {
      return porDefecto;
    }
  }

  function guardarPreferencia(clave, valor) {
    try {
      window.localStorage.setItem(clave, valor);
    } catch (e) { /* sin almacenamiento */ }
  }

  /* ---------- Utilidades de animación ---------- */

  function esperar(ms) {
    return new Promise(function (r) { setTimeout(r, reducido ? Math.min(ms, 120) : ms); });
  }

  function animar(el, frames, opciones) {
    if (reducido || !el || !el.animate) return Promise.resolve();
    var a = el.animate(frames, opciones);
    return a.finished.catch(function () {});
  }

  function centro(el) {
    var caja = $("escenario").getBoundingClientRect();
    var r = el.getBoundingClientRect();
    return { x: r.left - caja.left + r.width / 2, y: r.top - caja.top + r.height / 2 };
  }

  function flotante(sobre, texto, clase) {
    var c = centro(sobre);
    var el = document.createElement("span");
    el.className = "flotante " + (clase || "");
    el.textContent = texto;
    el.style.left = c.x + "px";
    el.style.top = (c.y - 20) + "px";
    $("efectos").appendChild(el);
    animar(el, [
      { opacity: 0, transform: "translate(-50%, -30%) scale(0.7)" },
      { opacity: 1, transform: "translate(-50%, -60%) scale(1.1)", offset: 0.2 },
      { opacity: 0, transform: "translate(-50%, -180%) scale(1)" }
    ], { duration: 1100, easing: "ease-out" }).then(function () { el.remove(); });
    if (reducido) setTimeout(function () { el.remove(); }, 900);
  }

  function particulas(sobre, color, cantidad) {
    if (reducido) return;
    var c = centro(sobre);
    for (var i = 0; i < cantidad; i++) {
      var el = document.createElement("span");
      el.className = "particula";
      el.style.left = c.x + "px";
      el.style.top = c.y + "px";
      el.style.background = color;
      $("efectos").appendChild(el);
      var ang = (Math.PI * 2 * i) / cantidad + Math.random() * 0.5;
      var dist = 40 + Math.random() * 50;
      animar(el, [
        { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
        { transform: "translate(" + (Math.cos(ang) * dist - 4) + "px, " + (Math.sin(ang) * dist - 4) + "px) scale(0.3)", opacity: 0 }
      ], { duration: 600 + Math.random() * 300, easing: "cubic-bezier(.2,.7,.3,1)" }).then((function (p) {
        return function () { p.remove(); };
      })(el));
    }
  }

  function proyectil(desde, hasta, clase) {
    var a = centro(desde);
    var b = centro(hasta);
    var el = document.createElement("span");
    el.className = "proyectil " + (clase || "");
    el.innerHTML = D.estrella();
    $("efectos").appendChild(el);
    var tam = clase && clase.indexOf("critico") >= 0 ? 54 : 34;
    return animar(el, [
      { transform: "translate(" + (a.x - tam / 2) + "px," + (a.y - tam / 2) + "px) rotate(0deg) scale(0.6)" },
      { transform: "translate(" + ((a.x + b.x) / 2 - tam / 2) + "px," + (Math.min(a.y, b.y) - 50) + "px) rotate(200deg) scale(1)", offset: 0.5 },
      { transform: "translate(" + (b.x - tam / 2) + "px," + (b.y - tam / 2) + "px) rotate(400deg) scale(0.9)" }
    ], { duration: 420, easing: "ease-in" }).then(function () { el.remove(); });
  }

  function anunciar(texto) {
    var el = $("anuncio");
    el.textContent = texto;
    el.classList.remove("visible");
    void el.offsetWidth;
    el.classList.add("visible");
  }

  function color(nombre) {
    return getComputedStyle(document.documentElement).getPropertyValue(nombre).trim();
  }

  /* ---------- Sonido (Web Audio, se activa con el primer clic) ---------- */

  var audio = null;

  function tono(freq, inicio, dur, tipo, vol, freqFinal) {
    var t = audio.currentTime + inicio;
    var osc = audio.createOscillator();
    var gan = audio.createGain();
    osc.type = tipo || "triangle";
    osc.frequency.setValueAtTime(freq, t);
    if (freqFinal) osc.frequency.exponentialRampToValueAtTime(freqFinal, t + dur);
    gan.gain.setValueAtTime(0.0001, t);
    gan.gain.exponentialRampToValueAtTime(vol || 0.12, t + 0.015);
    gan.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gan).connect(audio.destination);
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  var SONIDOS = {
    acierto: function () { tono(523, 0, 0.12); tono(659, 0.09, 0.12); tono(784, 0.18, 0.2); },
    error: function () { tono(247, 0, 0.18, "sine"); tono(185, 0.15, 0.28, "sine"); },
    golpe: function () { tono(180, 0, 0.12, "square", 0.08, 70); },
    critico: function () { tono(300, 0, 0.18, "square", 0.09, 60); tono(900, 0, 0.12, "triangle", 0.06, 1400); },
    dolor: function () { tono(140, 0, 0.22, "sawtooth", 0.07, 60); },
    esquiva: function () { tono(700, 0, 0.16, "sine", 0.08, 1400); },
    victoria: function () { [523, 659, 784, 1047].forEach(function (f, i) { tono(f, i * 0.12, 0.25); }); },
    nivel: function () { [392, 523, 659, 784].forEach(function (f, i) { tono(f, i * 0.08, 0.16); }); },
    derrota: function () { [392, 330, 262, 196].forEach(function (f, i) { tono(f, i * 0.18, 0.3, "sine"); }); }
  };

  function sonar(nombre) {
    if (!sonidoActivo) return;
    try {
      if (!audio) {
        var Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return;
        audio = new Ctx();
      }
      if (audio.state === "suspended") audio.resume();
      SONIDOS[nombre]();
    } catch (e) { /* sin audio */ }
  }

  function pintarSonido() {
    var b = $("boton-sonido");
    b.setAttribute("aria-pressed", sonidoActivo ? "true" : "false");
    b.textContent = "Sonido: " + (sonidoActivo ? "sí" : "no");
  }

  $("boton-sonido").addEventListener("click", function () {
    sonidoActivo = !sonidoActivo;
    guardarPreferencia("lbg-sonido", sonidoActivo ? "si" : "no");
    pintarSonido();
    sonar("acierto");
  });

  /* ---------- Confeti ---------- */

  function confeti(cantidad, duracion) {
    if (reducido) return;
    var lienzo = $("confeti");
    var ctx = lienzo.getContext("2d");
    var dpr = window.devicePixelRatio || 1;
    lienzo.width = window.innerWidth * dpr;
    lienzo.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
    var colores = ["--tiza-amarilla", "--tiza-roja", "--tiza-azul", "--tiza-verde", "--tiza-morada", "--tiza-naranja"].map(color);
    var trozos = [];
    for (var i = 0; i < cantidad; i++) {
      trozos.push({
        x: Math.random() * window.innerWidth,
        y: -20 - Math.random() * window.innerHeight * 0.5,
        vx: (Math.random() - 0.5) * 2,
        vy: 2 + Math.random() * 3,
        giro: Math.random() * Math.PI,
        vgiro: (Math.random() - 0.5) * 0.2,
        tam: 6 + Math.random() * 6,
        color: colores[i % colores.length]
      });
    }
    var inicio = performance.now();
    function paso(ahora) {
      var t = ahora - inicio;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalAlpha = t > duracion - 600 ? Math.max(0, (duracion - t) / 600) : 1;
      trozos.forEach(function (c) {
        c.x += c.vx;
        c.y += c.vy;
        c.giro += c.vgiro;
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.giro);
        ctx.fillStyle = c.color;
        ctx.fillRect(-c.tam / 2, -c.tam / 4, c.tam, c.tam / 2);
        ctx.restore();
      });
      if (t < duracion) {
        requestAnimationFrame(paso);
      } else {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, lienzo.width, lienzo.height);
      }
    }
    requestAnimationFrame(paso);
  }

  /* ---------- Pantalla de inicio ---------- */

  function pintarDificultades() {
    var cont = $("dificultades");
    cont.innerHTML = "";
    Object.keys(LB.DIFICULTADES).forEach(function (clave) {
      var d = LB.DIFICULTADES[clave];
      var b = document.createElement("button");
      b.type = "button";
      b.className = "dificultad";
      b.setAttribute("role", "radio");
      b.setAttribute("aria-checked", clave === dificultad ? "true" : "false");
      b.innerHTML = "<b>" + d.nombre + "</b><span>" + d.edad + "</span>";
      b.addEventListener("click", function () {
        dificultad = clave;
        guardarPreferencia("lbg-dificultad", clave);
        pintarDificultades();
        cont.querySelector('[aria-checked="true"]').focus();
      });
      cont.appendChild(b);
    });
  }

  var MAXIMOS = { vida: 40, ataque: 20, velocidad: 22, esquiva: 22 };

  function crearCarta(clave) {
    var p = LB.PERSONAJES[clave];
    var carta = document.createElement("button");
    carta.type = "button";
    carta.className = "carta" + (p.secreto ? " secreta" : "");
    var filas = [["Vida", "vida"], ["Ataque", "ataque"], ["Velocidad", "velocidad"], ["Esquiva", "esquiva"]].map(function (f) {
      var ancho = Math.min(100, (p[f[1]] / MAXIMOS[f[1]]) * 100);
      return "<dt>" + f[0] + '</dt><dd class="mini-barra"><span style="width:' + ancho + '%"></span></dd><dd>' + p[f[1]] + "</dd>";
    }).join("");
    carta.innerHTML =
      '<div class="carta-cabecera">' + D.personaje(p.id) +
      '<div><p class="carta-nombre">' + p.nombre + "</p>" +
      '<p class="carta-lema">' + p.lema + "</p></div></div>" +
      '<dl class="mini-stats">' + filas + "</dl>";
    carta.setAttribute("aria-label", "Jugar como " + p.nombre + ". " + p.lema);
    carta.addEventListener("click", function () { empezar(clave); });
    return carta;
  }

  function pintarPersonajes() {
    var lista = $("lista-personajes");
    lista.innerHTML = "";
    ["1", "2", "3", "4"].forEach(function (clave) { lista.appendChild(crearCarta(clave)); });
  }

  $("form-adivinanza").addEventListener("submit", function (e) {
    e.preventDefault();
    var texto = $("respuesta-adivinanza").value;
    var clave = LB.seleccionar(texto);
    var msg = $("mensaje-adivinanza");
    msg.classList.remove("bien");
    if (clave) {
      var p = LB.PERSONAJES[clave];
      msg.classList.add("bien");
      msg.textContent = "¡Correcto! Desbloqueaste a " + p.nombre + ". Ya aparece con los demás personajes.";
      var lista = $("lista-personajes");
      var previa = lista.querySelector(".secreta");
      if (previa) previa.remove();
      var carta = crearCarta(clave);
      lista.appendChild(carta);
      sonar("nivel");
      carta.focus();
    } else if (texto.trim() === "") {
      msg.textContent = "Escribe una respuesta primero.";
    } else {
      msg.textContent = "Esa no es. ¡Piensa otra vez!";
      sonar("error");
    }
  });

  function mostrarPantalla(cual) {
    $("pantalla-inicio").hidden = cual !== "inicio";
    $("pantalla-batalla").hidden = cual !== "batalla";
    window.scrollTo(0, 0);
  }

  /* ---------- Batalla ---------- */

  function empezar(clave) {
    sonar("nivel");
    juego = new LB.Juego(clave, { dificultad: dificultad });
    ocupado = false;
    bossPintado = 0;
    $("registro").innerHTML = "";
    $("efectos").innerHTML = "";
    $("sprite-boss").style.opacity = "";
    $("sprite-jugador").innerHTML = D.personaje(juego.pj.id);
    $("nombre-jugador").textContent = juego.pj.nombre;
    anotar("Empiezas como " + juego.pj.nombre + " en modo " + LB.DIFICULTADES[dificultad].nombre + ".", "especial");
    mostrarPantalla("batalla");
    pintarEstado();
    pintarPregunta();
    anunciar("¡Aparece " + juego.bs.nombre + "!");
  }

  function pintarMapa() {
    var mapa = $("mapa");
    mapa.innerHTML = "";
    LB.BOSSES.forEach(function (b, i) {
      var nivel = i + 1;
      var li = document.createElement("li");
      var estado = nivel < juego.bs.nivel || juego.fin === "victoria" ? "vencido" : nivel === juego.bs.nivel ? "actual" : "";
      li.className = estado;
      li.innerHTML = D.boss(b.forma, b.corona);
      li.setAttribute("aria-label", "Nivel " + nivel + ": " + b.nombre + (estado === "vencido" ? ", vencido" : estado === "actual" ? ", ahora" : ""));
      mapa.appendChild(li);
    });
  }

  function pintarBossSprite() {
    var bs = juego.bs;
    $("sprite-boss").innerHTML = D.boss(bs.forma, bs.corona);
    $("nombre-boss").textContent = bs.nombre;
    bossPintado = bs.nivel;
    pintarMapa();
  }

  function pintarEstado() {
    var pj = juego.pj;
    var bs = juego.bs;
    if (bossPintado !== bs.nivel) pintarBossSprite();

    $("nivel-jugador").textContent = pj.nivel;
    pintarBarra("barra-vida-jugador", pj.vida, pj.vidaMax);
    $("vida-jugador").textContent = "Vida " + n(pj.vida) + " / " + n(pj.vidaMax);
    pintarBarra("barra-exp", juego.exp.actual, juego.exp.necesaria);
    $("exp-jugador").textContent = "EXP " + n(Math.max(0, juego.exp.actual)) + " / " + n(juego.exp.necesaria);

    $("nivel-boss").textContent = bs.nivel + " de " + LB.NIVEL_FINAL;
    pintarBarra("barra-vida-boss", bs.vida, bs.vidaMax);
    $("vida-boss").textContent = "Vida " + n(bs.vida) + " / " + n(bs.vidaMax);
    pintarRacha();
  }

  function pintarBarra(id, actual, maximo) {
    var barra = $(id);
    var pct = maximo > 0 ? Math.max(0, Math.min(1, actual / maximo)) : 0;
    barra.firstElementChild.style.width = (pct * 100) + "%";
    barra.setAttribute("aria-valuenow", Math.max(actual, 0));
    barra.setAttribute("aria-valuemax", maximo);
    if (barra.classList.contains("barra-vida")) {
      barra.classList.toggle("baja", pct <= 0.3);
      barra.classList.toggle("media", pct > 0.3 && pct <= 0.6);
    }
  }

  function pintarRacha() {
    var racha = juego.racha;
    var cont = $("racha");
    var llenas = Math.min(racha, LB.RACHA_CRITICO);
    var estrellas = "";
    for (var i = 0; i < LB.RACHA_CRITICO; i++) {
      estrellas += D.estrella(i < llenas ? "llena" : "");
    }
    var listo = racha >= LB.RACHA_CRITICO - 1;
    cont.classList.toggle("lista", listo);
    cont.innerHTML = '<span>' + (listo ? "¡Próximo acierto: crítico!" : "Racha") + "</span>" + estrellas;
  }

  function pintarAyuda(p) {
    var ayuda = $("ayuda");
    ayuda.innerHTML = "";
    if (p.tramo !== 1) return;
    function puntos(cuantos, tachados) {
      var html = '<span class="puntos">';
      for (var i = 0; i < cuantos; i++) {
        html += "<i" + (i >= cuantos - tachados ? ' class="tachado"' : "") + "></i>";
      }
      return html + "</span>";
    }
    if (p.clase === "suma") {
      ayuda.innerHTML = puntos(p.a, 0) + '<span class="signo">+</span>' + puntos(p.b, 0);
    } else if (p.clase === "resta") {
      ayuda.innerHTML = puntos(p.a, p.b);
    }
  }

  function pintarPregunta() {
    var p = juego.pregunta;
    var cont = $("opciones");
    cont.innerHTML = "";
    $("respuesta-mensaje").textContent = "";
    $("respuesta-mensaje").className = "respuesta-mensaje";
    if (!p) {
      $("operacion").textContent = "";
      $("tipo-pregunta").textContent = "";
      $("ayuda").innerHTML = "";
      return;
    }
    $("tipo-pregunta").textContent = p.tipo;
    var op = $("operacion");
    op.innerHTML = p.a + " " + p.simbolo + " " + p.b + ' <span class="igual">=</span> <span class="hueco">?</span>';
    op.setAttribute("aria-label", "¿Cuánto es " + p.a + " " + ({ "+": "más", "−": "menos", "×": "por", "÷": "entre" })[p.simbolo] + " " + p.b + "?");
    op.classList.remove("nueva");
    void op.offsetWidth;
    op.classList.add("nueva");
    pintarAyuda(p);
    p.opciones.forEach(function (valor, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "opcion";
      b.dataset.valor = valor;
      b.innerHTML = '<span class="tecla">' + (i + 1) + "</span>" + valor;
      b.setAttribute("aria-label", "Responder " + valor);
      b.addEventListener("click", function () { responder(valor, b); });
      cont.appendChild(b);
    });
  }

  function anotar(texto, clase) {
    var li = document.createElement("li");
    li.textContent = texto;
    if (clase) li.className = clase;
    var lista = $("registro");
    lista.appendChild(li);
    lista.scrollTop = lista.scrollHeight;
  }

  var ELOGIOS = ["¡Muy bien!", "¡Genial!", "¡Correcto!", "¡Eso es!", "¡Excelente!", "¡Bravo!"];

  async function responder(valor, boton) {
    if (ocupado || !juego || juego.fin || juego.puntosPendientes > 0) return;
    ocupado = true;
    var pregunta = juego.pregunta;
    var acierto = valor === pregunta.respuesta;
    $("opciones").querySelectorAll(".opcion").forEach(function (b) {
      b.disabled = true;
      if (Number(b.dataset.valor) === pregunta.respuesta) b.classList.add("correcta");
    });
    var msg = $("respuesta-mensaje");
    $("operacion").querySelector(".hueco").textContent = pregunta.respuesta;
    if (acierto) {
      msg.textContent = ELOGIOS[Math.floor(Math.random() * ELOGIOS.length)];
      msg.className = "respuesta-mensaje bien";
      sonar("acierto");
    } else {
      boton.classList.add("incorrecta");
      msg.textContent = "Casi. La respuesta era " + pregunta.respuesta + ". ¡Tú puedes!";
      msg.className = "respuesta-mensaje mal";
      sonar("error");
    }

    var resultado = juego.responder(valor);
    anotar("Pregunta " + juego.turno + ": " + pregunta.a + " " + pregunta.simbolo + " " + pregunta.b + " = " + pregunta.respuesta + (acierto ? " (acertaste)" : " (respondiste " + valor + ")"), "turno");

    for (var i = 0; i < resultado.eventos.length; i++) {
      await mostrarEvento(resultado.eventos[i]);
    }

    pintarEstado();
    if (resultado.fin) {
      mostrarFin(resultado.fin);
    } else if (juego.puntosPendientes > 0) {
      mostrarSubida();
    } else {
      await esperar(350);
      pintarPregunta();
    }
    ocupado = false;
  }

  async function mostrarEvento(ev) {
    var spriteJ = $("sprite-jugador");
    var spriteB = $("sprite-boss");
    switch (ev.tipo) {
      case "acierto":
      case "error":
        await esperar(500);
        return;

      case "golpeJugador":
        animar(spriteJ, [{ transform: "none" }, { transform: "translateX(18%) rotate(4deg)" }, { transform: "none" }], { duration: 380 });
        await proyectil(spriteJ, spriteB, ev.critico ? "critico" : "");
        sonar(ev.critico ? "critico" : "golpe");
        animar(spriteB, [
          { transform: "none", filter: "none" },
          { transform: "translateX(10px) rotate(4deg)", filter: "brightness(1.8)" },
          { transform: "translateX(-8px) rotate(-3deg)" },
          { transform: "none", filter: "none" }
        ], { duration: 380 });
        particulas(spriteB, color(ev.critico ? "--tiza-naranja" : "--tiza-amarilla"), ev.critico ? 14 : 8);
        flotante(spriteB, (ev.critico ? "¡Crítico! " : "") + "−" + n(ev.danio), ev.critico ? "critico" : "");
        anotar(ev.texto, "bueno");
        pintarEstado();
        await esperar(450);
        return;

      case "bossEsquiva":
        animar(spriteB, [{ transform: "none" }, { transform: "translateX(26%) skewX(8deg)", offset: 0.4 }, { transform: "none" }], { duration: 650 });
        await proyectil(spriteJ, spriteB, "");
        sonar("esquiva");
        flotante(spriteB, "¡Esquivó!", "esquiva");
        anotar(ev.texto, "malo");
        await esperar(450);
        return;

      case "golpeBoss":
        animar(spriteB, [{ transform: "none" }, { transform: "translateX(-18%) rotate(-5deg)" }, { transform: "none" }], { duration: 380 });
        await proyectil(spriteB, spriteJ, "enemigo");
        sonar("dolor");
        animar(spriteJ, [
          { transform: "none" },
          { transform: "translateX(-10px) rotate(-4deg)" },
          { transform: "translateX(8px) rotate(3deg)" },
          { transform: "none" }
        ], { duration: 380 });
        var esc = $("escenario");
        esc.classList.remove("dolor");
        void esc.offsetWidth;
        esc.classList.add("dolor");
        particulas(spriteJ, color("--tiza-roja"), 8);
        flotante(spriteJ, "−" + n(ev.danio), "");
        anotar(ev.texto, "malo");
        pintarEstado();
        await esperar(450);
        return;

      case "jugadorEsquiva":
        animar(spriteJ, [{ transform: "none" }, { transform: "translateX(-26%) skewX(-8deg)", offset: 0.4 }, { transform: "none" }], { duration: 650 });
        await proyectil(spriteB, spriteJ, "enemigo");
        sonar("esquiva");
        flotante(spriteJ, "¡Esquivaste!", "esquiva");
        anotar(ev.texto, "bueno");
        await esperar(450);
        return;

      case "bossDerrotado":
        sonar("victoria");
        particulas(spriteB, color("--tiza"), 18);
        anunciar("¡Venciste a " + ev.nombre + "!");
        anotar(ev.texto, "especial");
        confeti(70, 1800);
        await animar(spriteB, [
          { transform: "none", opacity: 1 },
          { transform: "translateY(8%) rotate(-12deg) scale(0.9)", opacity: 0.8, offset: 0.3 },
          { transform: "translateY(30%) rotate(-30deg) scale(0.4)", opacity: 0 }
        ], { duration: 900, easing: "ease-in" });
        spriteB.style.opacity = "0";
        await esperar(700);
        return;

      case "nuevoBoss":
        pintarEstado();
        var nuevo = $("sprite-boss");
        nuevo.style.opacity = "";
        animar(nuevo, [
          { transform: "translateX(120%)", opacity: 0 },
          { transform: "translateX(-6%)", opacity: 1, offset: 0.7 },
          { transform: "none", opacity: 1 }
        ], { duration: 700, easing: "ease-out" });
        anunciar("¡Aparece " + ev.nombre + "!");
        if (ev.curado > 0) flotante(spriteJ, "+" + n(ev.curado), "cura");
        anotar(ev.texto, "especial");
        await esperar(1300);
        return;

      case "subeNivel":
        sonar("nivel");
        anunciar("¡Nivel " + ev.nivel + "!");
        anotar(ev.texto, "especial");
        pintarEstado();
        await esperar(900);
        return;
    }
  }

  /* ---------- Subida de nivel ---------- */

  var MEJORAS = [
    { stat: "vida", nombre: "Vida", ayuda: "Aguantas más golpes", valor: function (pj) { return pj.vidaMax; }, suma: LB.VIDA_POR_PUNTO },
    { stat: "ataque", nombre: "Ataque", ayuda: "Quitas más vida", valor: function (pj) { return pj.ataque; }, suma: 1 },
    { stat: "velocidad", nombre: "Velocidad", ayuda: "Más golpes dobles", valor: function (pj) { return pj.velocidad; }, suma: 1 },
    { stat: "esquiva", nombre: "Esquiva", ayuda: "Evitas más golpes", valor: function (pj) { return pj.esquiva; }, suma: 1 }
  ];

  function mostrarSubida() {
    pintarMejoras();
    $("capa-nivel").hidden = false;
    $("mejoras").querySelector(".mejora").focus();
  }

  function pintarMejoras() {
    var pj = juego.pj;
    var pts = juego.puntosPendientes;
    $("puntos-restantes").textContent = pts + (pts === 1 ? " punto" : " puntos");
    var cont = $("mejoras");
    cont.innerHTML = "";
    MEJORAS.forEach(function (m) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "mejora";
      b.innerHTML = "<b>" + m.nombre + "</b><span>" + n(m.valor(pj)) + " → " + n(m.valor(pj) + m.suma) + "</span><small>" + m.ayuda + "</small>";
      b.addEventListener("click", function () { elegirMejora(m); });
      cont.appendChild(b);
    });
  }

  function elegirMejora(m) {
    juego.asignarPunto(m.stat);
    sonar("acierto");
    anotar("+" + m.suma + " a " + m.nombre + ".", "bueno");
    pintarEstado();
    if (juego.puntosPendientes > 0) {
      pintarMejoras();
      $("mejoras").querySelector(".mejora").focus();
      return;
    }
    $("capa-nivel").hidden = true;
    pintarPregunta();
  }

  /* ---------- Fin de partida ---------- */

  function mostrarFin(fin) {
    var victoria = fin === "victoria";
    var vencidos = victoria ? LB.NIVEL_FINAL : juego.bs.nivel - 1;
    $("sprite-fin").innerHTML = D.personaje(juego.pj.id);
    $("sprite-fin").classList.toggle("triste", !victoria);
    if (victoria) {
      $("titulo-fin").textContent = "¡Venciste a todos los bosses!";
      $("texto-fin").textContent = juego.pj.nombre + " derrotó al " + juego.bs.nombre + ". ¡Eres un campeón de las matemáticas!";
      sonar("victoria");
      confeti(180, 3500);
    } else {
      $("titulo-fin").textContent = "¡Buen intento!";
      $("texto-fin").textContent = juego.bs.nombre + " te ganó esta vez. Practica un poco y vuelve a intentarlo.";
      sonar("derrota");
    }
    $("resumen").innerHTML =
      "<div><dt>Bosses vencidos</dt><dd>" + vencidos + "</dd></div>" +
      "<div><dt>Aciertos</dt><dd>" + juego.aciertos + "/" + juego.turno + "</dd></div>" +
      "<div><dt>Mejor racha</dt><dd>" + juego.mejorRacha + "</dd></div>";
    anotar($("titulo-fin").textContent, victoria ? "especial" : "malo");
    pintarMapa();
    pintarPregunta();
    $("capa-fin").hidden = false;
    $("boton-reiniciar").focus();
  }

  function volverAlInicio() {
    $("capa-fin").hidden = true;
    $("capa-rendirse").hidden = true;
    $("capa-nivel").hidden = true;
    juego = null;
    mostrarPantalla("inicio");
  }

  $("boton-reiniciar").addEventListener("click", volverAlInicio);
  $("boton-rendirse").addEventListener("click", function () {
    $("capa-rendirse").hidden = false;
    $("boton-seguir").focus();
  });
  $("boton-seguir").addEventListener("click", function () { $("capa-rendirse").hidden = true; });
  $("boton-confirmar-rendirse").addEventListener("click", volverAlInicio);

  /* ---------- Teclado ---------- */

  document.addEventListener("keydown", function (e) {
    if (!juego || $("pantalla-batalla").hidden) return;
    if (!$("capa-nivel").hidden || !$("capa-fin").hidden || !$("capa-rendirse").hidden) {
      if (e.key === "Escape" && !$("capa-rendirse").hidden) $("capa-rendirse").hidden = true;
      return;
    }
    var i = parseInt(e.key, 10);
    if (i >= 1 && i <= 4) {
      var b = $("opciones").querySelectorAll(".opcion")[i - 1];
      if (b && !b.disabled) b.click();
    }
  });

  pintarSonido();
  pintarDificultades();
  pintarPersonajes();
})();
