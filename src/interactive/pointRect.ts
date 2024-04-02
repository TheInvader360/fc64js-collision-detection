import { Point, Rect } from '../shape';
import { isCollidingPointRect } from '../collision';
import { cyclingColor, drawTextCentered } from '../main';

let controllablePoint: Point;
let targetRect: Rect;

export function init() {
  controllablePoint = { x: 14, y: 14 };
  targetRect = { x: 16, y: 16, width: 32, height: 32 };
}

export function loop(ticks: number) {
  if (ticks % 5 === 0) {
    if (isPressed(BTN_A)) {
      targetRect.width = randomInt(1, 60);
      targetRect.height = randomInt(1, 60);
      targetRect.x = 32 - targetRect.width / 2;
      targetRect.y = 32 - targetRect.height / 2;
      controllablePoint.x = targetRect.x - 2;
      controllablePoint.y = targetRect.y - 2;
    } else {
      if (isPressed(BTN_U) && controllablePoint.y > 0) controllablePoint.y--;
      if (isPressed(BTN_D) && controllablePoint.y < GFX_H - 1) controllablePoint.y++;
      if (isPressed(BTN_L) && controllablePoint.x > 0) controllablePoint.x--;
      if (isPressed(BTN_R) && controllablePoint.x < GFX_W - 1) controllablePoint.x++;
    }
  }

  const colliding = isCollidingPointRect(controllablePoint, targetRect); // isCollidingRectPoint(targetRect, controllablePoint) would also be valid

  clearGfx(colliding ? COL_YEL : COL_BLK);
  drawRectangle(targetRect.x, targetRect.y, targetRect.width, targetRect.height, colliding ? COL_MAG : COL_CYN, colliding ? COL_MAG : COL_CYN);
  drawPixel(controllablePoint.x, controllablePoint.y, cyclingColor(ticks, 10));
  drawTextCentered(1, 'POINT-RECT', COL_RED);
}
