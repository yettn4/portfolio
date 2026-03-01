
const canvas = document.getElementById('canvas-bg');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];

// Настройки
const particleCount = 60; // Количество точек
const connectionDistance = 150; // Дистанция соединения
const mouseDistance = 200; // Дистанция реакции на мышь

let mouse = { x: null, y: null };

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

window.addEventListener('resize', resize);

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5; // Скорость X
        this.vy = (Math.random() - 0.5) * 0.5; // Скорость Y
        this.size = Math.random() * 2 + 1;
        // Цвет: смесь Cyan и Purple
        this.color = Math.random() > 0.5 ? '#64ffda' : '#bd34fe';
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Отталкивание от границ
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Взаимодействие с мышью
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouseDistance) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (mouseDistance - distance) / mouseDistance;
            const directionX = forceDirectionX * force * 2; // Сила отталкивания
            const directionY = forceDirectionY * force * 2;

            this.x -= directionX;
            this.y -= directionY;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

function init() {
    particles = [];
    resize();
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // Рисуем линии между близкими точками
        for (let j = i; j < particles.length; j++) {
            let dx = particles[i].x - particles[j].x;
            let dy = particles[i].y - particles[j].y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                ctx.beginPath();
                // Прозрачность зависит от расстояния
                let opacity = 1 - (distance / connectionDistance);
                ctx.strokeStyle = `rgba(100, 255, 218, ${opacity * 0.2})`; // Cyan lines
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animate);
}

init();
animate();