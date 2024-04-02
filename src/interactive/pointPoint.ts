import { Point } from '../shape';
import { isCollidingPointPoint } from '../collision';
import { cyclingColor, drawTextCentered } from '../main';

let controllablePoint: Point;
let targetPoint: Point;

export function init() {
  controllablePoint = { x: 30, y: 30 };
  targetPoint = { x: 32, y: 32 };
}

export function loop(ticks: number) {
  if (ticks % 5 === 0) {
    if (isPressed(BTN_A)) {
      targetPoint.x = randomInt(16, 48);
      targetPoint.y = randomInt(16, 48);
      controllablePoint.x = targetPoint.x - 2;
      controllablePoint.y = targetPoint.y - 2;
    }
    if (isPressed(BTN_U) && controllablePoint.y > 0) controllablePoint.y--;
    if (isPressed(BTN_D) && controllablePoint.y < GFX_H - 1) controllablePoint.y++;
    if (isPressed(BTN_L) && controllablePoint.x > 0) controllablePoint.x--;
    if (isPressed(BTN_R) && controllablePoint.x < GFX_W - 1) controllablePoint.x++;
  }

  const colliding = isCollidingPointPoint(controllablePoint, targetPoint);

  clearGfx(colliding ? COL_YEL : COL_BLK);
  drawPixel(targetPoint.x, targetPoint.y, COL_CYN);
  drawPixel(controllablePoint.x, controllablePoint.y, cyclingColor(ticks, 10));
  drawTextCentered(1, 'POINT-POINT', COL_RED);
}
