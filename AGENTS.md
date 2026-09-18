## Arquitectura

Aplicación interactiva en TypeScript estricto con Vite. El renderizado y la detección de clicks en nodos/aristas se delegan a **Cytoscape.js**; toda la lógica matemática (Kruskal, Union-Find, paridad de grados, recorrido euleriano) vive en módulos propios, independientes de Cytoscape, para que quede clara y sea fácil de explicar en la exposición.

Cytoscape se usa solo como capa de dibujo + hit-testing, con layout `preset` (coordenadas fijas, como un mapa de subte real). Nunca se usan sus layouts automáticos (grid/circle/cola) ni algoritmos de grafos propios de la librería: conectividad, ciclos y grados los calcula siempre nuestro propio modelo en `core/`.

## Estructura de carpetas

```
src/
  main.ts                    Punto de entrada: crea la instancia de Cytoscape, el estado global y conecta los handlers de cada fase.
  core/
    tipos.ts                 Interfaces compartidas: Vertice, Arista, Fase, EstadoJuego.
    grafo.ts                 Modelo de datos puro del grafo (vértices/aristas, adyacencias, cálculo de grados). No depende de Cytoscape.
    union-find.ts            Estructura de conjuntos disjuntos (DSU) para detectar ciclos en Kruskal.
  datos/
    red-subte.ts             Definición estática de la red completa: estaciones (id, label, x, y) y túneles (origen, destino, costo). Diseñada a mano para que el grafo COMPLETO tenga exactamente 2 vértices de grado impar.
  fases/
    fase-kruskal.ts          Lógica de la Fase 1: qué arista es válida a continuación (la más barata entre las que no forman ciclo), aplicación del Union-Find, detección de fin de fase.
    fase-euleriano.ts        Lógica de la Fase 2: vértice actual del inspector, aristas visitadas, validación de adyacencia, detección de recorrido completo.
  estado/
    estado-juego.ts          Objeto de estado global único (máquina de estados): fase activa, selección/visitados, mensaje de feedback, transición Fase 1 → Fase 2.
  render/
    visualizador.ts          Adaptador de Cytoscape: crea `cy`, define el layout `preset` con las coordenadas de `red-subte.ts`, y aplica clases de estilo según el estado del juego.
    estilos-cytoscape.ts     Hoja de estilos de Cytoscape (colores y clases), separada del código de armado para poder ajustarla sin tocar lógica.
  ui/
    controles.ts             Panel de feedback: fase actual, mensaje de validación/error, botón de reset y botón "Continuar a Fase 2".
```

Los archivos vacíos `src/grafo.ts` y `src/visualizador.ts` que ya existían se reemplazan por `core/grafo.ts` y `render/visualizador.ts`. El `main.ts` actual (demo de Cytoscape con nodos "Node A/B") se reescribe por completo.

## Reglas de Estado

Un único objeto `EstadoJuego` (en `estado/estado-juego.ts`) controla todo:

```ts
type Fase = "kruskal" | "euleriano" | "completado";

interface EstadoJuego {
  fase: Fase;
  grafo: Grafo;                     // red completa, definida en datos/red-subte.ts
  // Fase Kruskal
  dsu: UnionFind;
  aristasSeleccionadas: Set<string>;
  // Fase Euleriano
  verticeActual: string | null;
  aristasVisitadas: Set<string>;
  mensaje: string;                  // feedback visible en la UI
}
```

La transición Fase 1 → Fase 2 ocurre cuando `aristasSeleccionadas.size === vertices.length - 1` (árbol recubridor completo). En ese momento se muestran de nuevo TODAS las aristas de la red original (no solo el MST): en la Fase 2 el jugador es un inspector que debe recorrer cada túnel real de la red, no solo los del árbol mínimo.

## Modelado de Datos

- `Vertice`: `{ id: string; label: string; x: number; y: number }`.
- `Arista`: `{ id: string; origen: string; destino: string; peso: number }`. Cada arista tiene un `id` propio y estable (no se referencia por índice) para poder llevar los sets de seleccionadas/visitadas.
- La red se define una única vez en `datos/red-subte.ts` y se reutiliza en ambas fases: la Fase 1 elige un subconjunto de sus aristas (el MST), la Fase 2 usa TODAS sus aristas.
- Restricción de diseño de los datos: la red completa debe tener 0 o exactamente 2 vértices de grado impar. Se garantiza a mano al escribir `red-subte.ts`; `core/grafo.ts` puede exponer una función de diagnóstico para verificarlo en desarrollo, pero no se recalcula en runtime como validación de producto.

## Validaciones Lógicas

- **Fase Kruskal**:
  - En cada click, `fase-kruskal.ts` calcula, entre las aristas todavía no seleccionadas, cuáles NO formarían ciclo (consultando el DSU sin aplicar el `union` todavía) y toma el peso mínimo de ese conjunto.
  - El click solo se acepta si la arista clickeada tiene ese peso mínimo (pueden existir empates, cualquiera de ellos es válido). Si no forma ciclo pero no es la más barata disponible → se rechaza con un mensaje tipo "hay una opción más barata". Si formaría ciclo → se rechaza con mensaje de ciclo.
  - Al aceptar: se aplica `union` en el DSU y se agrega el id a `aristasSeleccionadas`.
  - Fin de fase: `aristasSeleccionadas.size === vertices.length - 1`.
- **Fase Euleriano**:
  - Al iniciar la fase se valida (con `core/grafo.ts`) que el grafo tenga 0 o 2 vértices de grado impar; si hay 2, el recorrido debe arrancar obligatoriamente en uno de ellos.
  - Solo se aceptan clicks en aristas adyacentes al `verticeActual` y que no estén en `aristasVisitadas`. Click en arista no adyacente o ya visitada → bloqueado, sin efecto (o con mensaje de error breve).
  - Al aceptar: se agrega el id a `aristasVisitadas` y `verticeActual` pasa al otro extremo de la arista.
  - Éxito: `aristasVisitadas.size` es igual al total de aristas del grafo.

## Renderizado (Cytoscape)

- Layout `preset` fijo, usando las coordenadas `x`/`y` de `red-subte.ts`. Nunca layouts automáticos, para que el mapa se vea siempre igual, como un plano real.
- Clases de estilo en `estilos-cytoscape.ts`: `.seleccionada`, `.rechazada` (feedback visual breve), `.visitada`, `.vertice-actual`, `.vertice-impar`.
- `render/visualizador.ts` expone funciones puras del tipo `pintarEstado(cy, estado)` que leen `EstadoJuego` y aplican clases. Esta capa no contiene lógica de negocio: es un espejo visual del estado, nunca decide si un click es válido.

## Dependencias

- **Cytoscape.js**: renderizado, layout `preset` y detección de clicks en nodos/aristas (`cy.on('tap', 'node' | 'edge', ...)`).
- Sin librerías externas de algoritmos de grafos: Union-Find, cálculo de grados, validación de ciclos y de recorrido euleriano son implementación propia en `core/`.

## Modo de colaboración (el código lo escribe el usuario)

El objetivo es que el usuario desarrolle el proyecto por su cuenta; el agente acompaña, no reemplaza. Esto aplica a **todo** el trabajo, no solo a la arquitectura.

- **Modo por defecto — guía, no código.** Si el usuario plantea que quiere encarar una parte ("quiero empezar a desarrollar la red del subte", "ahora quiero hacer el Union-Find"), el agente NO escribe el código ni propone una implementación concreta (ni completa ni en borrador/esqueleto). En cambio, explica en forma simple los conceptos y la API de la biblioteca involucrada que hacen falta para resolverlo (por ejemplo, qué es el layout `preset` de Cytoscape y qué forma de datos espera, o qué invariante tiene que cumplir un Union-Find), dejando que sea el usuario quien conecte esas piezas y escriba el código. No dar la solución armada ni aunque sea fácil de deducir.
- **Modo desarrollo — solo si lo piden explícitamente.** Únicamente cuando el usuario pide explícitamente que el agente explique cómo hacerlo paso a paso, o que lo desarrolle/programe él mismo, el agente cambia de rol: ahí sí puede escribir el código, y además debe explicar todos los conceptos involucrados que el usuario pueda no conocer (no alcanza con dejar el código, hay que justificarlo).
- **Revisión crítica de lo que trae el usuario.** Cuando el usuario proponga una idea, un diseño o código propio, el agente lo analiza con espíritu crítico: piensa qué va a pasar realmente cuando eso se ejecute (casos borde, ciclos, grados impares mal contados, datos de `red-subte.ts` que no cumplan la condición de Euler, etc.) y si encuentra fallas las señala explícitamente junto con el motivo. No se limita a validar o aprobar sin más.

## Cómo debe comportarse el agente

Actuá como un desarrollador web experto en TypeScript y Cytoscape.js. Estamos construyendo un juego interactivo de dos fases basado en una red de subterráneos para explicar conceptos de matemática discreta, siguiendo la arquitectura de carpetas y las reglas de este documento.

- Fase 1 (Kruskal): se dibuja la red completa de estaciones (vértices) y túneles con costo (aristas), definida en `datos/red-subte.ts`. El jugador hace click en aristas para construir un árbol recubridor mínimo. Cada click se valida contra el Union-Find (`core/union-find.ts`) y contra la regla de "arista más barata disponible" (`fases/fase-kruskal.ts`); no alcanza con evitar ciclos, tiene que ser la más barata entre las válidas.
- Fase 2 (recorrido euleriano): al completar el MST se revela la red completa (todas las aristas, no solo el MST), que fue diseñada para tener exactamente dos vértices de grado impar. El jugador asume el rol de inspector y debe hacer click en los túneles, en orden válido (adyacentes al vértice actual, no repetidos), hasta recorrerlos todos.
- Antes de escribir código nuevo, revisar este AGENTS.md para respetar la separación entre `core/` (lógica pura, sin Cytoscape), `render/` (solo pintar el estado) y `fases/`+`estado/` (reglas del juego).
