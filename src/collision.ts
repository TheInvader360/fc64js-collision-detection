import { Point, Line, Circle, Rect, Poly } from './shape';
import { distance } from './maths';

// f(c,r) | POINT        | LINE         | CIRCLE       | RECT         | POLY         |
// -------+--------------+--------------+--------------+--------------+--------------+
// POINT  | PointPoint   | LinePoint*   | CirclePoint* | RectPoint*   | PolyPoint*   |
// -------+--------------+--------------+--------------+--------------+--------------+
// LINE   | PointLine    | LineLine     | CircleLine*  | RectLine*    | PolyLine*    |
// -------+--------------+--------------+--------------+--------------+--------------+
// CIRCLE | PointCircle  | LineCircle   | CircleCircle | RectCircle*  | PolyCircle*  |
// -------+--------------+--------------+--------------+--------------+--------------+
// RECT   | PointRect    | LineRect     | CircleRect   | RectRect     | PolyRect*    |
// -------+--------------+--------------+--------------+--------------+--------------+
// POLY   | PointPoly    | LinePoly     | CirclePoly   | RectPoly     | PolyPoly     |
// -------+--------------+--------------+--------------+--------------+--------------+

export const isCollidingPointPoint = (point1: Point, point2: Point): boolean => point1.x === point2.x && point1.y === point2.y;

export const isCollidingPointLine = (point: Point, line: Line, tolerance?: number): boolean => {
  const d1 = distance(point.x, point.y, line.x1, line.y1); // distance from point to one end of the line
  const d2 = distance(point.x, point.y, line.x2, line.y2); // distance from point to the other end of the line
  const len = distance(line.x1, line.y1, line.x2, line.y2); // length of the line
  const tol = tolerance || 0.1; // a higher tolerance means less accuracy
  return d1 + d2 >= len - tol && d1 + d2 <= len + tol;
};

export const isCollidingPointCircle = (point: Point, circle: Circle): boolean => {
  const x = point.x - circle.x;
  const y = point.y - circle.y;
  const r = applyRadiusModifier(circle.radius);
  return x * x + y * y <= r * r;
};

export const isCollidingPointRect = (point: Point, rect: Rect): boolean => point.x >= rect.x && point.x < rect.x + rect.width && point.y >= rect.y && point.y < rect.y + rect.height;

export const isCollidingPointPoly = (point: Point, poly: Poly): boolean => {
  let collision = false;
  // go through each of the vertices along with the next vertex in the list (wrapping back to zero at the end)
  let nextIndex = 0;
  for (let currentIndex = 0; currentIndex < poly.vertices.length; currentIndex++) {
    nextIndex = currentIndex + 1;
    if (nextIndex === poly.vertices.length) nextIndex = 0;
    const c = poly.vertices[currentIndex];
    const n = poly.vertices[nextIndex];
    // compare positions, flipping the collision variable back and forth
    if (((c.y >= point.y && n.y < point.y) || (c.y < point.y && n.y >= point.y)) && point.x < ((n.x - c.x) * (point.y - c.y)) / (n.y - c.y) + c.x) collision = !collision;
  }
  return collision;
};

export const isCollidingLinePoint = (line: Line, point: Point, tolerance?: number): boolean => isCollidingPointLine(point, line, tolerance);

export const isCollidingLineLine = (line1: Line, line2: Line): boolean => {
  // see https://paulbourke.net/geometry/pointlineplane/
  const uA = ((line2.x2 - line2.x1) * (line1.y1 - line2.y1) - (line2.y2 - line2.y1) * (line1.x1 - line2.x1)) / ((line2.y2 - line2.y1) * (line1.x2 - line1.x1) - (line2.x2 - line2.x1) * (line1.y2 - line1.y1));
  const uB = ((line1.x2 - line1.x1) * (line1.y1 - line2.y1) - (line1.y2 - line1.y1) * (line1.x1 - line2.x1)) / ((line2.y2 - line2.y1) * (line1.x2 - line1.x1) - (line2.x2 - line2.x1) * (line1.y2 - line1.y1));
  return uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1;
};

export const isCollidingLineCircle = (line: Line, circle: Circle): boolean => {
  const inside1 = isCollidingPointCircle({ x: line.x1, y: line.y1 }, circle);
  const inside2 = isCollidingPointCircle({ x: line.x2, y: line.y2 }, circle);
  if (inside1 || inside2) return true; // at least one of the line ends is inside the circle

  const len = distance(line.x1, line.y1, line.x2, line.y2); // length of the line
  const dotProduct = ((circle.x - line.x1) * (line.x2 - line.x1) + (circle.y - line.y1) * (line.y2 - line.y1)) / (len * len); // dot product of the line and circle
  const closestX = line.x1 + dotProduct * (line.x2 - line.x1); // closest point on the line (x axis)
  const closestY = line.y1 + dotProduct * (line.y2 - line.y1); // closest point on the line (y axis)

  if (!isCollidingPointLine({ x: closestX, y: closestY }, line)) return false; // point not on line segment

  return distance(closestX, closestY, circle.x, circle.y) <= applyRadiusModifier(circle.radius);
};

export const isCollidingLineRect = (line: Line, rect: Rect): boolean => {
  if (isCollidingPointRect({ x: line.x1, y: line.y1 }, rect)) return true;
  const collidingLeft = isCollidingLineLine(line, { x1: rect.x, y1: rect.y, x2: rect.x, y2: rect.y + rect.height });
  const collidingRight = isCollidingLineLine(line, { x1: rect.x + rect.width, y1: rect.y, x2: rect.x + rect.width, y2: rect.y + rect.height });
  const collidingTop = isCollidingLineLine(line, { x1: rect.x, y1: rect.y, x2: rect.x + rect.width, y2: rect.y });
  const collidingBottom = isCollidingLineLine(line, { x1: rect.x, y1: rect.y + rect.height, x2: rect.x + rect.width, y2: rect.y + rect.height });
  return collidingLeft || collidingRight || collidingTop || collidingBottom;
};

export const isCollidingLinePoly = (line: Line, poly: Poly): boolean => {
  // go through each of the vertices along with the next vertex in the list (wrapping back to zero at the end)
  let nextIndex = 0;
  for (let currentIndex = 0; currentIndex < poly.vertices.length; currentIndex++) {
    nextIndex = currentIndex + 1;
    if (nextIndex === poly.vertices.length) nextIndex = 0;
    const c = poly.vertices[currentIndex];
    const n = poly.vertices[nextIndex];
    // check if the line and line formed between the two vertices are colliding
    if (isCollidingLineLine({ x1: c.x, y1: c.y, x2: n.x, y2: n.y }, line)) return true;
  }
  // check if the line is inside the polygon
  if (isCollidingPointPoly({ x: line.x1, y: line.y1 }, poly)) return true;
  return false;
};

export const isCollidingCirclePoint = (circle: Circle, point: Point): boolean => isCollidingPointCircle(point, circle);

export const isCollidingCircleLine = (circle: Circle, line: Line): boolean => isCollidingLineCircle(line, circle);

export const isCollidingCircleCircle = (circle1: Circle, circle2: Circle): boolean => {
  const x = circle1.x - circle2.x;
  const y = circle1.y - circle2.y;
  const radii = circle1.radius + circle2.radius;
  return x * x + y * y <= radii * radii;
};

export const isCollidingCircleRect = (circle: Circle, rect: Rect): boolean => {
  let testX = circle.x;
  let testY = circle.y;

  if (circle.x < rect.x)
    testX = rect.x; // test rect's left edge
  else if (circle.x > rect.x + rect.width - 1) testX = rect.x + rect.width - 1; // test rect's right edge

  if (circle.y < rect.y)
    testY = rect.y; // test rect's top edge
  else if (circle.y > rect.y + rect.height - 1) testY = rect.y + rect.height - 1; // test rect's bottom edge

  const x = circle.x - testX;
  const y = circle.y - testY;
  const rad = applyRadiusModifier(circle.radius);
  return x * x + y * y <= rad * rad;
};

export const isCollidingCirclePoly = (circle: Circle, poly: Poly): boolean => {
  // go through each of the vertices along with the next vertex in the list (wrapping back to zero at the end)
  let nextIndex = 0;
  for (let currentIndex = 0; currentIndex < poly.vertices.length; currentIndex++) {
    nextIndex = currentIndex + 1;
    if (nextIndex === poly.vertices.length) nextIndex = 0;
    const c = poly.vertices[currentIndex];
    const n = poly.vertices[nextIndex];
    // check if the circle and line formed between the two vertices are colliding
    if (isCollidingLineCircle({ x1: c.x, y1: c.y, x2: n.x, y2: n.y }, circle)) return true;
  }
  // check if the circle is inside the polygon
  if (isCollidingPointPoly({ x: circle.x, y: circle.y }, poly)) return true;
  return false;
};

export const isCollidingRectPoint = (rect: Rect, point: Point): boolean => isCollidingPointRect(point, rect);

export const isCollidingRectLine = (rect: Rect, line: Line): boolean => isCollidingLineRect(line, rect);

export const isCollidingRectCircle = (rect: Rect, circle: Circle): boolean => isCollidingCircleRect(circle, rect);

export const isCollidingRectRect = (rect1: Rect, rect2: Rect): boolean => rect1.x + rect1.width > rect2.x && rect1.x < rect2.x + rect2.width && rect1.y + rect1.height > rect2.y && rect1.y < rect2.y + rect2.height;

export const isCollidingRectPoly = (rect: Rect, poly: Poly): boolean => {
  // go through each of the vertices along with the next vertex in the list (wrapping back to zero at the end)
  let nextIndex = 0;
  for (let currentIndex = 0; currentIndex < poly.vertices.length; currentIndex++) {
    nextIndex = currentIndex + 1;
    if (nextIndex === poly.vertices.length) nextIndex = 0;
    const c = poly.vertices[currentIndex];
    const n = poly.vertices[nextIndex];
    // check if the rectangle and line formed between the two vertices are colliding
    if (isCollidingLineRect({ x1: c.x, y1: c.y, x2: n.x, y2: n.y }, rect)) return true;
  }
  // check if the rectangle is inside the polygon
  if (isCollidingPointPoly({ x: rect.x, y: rect.y }, poly)) return true;
  return false;
};

export const isCollidingPolyPoint = (poly: Poly, point: Point): boolean => isCollidingPointPoly(point, poly);

export const isCollidingPolyLine = (poly: Poly, line: Line): boolean => isCollidingLinePoly(line, poly);

export const isCollidingPolyCircle = (poly: Poly, circle: Circle): boolean => isCollidingCirclePoly(circle, poly);

export const isCollidingPolyRect = (poly: Poly, rect: Rect): boolean => isCollidingRectPoly(rect, poly);

export const isCollidingPolyPoly = (poly1: Poly, poly2: Poly): boolean => {
  // go through each of the vertices along with the next vertex in the list (wrapping back to zero at the end)
  let nextIndex = 0;
  for (let currentIndex = 0; currentIndex < poly1.vertices.length; currentIndex++) {
    nextIndex = currentIndex + 1;
    if (nextIndex === poly1.vertices.length) nextIndex = 0;
    const c = poly1.vertices[currentIndex];
    const n = poly1.vertices[nextIndex];
    // check if the second polygon and line formed between the two vertices are colliding
    if (isCollidingLinePoly({ x1: c.x, y1: c.y, x2: n.x, y2: n.y }, poly2)) return true;
  }
  // check if the second polygon is inside the first polygon
  if (isCollidingPointPoly({ x: poly2.vertices[0].x, y: poly2.vertices[0].y }, poly1)) return true;
  return false;
};

const applyRadiusModifier = (radius: number): number => {
  // a rough hack to more closely (but imperfectly) match drawn circles - the collision area is either equal to or very slightly smaller than the drawn area
  // numbers arrived at through trial and error - as low as possible (up to 4 decimal places) to achieve highest possible fill without spilling over the drawn area
  let multiplier = 1.02;
  if (radius <= 30) multiplier = 1.0226;
  if (radius <= 29) multiplier = 1.0253;
  if (radius <= 28) multiplier = 1.0302;
  if (radius <= 27) multiplier = 1.0298;
  if (radius <= 26) multiplier = 1.0242;
  if (radius <= 25) multiplier = 1.0253;
  if (radius <= 24) multiplier = 1.0291;
  if (radius <= 23) multiplier = 1.0308;
  if (radius <= 22) multiplier = 1.0306;
  if (radius <= 21) multiplier = 1.0302;
  if (radius <= 20) multiplier = 1.0405;
  if (radius <= 19) multiplier = 1.0448;
  if (radius <= 18) multiplier = 1.0483;
  if (radius <= 17) multiplier = 1.0407;
  if (radius <= 16) multiplier = 1.0346;
  if (radius <= 15) multiplier = 1.0435;
  if (radius <= 14) multiplier = 1.0401;
  if (radius <= 13) multiplier = 1.0687;
  if (radius <= 12) multiplier = 1.0672;
  if (radius <= 11) multiplier = 1.0641;
  if (radius <= 10) multiplier = 1.0631;
  if (radius <= 9) multiplier = 1.0541;
  if (radius <= 8) multiplier = 1.0753;
  if (radius <= 7) multiplier = 1.1158;
  if (radius <= 6) multiplier = 1.1181;
  if (radius <= 5) multiplier = 1.1314;
  if (radius <= 4) multiplier = 1.1181;
  if (radius <= 3) multiplier = 1.2019;
  if (radius <= 2) multiplier = 1.1181;
  return radius * multiplier;
};
