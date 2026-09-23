import type cytoscape from 'cytoscape';

// Paleta categórica (orden fijo, no ciclado) — pasos "dark" de la escala,
// elegidos para leerse como tinta clara sobre el fondo azul del blueprint.
export const coloresRuta: Record<string, string> = {
  r1: '#7fc3ff', // azul
  r2: '#ff9a5c', // naranja
  r3: '#5fe0b3', // aqua
  r4: '#b6a9ff', // violeta
  r5: '#ff9dc4', // magenta
};

// Color único para todos los cables del tendido eléctrico.
export const COLOR_CABLE = '#fbbf24';

// Colores de estado (fijos, no se reutilizan como identidad de ruta).
const ESTADO = {
  bueno: '#3ddc73',
  critico: '#ff6b6b',
  advertencia: '#ffce54',
  tinta: '#eaf3ff',
  tintaMuted: '#8fb4e3',
};

const FUENTE = 'JetBrains Mono, ui-monospace, monospace';
const LINEA_BLUEPRINT = 'rgba(197, 225, 255, 0.55)';

export const estilosCytoscape: cytoscape.StylesheetJson = [
  {
    selector: 'node',
    style: {
      content: 'data(label)',
      shape: 'ellipse',
      'background-color': '#10315c',
      'border-width': 2,
      'border-color': LINEA_BLUEPRINT,
      width: 14,
      height: 14,
      'font-family': FUENTE,
      'font-size': 10,
      'font-weight': 700,
      color: ESTADO.tinta,
      'text-valign': 'top',
      'text-halign': 'center',
      'text-margin-y': -8,
      'text-background-opacity': 0,
    },
  },
  {
    selector: 'node.terminal',
    style: {
      width: 26,
      height: 26,
      'border-width': 3,
      'border-color': ESTADO.tinta,
      'background-color': '#1a4a85',
      color: ESTADO.tinta,
      'font-size': 12,
      'font-weight': 700,
      'text-valign': 'center',
      'text-halign': 'center',
      'text-margin-y': 0,
      'text-wrap': 'wrap',
      'text-max-width': '60px',
      'text-background-opacity': 0,
    },
  },
  {
    selector: 'node.poste',
    style: {
      shape: 'round-rectangle',
      width: 30,
      height: 30,
      'background-color': '#475569',
      'border-color': '#e2e8f0',
      'border-width': 2,
      color: ESTADO.tinta,
      'font-size': 11,
      'font-weight': 700,
      'text-valign': 'bottom',
      'text-halign': 'center',
      'text-margin-y': 8,
      'text-background-opacity': 0,
    },
  },
  {
    selector: 'edge',
    style: {
      'line-color': 'data(color)',
      'curve-style': 'bezier',
      width: 3,
      'line-cap': 'round',
      label: 'data(peso)',
      'font-family': FUENTE,
      'font-size': 10,
      'font-weight': 700,
      color: ESTADO.tintaMuted,
      'text-background-color': '#0c274a',
      'text-background-opacity': 1,
      'text-background-padding': '2px',
      opacity: 0.75,
    },
  },
  {
    selector: 'edge.seleccionada',
    style: {
      'line-color': ESTADO.bueno,
      width: 5,
      opacity: 1,
      'z-index': 10,
    },
  },
  {
    selector: 'edge.visitada',
    style: {
      'line-style': 'dashed',
      'line-dash-pattern': [3, 4],
      'line-color': ESTADO.tinta,
      width: 5,
      opacity: 1,
      'z-index': 11,
    },
  },
  {
    selector: 'edge.rechazada',
    style: {
      'line-color': ESTADO.critico,
      width: 5,
      opacity: 1,
      'z-index': 12,
    },
  },
  {
    selector: 'node.vertice-actual',
    style: {
      'border-width': 4,
      'border-color': ESTADO.advertencia,
      'overlay-color': ESTADO.advertencia,
      'overlay-opacity': 0.3,
      'overlay-padding': 6,
    },
  },
  {
    selector: 'node.vertice-impar',
    style: {
      'border-width': 4,
      'border-color': ESTADO.critico,
    },
  },
];
