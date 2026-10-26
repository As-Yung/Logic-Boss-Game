// Pruebas de la lógica web. Ejecutar con: node --test "web/tests/*.test.js"
const test = require("node:test");
const assert = require("node:assert");
const LB = require("../js/logica.js");

// Generador con valores fijos para reproducir turnos concretos.
function secuencia(valores) {
  let i = 0;
  return () => valores[i++ % valores.length];
}

test("los personajes y el boss empiezan con los stats del original", () => {
  const j = new LB.Juego("3");
  assert.deepStrictEqual([j.pj.vida, j.pj.ataque, j.pj.velocidad, j.pj.esquiva], [8, 14, 6, 12]);
  assert.deepStrictEqual([j.bs.vidaBoss, j.bs.ataqueBoss, j.bs.velocidadBoss, j.bs.esquivaBoss], [50, 2, 9, 4]);
  assert.strictEqual(j.ap.expTotal, 60);
});

test("las adivinanzas desbloquean a Saitama y a Messi", () => {
  assert.strictEqual(LB.seleccionar("uno"), "777");
  assert.strictEqual(LB.seleccionar(" Messi "), "888");
  assert.strictEqual(LB.seleccionar("7"), "7");
});

test("cada pregunta incluye la respuesta correcta entre las opciones", () => {
  const op = new LB.Operaciones(Math.random);
  for (let i = 0; i < 2000; i++) {
    const p = op.crearPregunta();
    assert.ok(p.opciones.includes(p.respuesta), JSON.stringify(p));
    assert.ok(p.opciones.length <= 4);
  }
});

test("la división es entera y la potencia usa la multiplicación repetida", () => {
  const op = new LB.Operaciones(Math.random);
  assert.strictEqual(op.potenciar(3, 4), 81);
  assert.strictEqual(op.potenciar(5, 1), 5);
  // rnd: tipo=4 (división), uno = 2 + 0.9*45 -> 42, dos = 3 + 0.5*15 -> 10
  const op2 = new LB.Operaciones(secuencia([0.7, 0.9, 0.5, 0, 0, 0, 0, 0, 0, 0.3, 0.1, 0.6, 0.9]));
  const p = op2.crearPregunta();
  assert.strictEqual(p.simbolo, "÷");
  assert.strictEqual(p.respuesta, 4);
});

test("las probabilidades de esquiva coinciden con sistemaUno", () => {
  // Personaje con más esquiva: el ataque entra el 50% de las veces.
  let fallos = 0;
  for (let k = 0; k < 10; k++) {
    if (!LB.decidirEsquivaAtaque(() => k / 10, 4, 10)) fallos++;
  }
  assert.strictEqual(fallos, 5);
  // Boss con más esquiva: el ataque entra el 40% de las veces.
  fallos = 0;
  for (let k = 0; k < 10; k++) {
    if (!LB.decidirEsquivaAtaque(() => k / 10, 12, 10)) fallos++;
  }
  assert.strictEqual(fallos, 4);
});

test("vencer al boss sube su nivel y restaura su vida con +20", () => {
  const j = new LB.Juego("1", { rnd: () => 0.95 });
  j.bs.esTvidaBoss = 1;
  const r = j.responder(j.pregunta.respuesta);
  assert.ok(r.eventos.some((e) => e.tipo === "bossDerrotado"));
  assert.strictEqual(j.bs.nivelBoss, 2);
  assert.strictEqual(j.bs.vidaBoss, 70);
  assert.strictEqual(j.bs.esTvidaBoss, 70);
  assert.strictEqual(j.bs.ataqueBoss, 4);
  assert.strictEqual(j.bs.esquivaBoss, 7);
  assert.strictEqual(j.bs.velocidadBoss, 7 + 2 * 2 - 2);
});

test("al subir de nivel hay que repartir 2 puntos antes de seguir", () => {
  const j = new LB.Juego("4", { rnd: () => 0.95 });
  j.ap.estExp = 59;
  j.responder(j.pregunta.respuesta);
  assert.strictEqual(j.pj.nivelPj, 2);
  assert.strictEqual(j.puntosPendientes, 2);
  assert.strictEqual(j.ap.expTotal, 120);
  assert.strictEqual(j.ap.estExp, 0);
  assert.throws(() => j.responder(0));
  j.asignarPunto("ataque");
  j.asignarPunto("vida");
  assert.strictEqual(j.pj.ataque, 13);
  assert.strictEqual(j.pj.estVIDA, 10);
  assert.strictEqual(j.puntosPendientes, 0);
  assert.ok(j.pregunta);
});

test("responder mal puede dejar al jugador sin vida", () => {
  const j = new LB.Juego("2", { rnd: () => 0.05 });
  j.pj.estVIDA = 1;
  const r = j.responder(j.pregunta.respuesta + 1000);
  assert.strictEqual(r.fin, "derrota");
  assert.strictEqual(j.pregunta, null);
});

test("vencer al boss de nivel 24 gana la partida", () => {
  const j = new LB.Juego("1", { rnd: () => 0.95 });
  j.bs.nivelBoss = 24;
  j.bs.esTvidaBoss = 1;
  const r = j.responder(j.pregunta.respuesta);
  assert.strictEqual(r.fin, "victoria");
});

test("con Messi el boss evoluciona cuando esquivas su ataque", () => {
  const j = new LB.Juego("888", { rnd: () => 0.95 });
  const r = j.responder(j.pregunta.respuesta + 1000);
  assert.ok(r.eventos.some((e) => e.tipo === "bossEvoluciona"));
  assert.strictEqual(j.bs.nivelBoss, 2);
  assert.strictEqual(j.bs.vidaBoss, 50 + 20 * 15);
  assert.strictEqual(j.puntosPorNivel, 4);
});
