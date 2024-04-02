import { Line } from '../shape';
import { isCollidingLineLine } from '../collision';
import { cyclingColor, drawTextCentered } from '../main';

let controllableLine1: Line;
let controllableLine2: Line;
let currentVertex: number;

export function init() {
  controllableLine1 = { x1: 4, y1: 8, x2: 38, y2: 28 };
  controllableLine2 = { x1: 14, y1: 56, x2: 56, y2: 24 };
  currentVertex = 1;
}

export function loop(ticks: number) {
  if (ticks % 5 === 0) {
    if (isPressed(BTN_A)) {
      currentVertex = wrap(currentVertex + 1, 1, 5);
    } else {
      if (currentVertex === 1) {
        if (isPressed(BTN_U) && controllableLine1.y1 > 0) controllableLine1.y1--;
        if (isPressed(BTN_D) && controllableLine1.y1 < GFX_H - 1) controllableLine1.y1++;
        if (isPressed(BTN_L) && controllableLine1.x1 > 0) controllableLine1.x1--;
        if (isPressed(BTN_R) && controllableLine1.x1 < GFX_W - 1) controllableLine1.x1++;
      }
      if (currentVertex === 2) {
        if (isPressed(BTN_U) && controllableLine1.y2 > 0) controllableLine1.y2--;
        if (isPressed(BTN_D) && controllableLine1.y2 < GFX_H - 1) controllableLine1.y2++;
        if (isPressed(BTN_L) && controllableLine1.x2 > 0) controllableLine1.x2--;
        if (isPressed(BTN_R) && controllableLine1.x2 < GFX_W - 1) controllableLine1.x2++;
      }
      if (currentVertex === 3) {
        if (isPressed(BTN_U) && controllableLine2.y1 > 0) controllableLine2.y1--;
        if (isPressed(BTN_D) && controllableLine2.y1 < GFX_H - 1) controllableLine2.y1++;
        if (isPressed(BTN_L) && controllableLine2.x1 > 0) controllableLine2.x1--;
        if (isPressed(BTN_R) && controllableLine2.x1 < GFX_W - 1) controllableLine2.x1++;
      }
      if (currentVertex === 4) {
        if (isPressed(BTN_U) && controllableLine2.y2 > 0) controllableLine2.y2--;
        if (isPressed(BTN_D) && controllableLine2.y2 < GFX_H - 1) controllableLine2.y2++;
        if (isPressed(BTN_L) && controllableLine2.x2 > 0) controllableLine2.x2--;
        if (isPressed(BTN_R) && controllableLine2.x2 < GFX_W - 1) controllableLine2.x2++;
      }
    }
  }

  const colliding = isCollidingLineLine(controllableLine1, controllableLine2);

  clearGfx(colliding ? COL_YEL : COL_BLK);
  drawLine(controllableLine2.x1, controllableLine2.y1, controllableLine2.x2, controllableLine2.y2, colliding ? COL_MAG : COL_CYN);
  drawLine(controllableLine1.x1, controllableLine1.y1, controllableLine1.x2, controllableLine1.y2, colliding ? COL_CYN : COL_MAG);
  const color = cyclingColor(ticks, 10);
  if (currentVertex === 1) drawCircle(controllableLine1.x1, controllableLine1.y1, 1, color);
  if (currentVertex === 2) drawCircle(controllableLine1.x2, controllableLine1.y2, 1, color);
  if (currentVertex === 3) drawCircle(controllableLine2.x1, controllableLine2.y1, 1, color);
  if (currentVertex === 4) drawCircle(controllableLine2.x2, controllableLine2.y2, 1, color);
  drawTextCentered(1, 'LINE-LINE', COL_RED);
}
