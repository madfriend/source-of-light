import { GameObject } from './GameObject';

import {
  darken,
  niceColor,
  closest,
  slope,
  angleBetween,
  combinations,
  myAngle,
  pointAtEdge,
  cornersBetween
} from './utils';

export class Block extends GameObject {
  constructor (x, y, width, height, color) {
    super(x, y, width, height, color);
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.shadowColor = darken(this.color, 30);

    this.lightX = null;
    this.lightY = null;

    this.screenWidth = null;
    this.screenHeight = null;
  }

  preDraw ({ lightX, lightY, screenWidth, screenHeight }) {
    this.lightX = lightX;
    this.lightY = lightY;
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
  }

  draw (screen) {
    screen.strokeStyle = 'rgba(0, 0, 0, 0.3)';

    // screen.shadowColor = this.shadowColor;
    // screen.shadowBlur = 4;
    // screen.shadowOffsetY = 1;

    if (this.shouldCastShadow()) this.drawShadow(screen);

    screen.fillStyle = this.color;

    screen.fillRect(
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  drawShadow (screen) {
    screen.lineWidth = 0.8;

    const a = [this.x, this.y];
    const b = [this.x + this.width, this.y];
    const c = [this.x + this.width, this.y + this.height];
    const d = [this.x, this.y + this.height];

    const l = [this.lightX, this.lightY];

    let max = -Infinity;
    let maxPair = [a, d];

    const points = [a, b, c, d];

    combinations([...Array(4).keys()]).forEach(([i, j]) => {
      if (i === j) return;
      const aBetween = myAngle(points[i], points[j], l);

      if (aBetween > max) {
        maxPair = [i, j];
        max = aBetween;
      }
    });

    const atEdge1 = pointAtEdge(l, points[maxPair[0]], this.screenWidth, this.screenHeight);
    const atEdge2 = pointAtEdge(l, points[maxPair[1]], this.screenWidth, this.screenHeight);

    screen.beginPath();
    screen.moveTo(...points[maxPair[0]]);
    screen.lineTo(...atEdge1);
    screen.lineTo(...atEdge2);

    // cornersBetween(atEdge1, atEdge2, l, this.screenWidth, this.screenHeight).forEach(corner => {
    //   screen.lineTo(...corner);
    // });

    screen.lineTo(...points[maxPair[1]]);

    screen.fillStyle = 'rgba(0, 0, 0, 0.4)'; // this.shadowColor;
    screen.fill();
  }

  shouldCastShadow () {
    return (
      this.lightX < this.x - 3 ||
      this.lightY < this.y - 3 ||

      this.lightX > this.x + this.width + 3 ||
      this.lightY > this.y + this.height + 3
    );
  }
}