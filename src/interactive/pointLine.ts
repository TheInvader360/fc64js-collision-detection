import { Point, Line } from '../shape';
import { isCollidingPointLine } from '../collision';
import { cyclingColor, drawTextCentered } from '../main';

let controllablePoint: Point;
let targetLine: Line;

export function init() {
  controllablePoint = { x: 30, y: 30 };
  targetLine = { x1: 16, y1: 48, x2: 48, y2: 16 };
}

export function loop(ticks: number) {
  if (ticks % 5 === 0) {
    if (isPressed(BTN_A)) {
      targetLine.x1 = randomInt(10, 54);
      targetLine.y1 = randomInt(10, 54);
      targetLine.x2 = randomInt(10, 54);
      targetLine.y2 = randomInt(10, 54);
      const slope = (targetLine.y1 - targetLine.y2) / (targetLine.x1 - targetLine.x2);
      controllablePoint.x = (targetLine.x1 + targetLine.x2) / 2 + (slope > 0 ? 4 : -4);
      controllablePoint.y = (targetLine.y1 + targetLine.y2) / 2 - 4;
    } else {
      if (isPressed(BTN_U) && controllablePoint.y > 0) controllablePoint.y--;
      if (isPressed(BTN_D) && controllablePoint.y < GFX_H - 1) controllablePoint.y++;
      if (isPressed(BTN_L) && controllablePoint.x > 0) controllablePoint.x--;
      if (isPressed(BTN_R) && controllablePoint.x < GFX_W - 1) controllablePoint.x++;
    }
  }

  const colliding = isCollidingPointLine(controllablePoint, targetLine); // isCollidingLinePoint(targetLine, controllablePoint) would also be valid

  clearGfx(colliding ? COL_YEL : COL_BLK);
  drawLine(targetLine.x1, targetLine.y1, targetLine.x2, targetLine.y2, colliding ? COL_MAG : COL_CYN);
  drawPixel(controllablePoint.x, controllablePoint.y, cyclingColor(ticks, 10));
  drawTextCentered(1, 'POINT-LINE', COL_RED);
}
