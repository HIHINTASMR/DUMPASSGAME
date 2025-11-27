const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const creativeIcon = document.getElementById('creativeIcon');

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
const combat = new Combat(false);
const player = new Player(canvasW / 2, canvasH - 60, 'p1');

// Load background image
const background = new Image();
background.src = 'img/items/bg.png';

// Creative mode toggle
window.addEventListener('keydown', e => {
    if (e.code === 'KeyC' || e.key === 'c' || e.key === 'C') {
        player.creative = !player.creative;
        creativeIcon.style.display = player.creative ? 'block' : 'none';
    }
});

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
    Physics.updatePlayer(player, input.keys, canvasW, canvasH, dt);

    // Draw player
    player.draw(ctx);

    // Draw HUD
    HUD.drawSinglePlayerHUD(ctx, player);

    // Update projectiles
    combat.updateProjectiles(ctx, dt, canvasW);

    // Handle actions
    combat.handlePlayerActions(player, input, true);

    // Update stamina
    player.updateStamina(dt);

    // Check death
    if (player.isDead) {
        ctx.fillStyle = "red";
        ctx.font = "120px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("YOU DIE", canvasW / 2, canvasH / 2);
    }

    creativeIcon.style.display = player.creative ? 'block' : 'none';

    requestAnimationFrame(loop);
}

loop();