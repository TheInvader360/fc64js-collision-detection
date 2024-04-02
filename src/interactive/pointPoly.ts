import { Point, Poly, generateVertices } from '../shape';
import { isCollidingPointPoly } from '../collision';
import { cyclingColor, drawTextCentered } from '../main';

let controllablePoint: Point;
let targetPolyVertexCount: number;
let targetPoly: Poly;

export function init() {
  controllablePoint = { x: 16, y: 16 };
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
      if ((isPressed(BTN_U) || isPressed(BTN_R)) && targetPolyVertexCount < 12) targetPolyVertexCount++;
      if ((isPressed(BTN_D) || isPressed(BTN_L)) && targetPolyVertexCount > 3) targetPolyVertexCount--;
      targetPoly.vertices = generateVertices(32, 32, 10, 25, targetPolyVertexCount);
    } else {
      if (isPressed(BTN_U) && controllablePoint.y > 0) controllablePoint.y--;
      if (isPressed(BTN_D) && controllablePoint.y < GFX_H - 1) controllablePoint.y++;
      if (isPressed(BTN_L) && controllablePoint.x > 0) controllablePoint.x--;
      if (isPressed(BTN_R) && controllablePoint.x < GFX_W - 1) controllablePoint.x++;
    }
  }

  const colliding = isCollidingPointPoly(controllablePoint, targetPoly); // isCollidingPolyPoint(targetPoly, controllablePoint) would also be valid

  clearGfx(colliding ? COL_YEL : COL_BLK);
  drawPolygon(targetPoly.vertices, colliding ? COL_MAG : COL_CYN, colliding ? COL_MAG : COL_CYN);
  drawPixel(controllablePoint.x, controllablePoint.y, cyclingColor(ticks, 10));
  drawTextCentered(1, 'POINT-POLY', COL_RED);
}
