// Thêm hiệu ứng cho các phần tử fantasy
document.querySelectorAll('.fantasy-element').forEach(element => {
    const rotation = Math.random() * 20 - 10; // -10 đến 10 độ
    element.style.setProperty('--rotation', `${rotation}deg`);
});

// Thêm hiệu ứng cho nút
document.querySelectorAll('.menu-btn').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.animation = 'none';
        setTimeout(() => {
            this.style.animation = '';
        }, 10);
    });
});