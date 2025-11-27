class InputHandler {
    constructor() {
        this.keys = {};
        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('keydown', e => {
            this.keys[e.code] = true;
            // Chỉ lưu key thường cho P1, không lưu cho P2 để tránh trùng lặp
            if (!e.code.startsWith('Numpad')) {
                this.keys[e.key] = true;
                this.keys[e.key.toLowerCase()] = true;
            }
        });

        window.addEventListener('keyup', e => {
            this.keys[e.code] = false;
            // Chỉ xóa key thường cho P1, không xóa cho P2 để tránh trùng lặp
            if (!e.code.startsWith('Numpad')) {
                this.keys[e.key] = false;
                this.keys[e.key.toLowerCase()] = false;
            }
        });
    }

    isKeyPressed(key) {
        return this.keys[key] || false;
    }

    clearKey(key) {
        this.keys[key] = false;
        // Chỉ clear các biến thể của key cho P1, không clear cho P2 để tránh trùng lặp
        if (!key.startsWith('Numpad')) {
            if (key.startsWith('Key')) {
                const char = key.slice(3).toLowerCase();
                this.keys[char] = false;
            } else if (key.startsWith('Digit')) {
                const num = key.slice(5);
                this.keys[num] = false;
            }
        }
    }
}