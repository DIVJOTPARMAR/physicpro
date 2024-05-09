const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Events = Matter.Events;

const engine = Engine.create();
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        width: 800,
        height: 600,
        wireframes: false
    }
});

const ball = Bodies.circle(100, 100, 20, { restitution: 0.5 });
const ground = Bodies.rectangle(400, 600, 800, 50, { isStatic: true });
const coins = [
    Bodies.circle(200, 400, 10, { isStatic: true, render: { fillStyle: 'gold' } }),
    Bodies.circle(400, 300, 10, { isStatic: true, render: { fillStyle: 'gold' } }),
    Bodies.circle(600, 200, 10, { isStatic: true, render: { fillStyle: 'gold' } })
];
const obstacles = [
    Bodies.rectangle(300, 500, 100, 20, { isStatic: true }),
    Bodies.rectangle(500, 400, 100, 20, { isStatic: true })
];

World.add(engine.world, [ball, ground, ...coins, ...obstacles]);

document.body.addEventListener('keydown', function(event) {
    const { keyCode } = event;
    const { x, y } = ball.velocity;

    if (keyCode === 37) { // Left arrow key
        Body.setVelocity(ball, { x: x - 2, y });
    } else if (keyCode === 39) { // Right arrow key
        Body.setVelocity(ball, { x: x + 2, y });
    } else if (keyCode === 38) { // Up arrow key
        Body.setVelocity(ball, { x, y: y - 9 });
    } else if (keyCode === 40) { // Down arrow key
        Body.setVelocity(ball, { x, y: y + 9 });
    }
});

Events.on(engine, 'collisionStart', function(event) {
    const pairs = event.pairs;
    pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;
        if (coins.includes(bodyA)) {
            World.remove(engine.world, bodyA);
        } else if (coins.includes(bodyB)) {
            World.remove(engine.world, bodyB);
        }
    });
});

function checkGameOver() {
    if (ball.position.y > 600) { // If ball falls below the ground
        gameOver();
    }
}

function gameOver() {
    Engine.clear(engine);
    Render.stop(render);
    alert('Game Over! Your score was: ' + score);
}

let score = 0;

Events.on(engine, 'collisionStart', function(event) {
    const pairs = event.pairs;
    pairs.forEach(pair => {
        const { bodyA, bodyB } = pair;
        if (coins.includes(bodyA)) {
            World.remove(engine.world, bodyA);
            score++;
        } else if (coins.includes(bodyB)) {
            World.remove(engine.world, bodyB);
            score++;
        }
    });
});

Events.on(engine, 'afterUpdate', function(event) {
    checkGameOver();
});

Engine.run(engine);
Render.run(render);
