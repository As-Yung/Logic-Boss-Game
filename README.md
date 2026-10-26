# Logic-Boss-Game

* Descripción General:

  Este repositorio es creado y realizado por Quiroga Torres Santiago, en el subiré las actualizaciones referentes a mi proyecto aquí en     GitHub llamado Logic Boss Game.

* Informe de Versiones:

  (V.1.0): Esta es la segunda versión del contenido de este proyecto, en este primer acercamiento utilice Java.

  (V.1.1): Se ha mejorado el balence del Boss y el algoritmo que genera las preguntas, estos cambios se han relizado utilizando Java.

  (V.2.0): Versión web con interfaz gráfica. La lógica de las clases Java se tradujo a JavaScript sin cambiar fórmulas ni probabilidades, y ahora el juego se juega en el navegador.

  (V.3.0): Versión web pensada para niños. Preguntas sin negativos ni decimales que se vuelven más difíciles poco a poco, tres niveles de dificultad por edad, 10 bosses distintos dibujados con tiza, animaciones, sonido y un balance nuevo probado con miles de partidas simuladas. También se arreglaron fallos del original, como que los personajes secretos no podían ganar.

* Jugar en el navegador (V.2.0 y V.3.0):

  Abre el archivo web/index.html en cualquier navegador moderno; no hace falta instalar nada ni compilar. También puedes servir la carpeta web/ con cualquier servidor estático (por ejemplo GitHub Pages).

  La lógica está en web/js/logica.js, los dibujos en web/js/dibujos.js y la interfaz en web/js/interfaz.js. Las pruebas de la lógica se ejecutan con Node.js:

      node --test "web/tests/*.test.js"

* Ejecución del Código (V.1.0, V.1.1):

  Para la ejecución del código recomiendo usar el entorno de desarrollo libre NetBeans.

  Dentro del entorno de desarrollo debe darse click derecho sobre el archivo sistemaUno.java y seleccionar con click izquierdo la opción   de Run File.
