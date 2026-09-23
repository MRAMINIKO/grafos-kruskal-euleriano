import cytoscape from 'cytoscape';
import type { Vertice, Arista, EstadoJuego } from '../core/tipo';
import { obtenerVerticesGradoImpar } from '../core/grafo';
import {
  estilosCytoscape,
  coloresRuta,
  COLOR_CABLE,
} from './estilos-cytoscape';

const TERMINALES = new Set(['constitucion', 'retiro']);
const COLOR_POR_DEFECTO = '#94a3b8';

// Los cables eléctricos (prefijo "cable_") van todos del mismo color.
// Las aristas del subte (patrón "e_r<n>_<m>") se colorean por ruta.
function colorDeRuta(idArista: string): string {
  if (idArista.startsWith('cable_')) return COLOR_CABLE;
  const match = /^e_(r\d+)_/.exec(idArista);
  const ruta = match?.[1];
  return (ruta && coloresRuta[ruta]) ?? COLOR_POR_DEFECTO;
}

function nodoADef(v: Vertice): cytoscape.ElementDefinition {
  const esPoste = v.id.startsWith('poste');
  return {
    data: { id: v.id, label: v.label },
    position: { x: v.x, y: v.y },
    classes: TERMINALES.has(v.id) ? 'terminal' : esPoste ? 'poste' : undefined,
  };
}

function aristaADef(a: Arista): cytoscape.ElementDefinition {
  return {
    data: {
      id: a.id,
      source: a.origen,
      target: a.destino,
      peso: a.peso,
      color: colorDeRuta(a.id),
    },
  };
}

export function crearVisualizador(
  contenedor: HTMLElement,
  vertices: Vertice[],
  aristas: Arista[],
): cytoscape.Core {
  return cytoscape({
    container: contenedor,
    elements: [...vertices.map(nodoADef), ...aristas.map(aristaADef)],
    layout: { name: 'preset' },
    style: estilosCytoscape,
    wheelSensitivity: 0.2,
  });
}

/** Reemplaza todos los elementos del grafo (para el switch de misión). */
export function cargarGrafo(
  cy: cytoscape.Core,
  vertices: Vertice[],
  aristas: Arista[],
): void {
  cy.elements().remove();
  cy.add([...vertices.map(nodoADef), ...aristas.map(aristaADef)]);
  cy.fit(undefined, 60);
}

export function pintarEstado(cy: cytoscape.Core, estado: EstadoJuego): void {
  cy.edges().removeClass('seleccionada visitada');
  cy.nodes().removeClass('vertice-actual vertice-impar');

  for (const idArista of estado.aristasSeleccionadas) {
    cy.getElementById(idArista).addClass('seleccionada');
  }
  for (const idArista of estado.aristasVisitadas) {
    cy.getElementById(idArista).addClass('visitada');
  }

  if (estado.verticeActual !== null) {
    cy.getElementById(estado.verticeActual).addClass('vertice-actual');
  }

  if (estado.fase !== 'kruskal') {
    for (const idVertice of obtenerVerticesGradoImpar(estado.grafo)) {
      cy.getElementById(idVertice).addClass('vertice-impar');
    }
  }
}
