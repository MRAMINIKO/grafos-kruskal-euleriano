import type { Vertice, Arista } from '../core/tipo';

// Layout calcado de la foto: 3 postes arriba, 2 abajo.
export const verticesPostes: Vertice[] = [
  { id: 'poste_1', label: 'Poste 1', x: 140, y: 120 },
  { id: 'poste_2', label: 'Poste 2', x: 430, y: 170 },
  { id: 'poste_3', label: 'Poste 3', x: 790, y: 150 },
  { id: 'poste_4', label: 'Poste 4', x: 520, y: 590 },
  { id: 'poste_5', label: 'Poste 5', x: 200, y: 820 },
];

// El peso combina distancia + dificultad del tendido.
// Ej: cable_9 es corto pero cruza una avenida (peso 10);
//     cable_8 es largo pero va por descampado (peso 3).
export const aristasPostes: Arista[] = [
  { id: 'cable_1', origen: 'poste_1', destino: 'poste_2', peso: 2 },
  { id: 'cable_2', origen: 'poste_2', destino: 'poste_3', peso: 4 },
  { id: 'cable_3', origen: 'poste_2', destino: 'poste_4', peso: 6 },
  { id: 'cable_4', origen: 'poste_3', destino: 'poste_4', peso: 5 },
  { id: 'cable_5', origen: 'poste_3', destino: 'poste_5', peso: 8 },
  { id: 'cable_6', origen: 'poste_2', destino: 'poste_5', peso: 7 },
  { id: 'cable_7', origen: 'poste_1', destino: 'poste_4', peso: 9 },
  { id: 'cable_8', origen: 'poste_1', destino: 'poste_5', peso: 3 },
  { id: 'cable_9', origen: 'poste_4', destino: 'poste_5', peso: 10 },
];
