import { Point, Circle } from '../shape';
import { isCollidingPointCircle } from '../collision';
import { cyclingColor, drawTextCentered } from '../main';

let controllablePoint: Point;
let targetCircle: Circle;

export function init() {
  controllablePoint = { x: 21, y: 21 };
  targetCircle = { x: 32, y: 32, radius: 11 };
}

export function loop(ticks: number) {
  if (ticks % 5 === 0) {
    if (isPressed(BTN_A)) {
      if ((isPressed(BTN_U) || isPressed(BTN_R)) && targetCircle.radius < 30) targetCircle.radius++;
      if ((isPressed(BTN_D) || isPressed(BTN_L)) && targetCircle.radius > 0) targetCircle.radius--;
    } else {
      if (isPressed(BTN_U) && controllablePoint.y > 0) controllablePoint.y--;
      if (isPressed(BTN_D) && controllablePoint.y < GFX_H - 1) controllablePoint.y++;
      if (isPressed(BTN_L) && controllablePoint.x > 0) controllablePoint.x--;
      if (isPressed(BTN_R) && controllablePoint.x < GFX_W - 1) controllablePoint.x++;
    }
  }

  const colliding = isCollidingPointCircle(controllablePoint, targetCircle); // isCollidingCirclePoint(targetCircle, controllablePoint) would also be valid

  clearGfx(colliding ? COL_YEL : COL_BLK);
  drawCircle(targetCircle.x, targetCircle.y, targetCircle.radius, colliding ? COL_MAG : COL_CYN, colliding ? COL_MAG : COL_CYN);
  drawPixel(controllablePoint.x, controllablePoint.y, cyclingColor(ticks, 10));
  drawTextCentered(1, 'POINT-CIRCLE', COL_RED);
}
