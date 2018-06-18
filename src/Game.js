import { Light } from './Light';
import { Block } from './Block';

import { niceColor, darken, distance, copyObjects } from './utils';

let isFirstDraw = true;

const LIGHT_X = 300;
const LIGHT_Y = 300;

const light = new Light(300, 300);

export class Game {
  constructor (canvas) {
    this.screen = canvas.getContext('2d');
    this.bounds = canvas.getBoundingClientRect();

    this.canvasWidth = canvas.width;
    this.canvasHeight = canvas.height;

    this.objects = [ light ];
    this.state = {
      lightX: LIGHT_X,
      lightY: LIGHT_Y,
      isDragging: false,
      screenWidth: this.canvasWidth,
      screenHeight: this.canvasHeight
    };

    this.tick = this.tick.bind(this);

    this.addMouseListeners();
  }

  start () {
    this._initialObjects = copyObjects(this.objects);
    this._timer = requestAnimationFrame(this.tick);
  }

  stop () {
    cancelAnimationFrame(this._timer);
  }

  resetScreen () {
    this.screen.shadowColor = null;
    this.screen.shadowBlur = 0;
    this.screen.shadowOffsetY = 0;
    this.screen.setLineDash([]);
    this.screen.globalAlpha = 1;
  }

  resetObjects () {
    isFirstDraw = true;
    this.objects = copyObjects(this._initialObjects);
  }

  draw () {
    this.screen.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.objects.forEach(object => {
      object.draw(this.screen);
      this.resetScreen();
    });

  }

  tick () {
    const hasChangingObjects = this.hasChangingObjects();

    this.preDraw();

    if (hasChangingObjects || isFirstDraw) {
      isFirstDraw = false;
      this.draw();
    }

    this._timer = requestAnimationFrame(this.tick);
  }

  preDraw () {
    this.objects.forEach(object => object.preDraw(this.state));
  }

  addObjects (objects) {
    this.objects.unshift(...objects);
  }

  hasChangingObjects () {
    return this.objects.filter(obj => !obj.isStatic()).length;
  }

  get blocks () {
    return this.objects.filter(isBlock);
  }

  get light () {
    return light;
  }

  addMouseListeners () {
    window.addEventListener('mousedown', this.onMousedown.bind(this));
    window.addEventListener('mousemove', this.onMousemove.bind(this));
    window.addEventListener('mouseup', this.onMouseup.bind(this));
  }

  onMousedown (e) {
    const xy = this.mouseXY(e);

    if (!this.onScreen(xy)) return false;

    if (!this.light.containsXY(xy)) return false;

    this.state.isDragging = true;

    this.state.lightX = this.light.x;
    this.state.lightY = this.light.y;
  }

  onMousemove (e) {
    if (!this.state.isDragging) return false;

    const xy = this.mouseXY(e);

    this.state.lightX = xy.x;
    this.state.lightY = xy.y;
  }

  onMouseup (e) {
    if (!this.state.isDragging) return false;

    this.state.isDragging = false;
  }

  mouseXY (e) {
    return {
      x: e.clientX - this.bounds.left,
      y: e.clientY - this.bounds.top
    };
  }

  onScreen ({x, y}) {
    return x >= 0 && y >= 0 &&
      x <= this.canvasWidth && y <= this.canvasHeight;
  }
}

function isBlock (b) { return b instanceof Block; }