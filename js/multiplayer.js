const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

let canvasW = window.innerWidth;
let canvasH = window.innerHeight;

canvas.width = canvasW;
canvas.height = canvasH;

window.addEventListener('resize', () => {
    canvasW = window.innerWidth;
    canvasH = window.innerHeight;
    canvas.width = canvasW;
    canvas.height = canvasH;
});

const input = new InputHandler();
const combat = new Combat(true);

// Create players với type tương ứng
const player1 = new Player(canvasW * 0.25, canvasH - 60, 'p1', 'blue');
const player2 = new Player(canvasW * 0.75, canvasH - 60, 'p2', 'red');

// Load background image
const background = new Image();
background.src = 'img/items/bg.png';

let last = performance.now();

function loop() {
    const now = performance.now();
    const dt = (now - last) / 1000;
    last = now;

    ctx.clearRect(0, 0, canvasW, canvasH);

    // Vẽ background
    if (background.complete) {
        ctx.drawImage(background, 0, 0, canvasW, canvasH);
    } else {
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvasW, canvasH);
    }

    // Update physics
    Physics.updatePlayer(player1, input.keys, canvasW, canvasH, dt, true);
    Physics.updatePlayer2(player2, input.keys, canvasW, canvasH, dt);

    // Draw players
    player1.draw(ctx);
    player2.draw(ctx);

    // Draw HUD
    HUD.drawMultiplayerHUD(ctx, player1, player2, canvasW);

    // Update projectiles
    combat.updateProjectiles(ctx, dt, canvasW);

    // Handle actions
    combat.handlePlayerActions(player1, input, true);
    combat.handlePlayerActions(player2, input, false);

    // Check projectile collisions
    combat.checkProjectileCollision(player1);
    combat.checkProjectileCollision(player2);

    // Update stamina
    player1.updateStamina(dt);
    player2.updateStamina(dt);

    // Check win conditions for PVP
    if (player1.isDead && !player2.isDead) {
        ctx.fillStyle = "red";
        ctx.font = "120px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("P2 WIN", canvasW / 2, canvasH / 2);
    } else if (player2.isDead && !player1.isDead) {
        ctx.fillStyle = "red";
        ctx.font = "120px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("P1 WIN", canvasW / 2, canvasH / 2);
    } else if (player1.isDead && player2.isDead) {
        ctx.fillStyle = "red";
        ctx.font = "120px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("DRAW", canvasW / 2, canvasH / 2);
    }

    requestAnimationFrame(loop);
}

loop();