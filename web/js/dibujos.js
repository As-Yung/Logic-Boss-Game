/*
 * Logic Boss Game - dibujos con tiza.
 *
 * Cada dibujo es un SVG de 120x120. Las clases c-* dan el color de la tiza
 * (trazo y relleno suave) y están definidas en estilos.css.
 */
(function (global) {
  "use strict";

  function g(clase, contenido) {
    return '<g class="' + clase + '">' + contenido + "</g>";
  }

  function p(d) {
    return '<path d="' + d + '"/>';
  }

  function circulo(cx, cy, r) {
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '"/>';
  }

  /* ---------- Personajes (miran a la derecha) ---------- */

  var PERSONAJES = {
    paladin:
      g("c-blanca sin-relleno", p("M50 112v-12M66 112v-12")) +
      g("c-azul", p("M40 100q0-32 18-34q18 2 18 34z")) +
      g("c-blanca", p("M42 54q0-24 16-24t16 24v8H42z")) +
      g("c-blanca sin-relleno fino", p("M48 50h20M58 42v8")) +
      g("c-roja", p("M58 30q-4-16 12-20q-4 10-8 20z")) +
      g("c-blanca sin-relleno", p("M80 92l20-44")) +
      g("c-amarilla sin-relleno", p("M74 86l12 8")) +
      g("c-amarilla", p("M24 70h24v16q0 14-12 20q-12-6-12-20z")) +
      g("c-blanca sin-relleno fino", p("M36 74v26M28 85h16")),
    asesino:
      g("c-morada", p("M38 112q2-46 20-48q18 2 20 48z")) +
      g("c-morada", p("M36 64q0-42 22-42t22 42q-8-10-22-10t-22 10z")) +
      g("c-blanca sin-relleno fino", p("M44 60h28")) +
      g("c-amarilla lleno", circulo(51, 54, 2.6) + circulo(65, 54, 2.6)) +
      g("c-blanca sin-relleno", p("M84 82l16-22M30 86l-12-18")) +
      g("c-amarilla sin-relleno", p("M80 82l8 6M34 86l-8 4")),
    mago:
      g("c-azul", p("M36 112q4-46 22-48q18 2 22 48z")) +
      g("c-blanca", circulo(58, 54, 12)) +
      g("c-blanca lleno", circulo(54, 52, 1.6) + circulo(63, 52, 1.6)) +
      g("c-blanca", p("M47 60q11 26 22 0q-11 6-22 0z")) +
      g("c-morada", p("M32 46h52M42 46l18-38l16 38z")) +
      g("c-amarilla lleno", p("M60 26l2 4l4 1l-3 3l1 4l-4-2l-4 2l1-4l-3-3l4-1z")) +
      g("c-naranja sin-relleno", p("M94 112V42")) +
      g("c-amarilla", circulo(94, 34, 7)) +
      g("c-amarilla sin-relleno fino brillo", p("M94 20v-6M106 34h6M103 23l4-4M85 23l-4-4")),
    arquero:
      g("c-naranja", p("M30 66h10v30H30z")) +
      g("c-verde", p("M40 112q2-44 18-46q16 2 18 46z")) +
      g("c-blanca", circulo(58, 52, 12)) +
      g("c-blanca lleno", circulo(55, 51, 1.6) + circulo(64, 51, 1.6)) +
      g("c-verde", p("M44 48q14-22 30-4z")) +
      g("c-roja", p("M70 40q10-16 18-12q-8 2-18 12z")) +
      g("c-naranja sin-relleno", p("M92 34q22 34 0 68")) +
      g("c-blanca sin-relleno fino", p("M92 34v68")) +
      g("c-blanca sin-relleno", p("M66 68h36M98 64l6 4l-6 4")),
    saitama:
      g("c-roja", p("M32 112q4-46 26-50q22 4 26 50z")) +
      g("c-amarilla", p("M42 112q2-38 16-40q14 2 16 40z")) +
      g("c-blanca sin-relleno", p("M44 96h28")) +
      g("c-blanca", '<ellipse cx="58" cy="46" rx="14" ry="17"/>') +
      g("c-blanca sin-relleno fino", p("M50 45h5M61 45h5M55 55h6")) +
      g("c-roja", circulo(40, 92, 6) + circulo(84, 76, 7)),
    messi:
      g("c-azul", p("M38 112q2-42 20-44q18 2 20 44z")) +
      g("c-blanca sin-relleno fino", p("M48 78v34M58 72v40M68 78v34")) +
      '<text class="dorsal" x="58" y="100" text-anchor="middle">10</text>' +
      g("c-blanca", circulo(58, 50, 13)) +
      g("c-blanca lleno", circulo(54, 49, 1.6) + circulo(63, 49, 1.6)) +
      g("c-naranja", p("M45 46q2-18 27-10q-8-4-27 10zM48 56q10 14 20 0q-10 4-20 0z")) +
      g("c-blanca", circulo(94, 102, 9)) +
      g("c-blanca sin-relleno fino", p("M94 97l4 3l-1.5 4.5h-5L90 100z"))
  };

  /* ---------- Bosses (miran a la izquierda) ---------- */

  var FORMAS = {
    blob:
      function (c) {
        return g(c, p("M12 110q-4-62 48-66q52 4 48 66q-8-6-14 0q-6-8-14 0q-6-6-14 0q-6-8-14 0q-6-6-14 0q-6-8-14 0q-6-6-12 0z")) +
          g("c-blanca", circulo(44, 74, 9) + circulo(74, 74, 9)) +
          g("pupila", circulo(41, 75, 4) + circulo(71, 75, 4)) +
          g("c-blanca sin-relleno", p("M46 94q14 10 28 0"));
      },
    robot:
      function (c) {
        return g("c-amarilla sin-relleno", p("M60 20V10")) + g("c-amarilla lleno", circulo(60, 8, 4)) +
          g(c, '<rect x="30" y="20" width="60" height="40" rx="7"/>') +
          g("c-roja lleno", '<rect x="38" y="32" width="14" height="10" rx="2"/><rect x="66" y="32" width="14" height="10" rx="2"/>') +
          g("c-blanca sin-relleno fino", p("M44 50h32M50 46v8M60 46v8M70 46v8")) +
          g(c, '<rect x="26" y="64" width="68" height="44" rx="6"/>') +
          g("c-amarilla lleno", circulo(44, 80, 3) + circulo(56, 80, 3)) +
          g("c-blanca sin-relleno", p("M26 76l-16 18M94 76l16 18M40 108v8M80 108v8")) +
          g("c-blanca sin-relleno fino", p("M66 78h20M66 86h20M66 94h20"));
      },
    murcielago:
      function (c) {
        return g(c, p("M50 62q-26-34-48-12q10 2 12 14q8-6 14 2q8-6 14 4zM70 62q26-34 48-12q-10 2-12 14q-8-6-14 2q-8-6-14 4z")) +
          g(c, '<ellipse cx="60" cy="72" rx="17" ry="24"/>') +
          g(c, p("M48 54l-6-18l14 10zM72 54l6-18l-14 10z")) +
          g("c-roja lleno", circulo(53, 64, 3.2) + circulo(67, 64, 3.2)) +
          g("c-blanca", p("M54 78l2 6l2-6zM62 78l2 6l2-6z")) +
          g("c-blanca sin-relleno fino", p("M52 96l-4 12M68 96l4 12"));
      },
    fantasma:
      function (c) {
        return g(c, p("M30 108V56q0-38 30-38t30 38v52l-10-8l-10 8l-10-8l-10 8l-10-8z")) +
          g("pupila", '<ellipse cx="48" cy="56" rx="5" ry="8"/><ellipse cx="68" cy="56" rx="5" ry="8"/>') +
          g("pupila", '<ellipse cx="58" cy="80" rx="6" ry="8"/>') +
          g(c, p("M30 70q-14-4-18-16M90 70q14-4 18-16"));
      },
    dragon:
      function (c) {
        return g(c, p("M74 56q26-44 44-14q-12-2-16 8q-8-6-14 4q-6-6-12 6z")) +
          g(c, p("M42 112q0-42 30-52q26 6 28 52z")) +
          g("c-amarilla sin-relleno fino", p("M66 76q8 4 16 0M64 88q10 4 20 0M64 100q10 4 20 0")) +
          g(c, p("M60 66q-4-28 8-38q-22-2-40 8q-10 8-2 16q16 2 28 14z")) +
          g("c-amarilla", p("M54 30l2-18l8 16zM64 30l8-14l0 16z")) +
          g("c-amarilla lleno", circulo(42, 40, 3.4)) +
          g("c-blanca sin-relleno fino", p("M30 48l3-2M44 54l-12-2")) +
          g("c-naranja fuego", p("M24 50q-12-4-20 4q8 0 10 6q-6 2-10 10q10-4 18-12z")) +
          g(c, p("M98 104q16-2 18-18q-8 6-14 4"));
      }
  };

  var COLORES = {
    blob: ["c-verde", "c-naranja"],
    robot: ["c-azul", "c-roja"],
    murcielago: ["c-morada", "c-roja"],
    fantasma: ["c-blanca", "c-azul"],
    dragon: ["c-roja", "c-morada"]
  };

  var CORONA_Y = { blob: 30, robot: -4, murcielago: 24, fantasma: 4, dragon: 8 };

  function corona(forma) {
    var y = CORONA_Y[forma];
    var x = forma === "dragon" ? -16 : 0;
    return '<g transform="translate(' + x + " " + y + ')">' +
      g("c-amarilla", p("M44 14l4-12l7 8l5-10l5 10l7-8l4 12z")) + "</g>";
  }

  function svg(contenido, clase) {
    return '<svg viewBox="0 0 120 120" class="dibujo ' + (clase || "") + '" aria-hidden="true"><g filter="url(#tiza)">' + contenido + "</g></svg>";
  }

  global.Dibujos = {
    personaje: function (id) {
      return svg(PERSONAJES[id], "dibujo-personaje");
    },
    boss: function (forma, conCorona) {
      var color = COLORES[forma][conCorona ? 1 : 0];
      return svg(FORMAS[forma](color) + (conCorona ? corona(forma) : ""), "dibujo-boss");
    },
    estrella: function (clase) {
      return '<svg viewBox="0 0 24 24" class="estrella ' + (clase || "") + '" aria-hidden="true"><path d="M12 2l3 6.5l7 .8l-5.2 4.8l1.4 7L12 17.6L5.8 21.1l1.4-7L2 9.3l7-.8z"/></svg>';
    }
  };
})(window);
