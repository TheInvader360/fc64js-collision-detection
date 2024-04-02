export interface Point {
  x: number;
  y: number;
}

export interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Circle {
  x: number;
  y: number;
  radius: number;
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Poly {
  vertices: Point[];
}

export const generateVertices = (centreX: number, centreY: number, minRadius: number, maxRadius: number, vertexCount: number): Point[] => {
  const vertices: Point[] = [];
  const angleStart = Math.random() * Math.PI * 2;
  const angleIncrement = (Math.PI * 2) / vertexCount;
  for (let i = 0; i < vertexCount; i++) {
    const angle = angleStart + i * angleIncrement;
    const radius = randomInt(minRadius, maxRadius);
    vertices.push({ x: Math.round(Math.cos(angle) * radius + centreX), y: Math.round(Math.sin(angle) * radius + centreY) });
  }
  return vertices;
};
