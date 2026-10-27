// Pruebas de la lógica web. Ejecutar con: node --test "web/tests/*.test.js"
const test = require("node:test");
const assert = require("node:assert");
const LB = require("../js/logica.js");

// Juega una partida entera acertando con la probabilidad dada.
function jugar(clave, dificultad, acierto) {
  const j = new LB.Juego(clave, { dificultad });
  const stats = ["vida", "ataque", "velocidad", "esquiva"];
  let t = 0;
  while (!j.fin) {
    t++;
    if (j.puntosPendientes > 0) {
      j.asignarPunto(stats[t % 4]);
      continue;
    }
    j.responder(Math.random() < acierto ? j.pregunta.respuesta : -1);
  }
  return j;
}

test("las preguntas son aptas para niños en todos los tramos", () => {
  for (let tramo = 1; tramo <= 6; tramo++) {
    for (let i = 0; i < 3000; i++) {
      const p = LB.crearPregunta(Math.random, tramo);
      const q = JSON.stringify(p);
      assert.ok(Number.isInteger(p.respuesta) && p.respuesta >= 0, q);
      assert.ok(p.a >= 0 && p.b >= 0, q);
      assert.strictEqual(p.opciones.length, 4, q);
      assert.strictEqual(new Set(p.opciones).size, 4, q);
      assert.ok(p.opciones.includes(p.respuesta), q);
      assert.ok(p.opciones.every((o) => Number.isInteger(o) && o >= 0), q);
      if (p.clase === "division") assert.strictEqual(p.a, p.b * p.respuesta, q);
      if (tramo === 1) {
        assert.ok(p.clase === "suma" || p.clase === "resta", q);
        assert.ok(Math.max(p.a, p.b, p.respuesta) <= 10, q);
      }
      if (tramo < 5) assert.notStrictEqual(p.clase, "division", q);
    }
  }
});

test("la dificultad de las preguntas sube con el boss y con el modo", () => {
  assert.strictEqual(LB.tramoPregunta(1, "facil"), 1);
  assert.strictEqual(LB.tramoPregunta(1, "normal"), 1);
  assert.strictEqual(LB.tramoPregunta(4, "normal"), 2);
  assert.strictEqual(LB.tramoPregunta(10, "normal"), 5);
  assert.strictEqual(LB.tramoPregunta(10, "dificil"), 6);
  assert.strictEqual(LB.tramoPregunta(10, "facil"), 4);
});

test("las adivinanzas desbloquean a Saitama y a Messi", () => {
  assert.strictEqual(LB.seleccionar("uno"), "777");
  assert.strictEqual(LB.seleccionar(" Messi "), "888");
  assert.strictEqual(LB.seleccionar("siete"), null);
});

test("vencer a un boss cura al jugador y trae al siguiente", () => {
  const j = new LB.Juego("1", { rnd: () => 0.99 });
  j.pj.vida = 10;
  j.bs.vida = 1;
  const r = j.responder(j.pregunta.respuesta);
  assert.ok(r.eventos.some((e) => e.tipo === "bossDerrotado"));
  assert.strictEqual(j.bs.nivel, 2);
  assert.strictEqual(j.bs.vida, j.bs.vidaMax);
  assert.ok(j.pj.vida > 10);
});

test("tres aciertos seguidos dan golpe crítico", () => {
  const j = new LB.Juego("1", { rnd: () => 0.99 });
  j.bs.vida = 1000;
  j.responder(j.pregunta.respuesta);
  j.responder(j.pregunta.respuesta);
  const r = j.responder(j.pregunta.respuesta);
  const golpe = r.eventos.find((e) => e.tipo === "golpeJugador");
  assert.ok(golpe.critico);
  assert.strictEqual(golpe.danio, 15);
});

test("al subir de nivel hay que repartir los puntos antes de seguir", () => {
  const j = new LB.Juego("4", { rnd: () => 0.99 });
  j.bs.vida = 1000;
  j.exp.actual = 39;
  j.responder(j.pregunta.respuesta);
  assert.strictEqual(j.pj.nivel, 2);
  assert.strictEqual(j.puntosPendientes, 2);
  assert.ok(j.exp.actual > 0, "la experiencia sobrante se conserva");
  assert.throws(() => j.responder(0));
  j.asignarPunto("vida");
  j.asignarPunto("ataque");
  assert.strictEqual(j.pj.vidaMax, 28 + LB.VIDA_POR_PUNTO);
  assert.strictEqual(j.pj.ataque, 13);
  assert.ok(j.pregunta);
});

test("responder mal puede dejar al jugador sin vida", () => {
  const j = new LB.Juego("2", { rnd: () => 0.99 });
  j.pj.vida = 1;
  const r = j.responder(-1);
  assert.strictEqual(r.fin, "derrota");
  assert.strictEqual(j.pregunta, null);
});

test("vencer al último boss gana la partida, también con personajes secretos", () => {
  for (const clave of ["1", "777", "888"]) {
    const j = new LB.Juego(clave, { rnd: () => 0.99 });
    j.bs = new LB.Boss(LB.NIVEL_FINAL);
    j.bs.vida = 1;
    const r = j.responder(j.pregunta.respuesta);
    assert.strictEqual(r.fin, "victoria", clave);
  }
});

test("el balance permite ganar acertando la mayoría", () => {
  let victorias = 0;
  for (let i = 0; i < 300; i++) {
    if (jugar("4", "normal", 0.9).fin === "victoria") victorias++;
  }
  assert.ok(victorias / 300 > 0.75, "victorias con 90 % de aciertos: " + victorias);

  victorias = 0;
  for (let i = 0; i < 300; i++) {
    if (jugar("4", "normal", 0.5).fin === "victoria") victorias++;
  }
  assert.ok(victorias / 300 < 0.1, "victorias con 50 % de aciertos: " + victorias);
});
