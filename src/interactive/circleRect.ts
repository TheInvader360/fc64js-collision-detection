import { Circle, Rect } from '../shape';
import { isCollidingCircleRect } from '../collision';
import { cyclingColor, drawTextCentered } from '../main';

let controllableCircle: Circle;
let targetRect: Rect;

export function init() {
  controllableCircle = { x: 24, y: 24, radius: 8 };
  targetRect = { x: 33, y: 33, width: 16, height: 16 };
}

export function loop(ticks: number) {
  if (ticks % 5 === 0) {
    if (isPressed(BTN_A)) {
      controllableCircle.radius = randomInt(0, 16);
      controllableCircle.x = 31 - controllableCircle.radius;
      controllableCircle.y = 31 - controllableCircle.radius;
      targetRect.width = randomInt(1, 30);
      targetRect.height = randomInt(1, 30);
      targetRect.x = 33;
      targetRect.y = 33;
    }
    if (isPressed(BTN_U) && controllableCircle.y > 0) controllableCircle.y--;
    if (isPressed(BTN_D) && controllableCircle.y < GFX_H - 1) controllableCircle.y++;
    if (isPressed(BTN_L) && controllableCircle.x > 0) controllableCircle.x--;
    if (isPressed(BTN_R) && controllableCircle.x < GFX_W - 1) controllableCircle.x++;
  }

  const colliding = isCollidingCircleRect(controllableCircle, targetRect); // isCollidingRectCircle(targetRect, controllableCircle) would also be valid

  clearGfx(colliding ? COL_YEL : COL_BLK);
  drawRectangle(targetRect.x, targetRect.y, targetRect.width, targetRect.height, colliding ? COL_MAG : COL_CYN, colliding ? COL_MAG : COL_CYN);
  drawCircle(controllableCircle.x, controllableCircle.y, controllableCircle.radius, cyclingColor(ticks, 10), colliding ? COL_CYN : COL_MAG);
  drawTextCentered(1, 'CIRCLE-RECT', COL_RED);
}
