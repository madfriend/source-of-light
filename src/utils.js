import convert from 'color-convert';

export function within (a, b, c) {
  return a >= b && a <= c;
}

export function clamp (a, min, max) {
  if (a < min) return min;
  if (a > max) return max;
  return a;
}

export function trajectory (x1, y1, x2, y2) {
  let delta = (Math.sign(y2 - y1) || Math.sign(x2 - x1) || 1) * 8;

  if (x1 === x2) {
    return (x, y) => { return [x, y + delta] };
  }

  const a = y2 === y1 ? 0 : (y2 - y1) / (x2 - x1);
  const b = y1 - a * x1;

  delta = a === 0 ? delta : delta / a;
  delta = clamp(delta, -8, 8);

  return (x, y) => { return [x + delta, a * (x + delta) + b] };
}

export function distance (x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

let current = 160;
const step = 33;
const s = 50;
const l = 60;

export function niceColor () {
  current = (current + step) % 255;
  return '#' + convert.hsl.hex(current, s, l);
}

export function darken (hexstr, value) {
  const hsl = convert.hex.hsl(hexstr.substr(1));
  return '#' + convert.hsl.hex(
    hsl[0],
    hsl[1],
    clamp(hsl[2] - value, 0, +Infinity) % 255
  );
}

export function lighten (hexstr, value) {
  const hsl = convert.hex.hsl(hexstr.substr(1));
  return '#' + convert.hsl.hex(
    hsl[0],
    hsl[1],
    clamp(hsl[2] + value, 0, +Infinity) % 255
  );
}

export function copyObjects (objects) {
  return objects.map(o => o.copy(o.constructor.name));
}

export function closest([x, y], [...points]) {
  let minD = +Infinity;
  let minPoint = points[0];

  for (var i = 0; i < points.length; i++) {
    const d = distance(x, y, points[i][0], points[i][1]);
    if (d < minD) {
      minPoint = points[i];
      minD = d;
    }
  }

  return minPoint;
}

export function middlePoint([x1, y1], [x2, y2]) {
  return [ (x1 + x2) / 2, (y1 + y2) / 2 ];
}

export function slope ([x1, y1], [x2, y2]) {
  const numerator = y2 - y1;
  const denominator = x2 - x1;

  if (!denominator) return 0;
  return numerator / denominator;
}

export function angleBetween(a, b) {
  return rad2deg(Math.atan2(a - b, 1 + a * b)).toFixed(4);
}

function rad2deg (radians) {
  return radians * 180 / Math.PI;
};

export function combinations (list) {
  let result = new Set();

  list.forEach((_, i) => {
    list.forEach((_, j) => {
      if (j >= i) result.add([i, j]);
    });
  });

  return result;
}

export function myAngle (...args) {
  return rad2deg(
    findAngle(...args)
  );
}

export function findAngle([x1, y1], [x2, y2], [cx, cy]) {
    const p0c = Math.sqrt(
      Math.pow(cx - x1, 2) + Math.pow(cy - y1, 2));
    const p1c = Math.sqrt(
      Math.pow(cx - x2, 2) + Math.pow(cy - y2, 2));
    const p0p1 = Math.sqrt(
      Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

    return Math.acos((p1c * p1c + p0c * p0c - p0p1 * p0p1) / (2 * p1c * p0c));
}

export function pointAtEdge ([x1, y1], [x2, y2], maxX, maxY) {
  const trj = trajectory(x1, y1, x2, y2);

  let curX = x2, curY = y2;

  while (curX > -9999 && curX < 9999 && curY > -9999 && curY < 9999) {
    [curX, curY] = trj(curX, curY);
  }

  return [ curX, curY ];
}

export function cornersBetween ([x1, y1], [x2, y2], [lx, ly], maxX, maxY) {
  // if both points share an edge, there are no corners between
  if ((x1 <= 0 && x2 <= 0) ||
     (x1 >= maxX && x2 >= maxX) ||
     (y1 <= 0 && y2 <= 0) ||
     (y1 >= maxY && y2 >= maxY)) return [];

  let corners = [];

  // 0, 0


  return corners;
}