import { Line, Poly, generateVertices } from '../shape';
import { isCollidingLinePoly } from '../collision';
import { cyclingColor, drawTextCentered } from '../main';

let controllableLine: Line;
let targetPolyVertexCount: number;
let targetPoly: Poly;
let currentVertex: number;

export function init() {
  controllableLine = { x1: 4, y1: 16, x2: 28, y2: 4 };
  targetPolyVertexCount = 3;
  targetPoly = {
    vertices: [
      { x: 36, y: 12 },
      { x: 14, y: 50 },
      { x: 52, y: 46 },
    ],
  };
  currentVertex = 1;
}

export function loop(ticks: number) {
  if (ticks % 5 === 0) {
    if (isPressed(BTN_A)) {
      currentVertex = wrap(currentVertex + 1, 1, 3);
      if (isPressed(BTN_U) && targetPolyVertexCount < 12) targetPolyVertexCount++;
      if (isPressed(BTN_D) && targetPolyVertexCount > 3) targetPolyVertexCount--;
      if (isPressed(BTN_U) || isPressed(BTN_D) || isPressed(BTN_L) || isPressed(BTN_R)) targetPoly.vertices = generateVertices(32, 32, 10, 25, targetPolyVertexCount);
    } else {
      if (currentVertex === 1) {
        if (isPressed(BTN_U) && controllableLine.y1 > 0) controllableLine.y1--;
        if (isPressed(BTN_D) && controllableLine.y1 < GFX_H - 1) controllableLine.y1++;
        if (isPressed(BTN_L) && controllableLine.x1 > 0) controllableLine.x1--;
        if (isPressed(BTN_R) && controllableLine.x1 < GFX_W - 1) controllableLine.x1++;
      }
      if (currentVertex === 2) {
        if (isPressed(BTN_U) && controllableLine.y2 > 0) controllableLine.y2--;
        if (isPressed(BTN_D) && controllableLine.y2 < GFX_H - 1) controllableLine.y2++;
        if (isPressed(BTN_L) && controllableLine.x2 > 0) controllableLine.x2--;
        if (isPressed(BTN_R) && controllableLine.x2 < GFX_W - 1) controllableLine.x2++;
      }
    }
  }

  const colliding = isCollidingLinePoly(controllableLine, targetPoly); // isCollidingPolyLine(targetPoly, controllableLine) would also be valid

  clearGfx(colliding ? COL_YEL : COL_BLK);
  drawPolygon(targetPoly.vertices, colliding ? COL_MAG : COL_CYN, colliding ? COL_MAG : COL_CYN);
  drawLine(controllableLine.x1, controllableLine.y1, controllableLine.x2, controllableLine.y2, colliding ? COL_CYN : COL_MAG);
  const color = cyclingColor(ticks, 10);
  if (currentVertex === 1) drawCircle(controllableLine.x1, controllableLine.y1, 1, color);
  if (currentVertex === 2) drawCircle(controllableLine.x2, controllableLine.y2, 1, color);
  drawTextCentered(1, 'LINE-POLY', COL_RED);
}
