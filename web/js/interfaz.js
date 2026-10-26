/*
 * Logic Boss Game - interfaz gráfica.
 *
 * Toda la mecánica vive en logica.js; este archivo solo dibuja el estado,
 * recoge las respuestas del jugador y anima los eventos de cada turno.
 */
(function () {
  "use strict";

  var LB = window.LogicBoss;
  var juego = null;
  var ocupado = false;

  var $ = function (id) { return document.getElementById(id); };

  /* ---------- Dibujos con tiza (SVG, viewBox 100x100) ---------- */

  var CARA = '<circle class="trazo" cx="50" cy="40" r="16"/>' +
    '<path class="trazo fino" d="M43 38h2M55 38h2M45 47q5 3 10 0"/>';
  var CUERPO = '<path class="trazo" d="M30 92q2-30 20-32q18 2 20 32"/>';

  var DIBUJOS = {
    paladin:
      CUERPO +
      '<path class="trazo" d="M33 40q0-22 17-22t17 22v6H33z"/>' +
      '<path class="trazo fino" d="M40 34h20M50 26v8"/>' +
      '<path class="trazo acento" d="M66 58h22v14q0 12-11 18q-11-6-11-18z"/>' +
      '<path class="trazo acento" d="M77 63v20M70 71h14"/>',
    asesino:
      CUERPO +
      '<path class="trazo" d="M30 50q0-34 20-34t20 34q-6-8-20-8t-20 8z"/>' +
      '<path class="trazo fino" d="M42 40h5M53 40h5"/>' +
      '<path class="trazo acento" d="M78 50l8-14l2 2l-6 16M76 52l10 4M80 54l-4 12"/>',
    mago:
      CUERPO + CARA +
      '<path class="trazo acento" d="M28 28h44M34 28l16-24l16 24"/>' +
      '<path class="trazo acento fino" d="M50 12l1.5 3.5l3.5.5l-2.5 2.5l.5 3.5l-3-1.8l-3 1.8l.5-3.5l-2.5-2.5l3.5-.5z"/>' +
      '<path class="trazo" d="M84 30v62"/><circle class="trazo acento" cx="84" cy="24" r="6"/>',
    arquero:
      CUERPO + CARA +
      '<path class="trazo fino" d="M34 34q16-14 32 0"/>' +
      '<path class="trazo acento" d="M80 22q18 30 0 62"/><path class="trazo fino" d="M80 22v62"/>' +
      '<path class="trazo" d="M62 53h30M86 49l6 4l-6 4"/>',
    saitama:
      '<path class="trazo acento" d="M24 94q4-36 26-36q22 0 26 36"/>' +
      '<path class="trazo" d="M34 94q2-28 16-30q14 2 16 30"/>' +
      '<ellipse class="trazo" cx="50" cy="38" rx="17" ry="20"/>' +
      '<path class="trazo fino" d="M42 37h5M53 37h5M47 49h6M33 40q-3 0-3 4M67 40q3 0 3 4"/>',
    messi:
      CUERPO + CARA +
      '<path class="trazo fino" d="M34 34q4-14 16-14t16 14q-6-6-16-6t-16 6"/>' +
      '<text class="numero-camiseta" x="50" y="86" text-anchor="middle">10</text>' +
      '<circle class="trazo acento" cx="84" cy="80" r="11"/>' +
      '<path class="trazo acento fino" d="M84 74l5 4l-2 6h-6l-2-6zM84 69v5M89 78l6-2M87 84l3 5M81 84l-3 5M79 78l-6-2"/>'
  };

  function dibujoBoss(nivel) {
    var cuernos = Math.min(1 + Math.floor((nivel - 1) / 6), 4);
    var trazos = '';
    for (var i = 0; i < cuernos; i++) {
      var dx = 4 + i * 6;
      var alto = 22 + i * 5;
      trazos += '<path class="trazo boss-trazo" d="M' + (34 - dx) + ' ' + (36 - i * 2) + 'q-' + (10 + i * 2) + ' -' + alto + ' ' + (2 + i) + ' -' + (alto + 8) + '"/>';
      trazos += '<path class="trazo boss-trazo" d="M' + (66 + dx) + ' ' + (36 - i * 2) + 'q' + (10 + i * 2) + ' -' + alto + ' -' + (2 + i) + ' -' + (alto + 8) + '"/>';
    }
    return trazos +
      '<path class="trazo boss-trazo" d="M24 46q0-28 26-28t26 28q0 18-10 26l-4 10h-24l-4-10q-10-8-10-26z"/>' +
      '<path class="trazo acento" d="M34 44l12 4l-12 4zM66 44l-12 4l12 4z"/>' +
      '<path class="trazo fino" d="M40 68l5-5l5 5l5-5l5 5"/>' +
      '<path class="trazo" d="M18 98q6-18 32-16q26-2 32 16"/>';
  }

  function svg(contenido) {
    return '<svg viewBox="0 0 100 100" aria-hidden="true">' + contenido + '</svg>';
  }

  /* ---------- Utilidades ---------- */

  var NUM = new Intl.NumberFormat("es");
  function n(x) { return NUM.format(x); }

  function esperar(ms) {
    var reducido = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return new Promise(function (r) { setTimeout(r, reducido ? Math.min(ms, 150) : ms); });
  }

  function animar(el, clase) {
    el.classList.remove(clase);
    void el.offsetWidth;
    el.classList.add(clase);
    setTimeout(function () { el.classList.remove(clase); }, 600);
  }

  function flotante(id, texto, clase) {
    var capa = $(id);
    var el = document.createElement("span");
    el.className = "flotante " + clase;
    el.textContent = texto;
    capa.appendChild(el);
    setTimeout(function () { el.remove(); }, 1200);
  }

  function mostrarPantalla(cual) {
    $("pantalla-inicio").hidden = cual !== "inicio";
    $("pantalla-batalla").hidden = cual !== "batalla";
    window.scrollTo(0, 0);
  }

  /* ---------- Selección de personaje ---------- */

  var MAX_STAT_CARTA = 14;

  function pintarPersonajes() {
    var lista = $("lista-personajes");
    lista.innerHTML = "";
    ["1", "2", "3", "4"].forEach(function (clave) {
      lista.appendChild(crearCarta(clave));
    });
  }

  function crearCarta(clave) {
    var p = LB.PERSONAJES[clave];
    var carta = document.createElement("button");
    carta.type = "button";
    carta.className = "carta" + (p.secreto ? " secreta" : "");
    carta.dataset.clave = clave;
    var filas = [["Vida", p.vida], ["Ataque", p.ataque], ["Velocidad", p.velocidad], ["Esquiva", p.esquiva]].map(function (f) {
      var ancho = Math.min(100, (f[1] / MAX_STAT_CARTA) * 100);
      return "<dt>" + f[0] + '</dt><dd class="mini-barra"><span style="width:' + ancho + '%"></span></dd><dd>' + n(f[1]) + "</dd>";
    }).join("");
    carta.innerHTML =
      '<div class="retrato">' + svg(DIBUJOS[p.id]) + "</div>" +
      '<div><p class="carta-nombre">' + p.nombre + (p.secreto ? " ★" : "") + "</p>" +
      '<dl class="mini-stats">' + filas + "</dl></div>";
    carta.setAttribute("aria-label", "Jugar como " + p.nombre);
    carta.addEventListener("click", function () { empezar(clave); });
    return carta;
  }

  $("form-adivinanza").addEventListener("submit", function (e) {
    e.preventDefault();
    var texto = $("respuesta-adivinanza").value;
    var clave = LB.seleccionar(texto);
    var msg = $("mensaje-adivinanza");
    if (clave === "777" || clave === "888") {
      var p = LB.PERSONAJES[clave];
      msg.style.color = "var(--tiza-amarilla)";
      msg.textContent = "¡Correcto! Desbloqueaste a " + p.nombre + ".";
      var lista = $("lista-personajes");
      var previa = lista.querySelector(".secreta");
      if (previa) previa.remove();
      var carta = crearCarta(clave);
      lista.appendChild(carta);
      carta.focus();
    } else if (texto.trim() === "") {
      msg.style.color = "";
      msg.textContent = "Escribe una respuesta primero.";
    } else {
      msg.style.color = "";
      msg.textContent = "Esa no es. Inténtalo otra vez.";
    }
  });

  /* ---------- Batalla ---------- */

  function empezar(clave) {
    juego = new LB.Juego(clave);
    ocupado = false;
    $("registro").innerHTML = "";
    $("retrato-jugador").innerHTML = svg(DIBUJOS[juego.pj.id]);
    $("nombre-jugador").textContent = juego.pj.nombre;
    anotar("¡Felicidades, ahora eres " + (juego.pj.secreto ? "" : "un ") + juego.pj.nombre + "!", "especial");
    pintarEstado();
    pintarPregunta();
    mostrarPantalla("batalla");
  }

  function pintarEstado() {
    var pj = juego.pj;
    var bs = juego.bs;
    var ap = juego.ap;

    $("nivel-jugador").textContent = pj.nivelPj;
    pintarBarra("barra-vida-jugador", pj.estVIDA, pj.vida);
    $("vida-jugador").textContent = "Vida " + n(Math.max(pj.estVIDA, 0)) + " / " + n(pj.vida);
    pintarBarra("barra-exp", ap.estExp, ap.expTotal);
    $("exp-actual").textContent = n(ap.estExp);
    $("exp-faltante").textContent = n(Math.max(ap.faltante(), 0));
    pintarStats("stats-jugador", [["Ataque", pj.estATAQUE], ["Velocidad", pj.estVELOCIDAD], ["Esquiva", pj.estESQUIVA]]);

    $("nivel-boss").textContent = bs.nivelBoss;
    $("retrato-boss").innerHTML = svg(dibujoBoss(bs.nivelBoss));
    pintarBarra("barra-vida-boss", bs.esTvidaBoss, bs.vidaBoss);
    $("vida-boss").textContent = "Vida " + n(Math.max(bs.esTvidaBoss, 0)) + " / " + n(bs.vidaBoss);
    pintarStats("stats-boss", [["Ataque", bs.esTataqueBoss], ["Velocidad", bs.esTvelocidadBoss], ["Esquiva", bs.esTesquivaBoss]]);
  }

  function pintarBarra(id, actual, maximo) {
    var barra = $(id);
    var pct = maximo > 0 ? Math.max(0, Math.min(1, actual / maximo)) : 0;
    barra.firstElementChild.style.width = (pct * 100) + "%";
    barra.setAttribute("aria-valuenow", Math.max(actual, 0));
    barra.setAttribute("aria-valuemax", maximo);
    if (barra.classList.contains("barra-vida")) {
      barra.classList.toggle("baja", pct <= 0.3);
    }
  }

  function pintarStats(id, filas) {
    $(id).innerHTML = filas.map(function (f) {
      return "<dt>" + f[0] + "</dt><dd>" + n(f[1]) + "</dd>";
    }).join("");
  }

  function pintarPregunta() {
    var p = juego.pregunta;
    var cont = $("opciones");
    cont.innerHTML = "";
    if (!p) {
      $("operacion").textContent = "";
      $("tipo-pregunta").textContent = "";
      return;
    }
    $("tipo-pregunta").textContent = p.tipo;
    if (p.simbolo === "^") {
      $("operacion").innerHTML = p.a + "<sup>" + p.b + "</sup>";
    } else {
      $("operacion").textContent = p.a + " " + p.simbolo + " " + p.b;
    }
    // En consola una misma cifra podía imprimirse dos veces; aquí sale un solo botón.
    var vistas = [];
    p.opciones.forEach(function (v) {
      if (vistas.indexOf(v) === -1) vistas.push(v);
    });
    vistas.forEach(function (valor, i) {
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

  async function responder(valor, boton) {
    if (ocupado || !juego || juego.fin || juego.puntosPendientes > 0) return;
    ocupado = true;
    var pregunta = juego.pregunta;
    var botones = $("opciones").querySelectorAll(".opcion");
    botones.forEach(function (b) {
      b.disabled = true;
      if (Number(b.dataset.valor) === pregunta.respuesta) b.classList.add("correcta");
    });
    if (valor !== pregunta.respuesta) boton.classList.add("incorrecta");

    var operacion = pregunta.simbolo === "^" ? pregunta.a + "^" + pregunta.b : pregunta.a + " " + pregunta.simbolo + " " + pregunta.b;
    var resultado = juego.responder(valor);

    anotar("Turno " + juego.turno + ": " + operacion + " = " + pregunta.respuesta + (valor === pregunta.respuesta ? " (acertaste)" : " (respondiste " + valor + ")"), "turno");

    for (var i = 0; i < resultado.eventos.length; i++) {
      await mostrarEvento(resultado.eventos[i]);
    }

    if (resultado.fin) {
      pintarEstado();
      mostrarFin(resultado.fin);
    } else if (juego.puntosPendientes > 0) {
      pintarEstado();
      mostrarSubida();
    } else {
      await esperar(250);
      pintarEstado();
      pintarPregunta();
    }
    ocupado = false;
  }

  async function mostrarEvento(ev) {
    var fichaJ = $("ficha-jugador");
    var fichaB = $("ficha-boss");
    switch (ev.tipo) {
      case "acierto":
      case "error":
        await esperar(450);
        return;
      case "golpeJugador":
        animar(fichaB, "golpeado");
        flotante("flotantes-boss", "−" + n(ev.danio), "danio");
        anotar(ev.texto, "bueno");
        break;
      case "bossEsquiva":
        animar(fichaB, "esquivo");
        flotante("flotantes-boss", "¡esquiva!", "esquiva");
        anotar(ev.texto, "malo");
        break;
      case "golpeBoss":
        animar(fichaJ, "golpeado");
        flotante("flotantes-jugador", "−" + n(ev.danio), "danio");
        anotar(ev.texto, "malo");
        break;
      case "jugadorEsquiva":
        animar(fichaJ, "esquivo");
        flotante("flotantes-jugador", "¡esquiva!", "esquiva");
        anotar(ev.texto, "bueno");
        break;
      case "bossEvoluciona":
        flotante("flotantes-boss", "¡evoluciona!", "evoluciona");
        anotar(ev.texto, "especial");
        break;
      case "bossDerrotado":
        flotante("flotantes-boss", "¡derrotado!", "evoluciona");
        anotar(ev.texto, "especial");
        break;
      case "subeNivel":
        anotar(ev.texto, "especial");
        break;
    }
    pintarEstadoParcial(ev);
    await esperar(650);
  }

  // Muestra el daño en las barras a medida que ocurre cada golpe.
  function pintarEstadoParcial(ev) {
    if (ev.tipo === "golpeJugador" || ev.tipo === "golpeBoss" || ev.tipo === "bossDerrotado" || ev.tipo === "bossEvoluciona") {
      pintarEstado();
    }
  }

  /* ---------- Subida de nivel ---------- */

  var MEJORAS = [
    { stat: "vida", nombre: "Vida", valor: function (pj) { return pj.vida; } },
    { stat: "ataque", nombre: "Ataque", valor: function (pj) { return pj.ataque; } },
    { stat: "velocidad", nombre: "Velocidad", valor: function (pj) { return pj.velocidad; } },
    { stat: "esquiva", nombre: "Esquiva", valor: function (pj) { return pj.esquiva; } }
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
    $("mejoras").innerHTML = "";
    MEJORAS.forEach(function (m) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "mejora";
      b.innerHTML = "<b>" + m.nombre + "</b><span>" + n(m.valor(pj)) + " → " + n(m.valor(pj) + 1) + "</span>";
      b.addEventListener("click", function () { elegirMejora(m); });
      $("mejoras").appendChild(b);
    });
  }

  function elegirMejora(m) {
    juego.asignarPunto(m.stat);
    anotar("+1 a " + m.nombre + (m.stat === "vida" ? " (vida restaurada)" : "") + ".", "bueno");
    pintarEstado();
    if (juego.puntosPendientes > 0) {
      pintarMejoras();
      $("mejoras").querySelector(".mejora").focus();
      return;
    }
    $("capa-nivel").hidden = true;
    if (juego.fin) {
      mostrarFin(juego.fin);
    } else {
      pintarPregunta();
    }
  }

  /* ---------- Fin de partida ---------- */

  function mostrarFin(fin) {
    var nivel = juego.bs.nivelBoss;
    var titulo, texto;
    if (fin === "victoria") {
      titulo = "¡Has vencido a todos los bosses!";
      texto = "Llegaste al boss de nivel " + nivel + " con " + juego.pj.nombre + " en nivel " + juego.pj.nivelPj + ".";
    } else if (fin === "fracaso") {
      titulo = "El boss llegó a su nivel máximo";
      texto = "El boss alcanzó el nivel " + nivel + " antes de que " + juego.pj.nombre + " pasara del nivel 4. Has fracasado.";
    } else {
      titulo = "Has perdido";
      texto = "El boss de nivel " + nivel + " te ha derrotado. Respondiste " + juego.turno + " preguntas.";
    }
    anotar(titulo, fin === "victoria" ? "especial" : "malo");
    $("titulo-fin").textContent = titulo;
    $("texto-fin").textContent = texto;
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

  pintarPersonajes();
})();
