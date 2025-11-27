function clamp(v, a, b) {
    return Math.min(Math.max(v, a), b);
}

function getGround(canvasH) {
    return canvasH - 60; // Điều chỉnh cho phù hợp với chiều cao player mới
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

// Hàm kiểm tra va chạm giữa hai hình chữ nhật
function rectRectCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Hàm kiểm tra va chạm giữa hình tròn và hình chữ nhật
function circleRectCollision(circle, rect) {
    const closestX = clamp(circle.x, rect.x, rect.x + rect.width);
    const closestY = clamp(circle.y, rect.y, rect.y + rect.height);
    const distanceX = circle.x - closestX;
    const distanceY = circle.y - closestY;
    return (distanceX * distanceX + distanceY * distanceY) < (circle.radius * circle.radius);
}