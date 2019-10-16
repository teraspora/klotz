// Klotz - A Game written in ES6
// Author:  John Lynch
// October 2019



const randInt = n => Math.floor(n * Math.random());
// let randCol = _ => {
//     let rgb = [randInt(100) + 155, randInt(100) + 155, randInt(100) + 155];
//     rgb[randInt(3)] /= 8;
//     let [r, g, b] = rgb;
//     return `rgb(${r}, ${g}, ${b})`;
// };

const colours = ["#f5004a", "#2762ff", "#6359c0", "#36ff6a", "#044c3a", "#ffff00"];
let bullets = [];

const randCol = _ => colours[randInt(colours.length)];

const c = document.getElementById(`field`);
const [W, H] = [c.clientWidth, c.clientHeight];
let bulletid = 0;
let firing = false;

// Need this class to keep track of which sliders are active
class Ball {
    constructor(element, pos, vel, col) {
        this._element = element;
        this._id = +element.id.replace( /^\D+/g, '')
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
        [this._element.style.left, this._element.style.top] = [`${value.x.toString()}px`, `${(value.y + this._element.clientHeight).toString()}px`];
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

class Bullet extends Ball {
    constructor(element, pos, vel, col) {
        super(element, pos, vel, col);
    }    
}

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~    

let ball_count = 16;
const ball_zero = document.getElementById(`ball-zero`);
const main = document.querySelector(`main`);
const balls = Array(ball_count).fill().map((_, i) => {
    let new_ball_element = ball_zero.cloneNode(false);
    new_ball_element.id = `ball${i}`;
    main.appendChild(new_ball_element);
    let new_ball = new Ball(new_ball_element, {x: randInt(W), y: randInt(H)}, {vx: randInt(11) + 1, vy: randInt(11) + 1}, randCol());
    return new_ball;
});


function collide(b0, b1) {
    // Given 2 balls, examine their positions to determine if they're currenlt colliding.
    // Not accurate; ignores impact angle, multiple collisions, different sized balls etc.
    return Math.abs(b0.pos.x - b1.pos.x) < b0.element.offsetWidth && Math.abs(b0.pos.y - b1.pos.y) < b0.element.offsetHeight;
}

let n = 0;
function render() {
    for (let ball of balls) {
        const {vx, vy} = ball.vel;
        if (ball.pos.x >= W - ball.element.offsetWidth) {
            ball.vel.vx = -Math.abs(vx);
        }
        if (ball.pos.y >= H - ball.id * ball.element.offsetHeight) {
            ball.vel.vy = -Math.abs(vy);
        }
        if (ball.pos.x <= 0) {
            ball.vel.vx = Math.abs(vx);
        }
        if (ball.pos.y <= 0) {
            ball.vel.vy = Math.abs(vy);
        }
        ball.pos = {x: ball.pos.x + ball.vel.vx, y: ball.pos.y + ball.vel.vy};
    }
    [...balls].sort((b0, b1) => b0.pos.x == b1.pos.x ? b0.pos.y - b1.pos.y : b0.pos.x - b1.pos.x).forEach((ball, index, blist) => {
        if (index < blist.length - 1) {
            const other_ball = blist[index + 1];
            if (collide(ball, other_ball)) {
                let {vx, vy} = ball.vel;
                ball.vel = {vx: -vx, vy: -vy};
                ({vx, vy} = other_ball.vel);
                other_ball.vel = {vx: -vx, vy: -vy};
            }
        }
    });

    bullets.forEach(bullet => {
        bullet.pos = {x: bullet.pos.x + bullet.vel.vx, y: bullet.pos.y - bullet.vel.vy};
        if (bullet.pos.y < -500) {
            bullet.element.remove();
            bullets.splice(bullets.indexOf(bullet), 1);
        }
    });
    requestAnimationFrame(render);
}

// Create gun
const gun = document.createElement(`div`);
const gunwidth = 40;
main.appendChild(gun);
let gunpos = (W - gunwidth) / 2;
gun.style.position = "relative";
gun.style.width = `${gunwidth}px`;
gun.style.height = `10px`;
gun.style.backgroundColor  = `red`;
gun.style.left = `${gunpos}px`;
gun.style.top = `${gun.parentElement.offsetHeight - gun.offsetHeight - 40}px`;

// ADD EVENT LISTENERS TO MOVE GUN ON [] input AND FIRE ON SPACE
window.addEventListener('keydown', ev => {
    key = ev.key || ev.keyCode;   // keyCode is an older standard
    switch (key) {
        case "[":
            gunpos -= 20;
            gun.style.left = `${gunpos}px`;   // transform =(translateX();
            break;
        case "]":
            gunpos += 20;
            gun.style.left = `${gunpos}px`;   // transform =(translateX();
            break;
        case " ":
        firing = true;
            const bulletwidth = 12;
            const bulletpos = gunpos + gunwidth / 2 - bulletwidth / 2;
            const new_bullet_element = document.createElement(`div`);
            new_bullet_element.id = `bullet${bulletid++}`
            const bullet = new Bullet(new_bullet_element, {x: bulletpos, y: 300}, {vx: 0, vy: 12}, 'green');
            bullets.push(bullet);
            new_bullet_element.style.position = "relative";
            new_bullet_element.style.width = `${bulletwidth}px`;
            new_bullet_element.style.height = `40px`;
            new_bullet_element.style.backgroundColor  = bullet.col;
            new_bullet_element.style.left = `${bulletpos}px`;
            new_bullet_element.style.top = `${bullet.pos.y}px`; //  `${gun.style.top + 100}px`; // DEBUG STAT      `${bullet.parentElement.offsetHeight - bullet.offsetHeight - 40}px`;
            new_bullet_element.style.zIndex = 255;
            new_bullet_element.style.borderTopLeftRadius = `50%`;
            new_bullet_element.style.borderTopRightRadius = `50%`;
            main.appendChild(new_bullet_element);
            break;
        default:
            ;
            break;
    }        
});


render();
