import type { EstadoJuego, ResultadoClick } from '../core/tipo';
import { diagnosticarParidad } from '../core/grafo';

export function iniciarFaseEuleriano(estado: EstadoJuego): void {
  const { verticesImpares } = diagnosticarParidad(estado.grafo);
  const verticeInicial = verticesImpares[0] ?? estado.grafo.vertices[0].id;

  estado.verticeActual = verticeInicial;
  estado.fase = 'euleriano';

  const esPostes = estado.grafo.vertices.some((v) => v.id.startsWith('poste'));
  const sustantivo = esPostes ? 'cable' : 'túnel';
  const estacion = estado.grafo.vertices.find((v) => v.id === verticeInicial);
  estado.mensaje = `Fase 2: recorré todos los ${sustantivo}s. Arrancás en ${
    estacion?.label ?? verticeInicial
  }.`;
}

export function intentarVisitarArista(
  estado: EstadoJuego,
  idAristaClickeada: string,
): ResultadoClick {
  const aristaClickeada = estado.grafo.aristas.find(
    (arista) => arista.id === idAristaClickeada,
  );

  if (aristaClickeada === undefined) {
    return { aceptada: false, mensaje: 'Arista no encontrada' };
  }

  if (estado.aristasVisitadas.has(idAristaClickeada)) {
    return { aceptada: false, mensaje: 'Ese túnel ya fue recorrido.' };
  }

  const esAdyacente =
    aristaClickeada.origen === estado.verticeActual ||
    aristaClickeada.destino === estado.verticeActual;
  if (!esAdyacente) {
    return {
      aceptada: false,
      mensaje: 'Ese túnel no sale de la estación actual.',
    };
  }

  estado.aristasVisitadas.add(aristaClickeada.id);
  estado.verticeActual =
    aristaClickeada.origen === estado.verticeActual
      ? aristaClickeada.destino
      : aristaClickeada.origen;

  if (estado.aristasVisitadas.size === estado.grafo.aristas.length) {
    estado.fase = 'completado';
    return {
      aceptada: true,
      mensaje: '¡Recorriste todos los túneles! Juego completado.',
    };
  }

  return { aceptada: true, mensaje: 'Túnel recorrido.' };
}
