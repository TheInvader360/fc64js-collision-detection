import { Circle, Poly, generateVertices } from '../shape';
import { isCollidingCirclePoly } from '../collision';
import { cyclingColor, drawTextCentered } from '../main';

let controllableCircle: Circle;
let targetPolyVertexCount: number;
let targetPoly: Poly;

export function init() {
  controllableCircle = { x: 16, y: 16, radius: 4 };
  targetPolyVertexCount = 3;
  targetPoly = {
    vertices: [
      { x: 36, y: 12 },
      { x: 14, y: 50 },
      { x: 52, y: 46 },
    ],
  };
}

export function loop(ticks: number) {
  if (ticks % 5 === 0) {
    if (isPressed(BTN_A)) {
      if (isPressed(BTN_U) && targetPolyVertexCount < 12) targetPolyVertexCount++;
      if (isPressed(BTN_D) && targetPolyVertexCount > 3) targetPolyVertexCount--;
      if (isPressed(BTN_L) && controllableCircle.radius > 0) controllableCircle.radius--;
      if (isPressed(BTN_R) && controllableCircle.radius < 16) controllableCircle.radius++;
      targetPoly.vertices = generateVertices(32, 32, 10, 25, targetPolyVertexCount);
    } else {
      if (isPressed(BTN_U) && controllableCircle.y > 0) controllableCircle.y--;
      if (isPressed(BTN_D) && controllableCircle.y < GFX_H - 1) controllableCircle.y++;
      if (isPressed(BTN_L) && controllableCircle.x > 0) controllableCircle.x--;
      if (isPressed(BTN_R) && controllableCircle.x < GFX_W - 1) controllableCircle.x++;
    }
  }

  const colliding = isCollidingCirclePoly(controllableCircle, targetPoly); // isCollidingPolyCircle(targetPoly, controllableCircle) would also be valid

  clearGfx(colliding ? COL_YEL : COL_BLK);
  drawPolygon(targetPoly.vertices, colliding ? COL_MAG : COL_CYN, colliding ? COL_MAG : COL_CYN);
  drawCircle(controllableCircle.x, controllableCircle.y, controllableCircle.radius, cyclingColor(ticks, 10), colliding ? COL_CYN : COL_MAG);
  drawTextCentered(1, 'CIRCLE-POLY', COL_RED);
}
