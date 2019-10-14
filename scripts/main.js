// Klotz - A Game written in ES6
// Author:  John Lynch
// October 2019




const [W, H] = [800, 800];
const c = document.querySelector(`canvas`);
[c.width, c.height] = [W, H];


// Need this class to keep track of which sliders are active
class Ball {
    constructor(element, pos, vel, col) {
        this._element = element;
        this._id = parseInt(element.id.slice(4))
        this._pos = pos;
        this._vel = vel;
        this._col = col;
        this._element.style.backgroundColor = col;
    }
    get element() {
        return this._element;
    }
    set element(value) {
        this._element = value;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }    
    get pos() {
        return this._pos;
    }
    set pos(value) {
        [this._element.style.left, this._element.style.top] = [`${value.x.toString()}px`, `${-(value.y + this._element.clientHeight).toString()}px`];
        this._pos = value;
    }
    get vel() {
        return this._vel;
    }
    set vel(value) {
        this._vel = value;
    }
    get col() {
        return this._col;
    }
    set col(value) {
        this._col = value;
    }
}

const ball = new Ball(document.getElementById(`ball01`), {x: 0, y: 0}, {x: 3, y: 3}, `var(--ball-col)`);
n = 0;
function render() {
    ball.pos = {x: ball.pos.x + ball.vel.x, y: ball.pos.y + ball.vel.y};
    requestAnimationFrame(render);
}

render();
