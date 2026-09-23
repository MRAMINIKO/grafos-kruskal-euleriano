import type { EstadoJuego, ResultadoClick } from '../core/tipo';
import { diagnosticarParidad } from '../core/grafo';

/** Detecta si el grafo cargado es el de postes (segundo escenario). */
function esGrafoDePostes(estado: EstadoJuego): boolean {
  return estado.grafo.vertices.some((v) => v.id.startsWith('poste'));
}

/** Devuelve "cable" o "túnel" según el escenario activo. */
function sustantivoDe(estado: EstadoJuego): string {
  return esGrafoDePostes(estado) ? 'cable' : 'túnel';
}

/** Devuelve "cables" o "túneles" según el escenario activo. */
function sustantivoPluralDe(estado: EstadoJuego): string {
  return esGrafoDePostes(estado) ? 'cables' : 'túneles';
}

export function iniciarFaseEuleriano(estado: EstadoJuego): void {
  const { verticesImpares } = diagnosticarParidad(estado.grafo);
  const verticeInicial = verticesImpares[0] ?? estado.grafo.vertices[0].id;

  estado.verticeActual = verticeInicial;
  estado.fase = 'euleriano';

  const plural = sustantivoPluralDe(estado);
  const estacion = estado.grafo.vertices.find((v) => v.id === verticeInicial);
  estado.mensaje = `Fase 2: recorré todos los ${plural}. Arrancás en ${
    estacion?.label ?? verticeInicial
  }.`;
}

export function intentarVisitarArista(
  estado: EstadoJuego,
  idAristaClickeada: string,
): ResultadoClick {
  const sustantivo = sustantivoDe(estado);

  const aristaClickeada = estado.grafo.aristas.find(
    (arista) => arista.id === idAristaClickeada,
  );

  if (aristaClickeada === undefined) {
    return { aceptada: false, mensaje: 'Arista no encontrada' };
  }

  if (estado.aristasVisitadas.has(idAristaClickeada)) {
    return { aceptada: false, mensaje: `Ese ${sustantivo} ya fue recorrido.` };
  }

  const esAdyacente =
    aristaClickeada.origen === estado.verticeActual ||
    aristaClickeada.destino === estado.verticeActual;
  if (!esAdyacente) {
    return {
      aceptada: false,
      mensaje: `Ese ${sustantivo} no sale de la estación actual.`,
    };
  }

  estado.aristasVisitadas.add(aristaClickeada.id);
  estado.verticeActual =
    aristaClickeada.origen === estado.verticeActual
      ? aristaClickeada.destino
      : aristaClickeada.origen;

  if (estado.aristasVisitadas.size === estado.grafo.aristas.length) {
    estado.fase = 'completado';
    const plural = sustantivoPluralDe(estado);
    return {
      aceptada: true,
      mensaje: `¡Recorriste todos los ${plural}! Juego completado.`,
    };
  }

  return { aceptada: true, mensaje: `${capitalizar(sustantivo)} recorrido.` };
}

function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}
