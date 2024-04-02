import { Rect, Poly, generateVertices } from '../shape';
import { isCollidingRectPoly } from '../collision';
import { cyclingColor, drawTextCentered } from '../main';

let controllableRect: Rect;
let targetPolyVertexCount: number;
let targetPoly: Poly;

export function init() {
  controllableRect = { x: 2, y: 2, width: 8, height: 8 };
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
      if (isPressed(BTN_L)) {
        controllableRect.width = randomInt(1, 16);
        controllableRect.height = randomInt(1, 16);
        controllableRect.x = 2;
        controllableRect.y = 2;
      }
      if (isPressed(BTN_R)) {
        controllableRect.width = randomInt(32, 60);
        controllableRect.height = randomInt(32, 60);
        controllableRect.x = 62 - controllableRect.width;
        controllableRect.y = 62 - controllableRect.height;
      }
      targetPoly.vertices = generateVertices(32, 32, 10, 25, targetPolyVertexCount);
    } else {
      if (isPressed(BTN_U) && controllableRect.y > 0) controllableRect.y--;
      if (isPressed(BTN_D) && controllableRect.y + controllableRect.height < GFX_H) controllableRect.y++;
      if (isPressed(BTN_L) && controllableRect.x > 0) controllableRect.x--;
      if (isPressed(BTN_R) && controllableRect.x + controllableRect.width < GFX_W) controllableRect.x++;
    }
  }

  const colliding = isCollidingRectPoly(controllableRect, targetPoly); // isCollidingPolyRect(targetPoly, controllableRect) would also be valid

  clearGfx(colliding ? COL_YEL : COL_BLK);
  drawPolygon(targetPoly.vertices, colliding ? COL_MAG : COL_CYN, colliding ? COL_MAG : COL_CYN);
  drawRectangle(controllableRect.x, controllableRect.y, controllableRect.width, controllableRect.height, cyclingColor(ticks, 10), colliding ? COL_CYN : COL_MAG);
  drawTextCentered(1, 'RECT-POLY', COL_RED);
}
