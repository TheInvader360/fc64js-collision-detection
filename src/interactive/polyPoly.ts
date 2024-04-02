import { Poly, generateVertices } from '../shape';
import { isCollidingPolyPoly } from '../collision';
import { cyclingColor, drawTextCentered } from '../main';

let controllablePolyVertexCount: number;
let controllablePoly: Poly;
let targetPolyVertexCount: number;
let targetPoly: Poly;

export function init() {
  controllablePolyVertexCount = 3;
  controllablePoly = {
    vertices: [
      { x: 17, y: 4 },
      { x: 3, y: 27 },
      { x: 30, y: 30 },
    ],
  };
  targetPolyVertexCount = 3;
  targetPoly = {
    vertices: [
      { x: 34, y: 34 },
      { x: 52, y: 40 },
      { x: 42, y: 60 },
    ],
  };
}

export function loop(ticks: number) {
  if (ticks % 5 === 0) {
    if (isPressed(BTN_A)) {
      if (isPressed(BTN_U) && targetPolyVertexCount < 12) targetPolyVertexCount++;
      if (isPressed(BTN_D) && targetPolyVertexCount > 3) targetPolyVertexCount--;
      if (isPressed(BTN_L) && controllablePolyVertexCount > 3) controllablePolyVertexCount--;
      if (isPressed(BTN_R) && controllablePolyVertexCount < 12) controllablePolyVertexCount++;
      targetPoly.vertices = generateVertices(44, 44, 3, 24, targetPolyVertexCount);
      controllablePoly.vertices = generateVertices(20, 20, 3, 24, controllablePolyVertexCount);
    } else {
      if (isPressed(BTN_U) && getAverageY(controllablePoly) > 0) move(controllablePoly, 0, -1);
      if (isPressed(BTN_D) && getAverageY(controllablePoly) < GFX_H) move(controllablePoly, 0, 1);
      if (isPressed(BTN_L) && getAverageX(controllablePoly) > 0) move(controllablePoly, -1, 0);
      if (isPressed(BTN_R) && getAverageX(controllablePoly) < GFX_W) move(controllablePoly, 1, 0);
    }
  }

  const colliding = isCollidingPolyPoly(controllablePoly, targetPoly);

  clearGfx(colliding ? COL_YEL : COL_BLK);
  drawPolygon(targetPoly.vertices, colliding ? COL_MAG : COL_CYN, colliding ? COL_MAG : COL_CYN);
  drawPolygon(controllablePoly.vertices, cyclingColor(ticks, 10), colliding ? COL_CYN : COL_MAG);
  drawTextCentered(1, 'POLY-POLY', COL_RED);
}

const getAverageX = (poly: Poly): number => poly.vertices.reduce((p, c) => p + c.x, 0) / poly.vertices.length;

const getAverageY = (poly: Poly): number => poly.vertices.reduce((p, c) => p + c.y, 0) / poly.vertices.length;

const move = (poly: Poly, x: number, y: number): void => {
  for (let i = 0; i < poly.vertices.length; i++) {
    poly.vertices[i].x += x;
    poly.vertices[i].y += y;
  }
};
