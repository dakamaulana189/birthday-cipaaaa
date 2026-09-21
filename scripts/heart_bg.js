// Script Animasi Background Hati ala Pygame untuk Website
const canvas = document.createElement('canvas');
canvas.id = 'heartCanvas';
canvas.style.position = 'fixed';
canvas.style.top = '0';
canvas.style.left = '0';
canvas.style.width = '100vw';
canvas.style.height = '100vh';
canvas.style.zIndex = '-2'; // Supaya berada di belakang bintang jatuh dan konten utama
canvas.style.pointerEvents = 'none'; // Supaya tidak mengganggu klik mouse
document.body.appendChild(canvas);

const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const WORDS = ["love you", "Love You", "LOVE YOU"];
const COLORS = [
    'rgb(70, 130, 180)',
    'rgb(30, 144, 255)',
    'rgb(0, 191, 255)',
    'rgb(100, 149, 237)',
    'rgb(65, 105, 225)'
];

const particles = [];
const numOutline = 120;
const numFill = 90;
const scaleFactor = Math.min(window.innerWidth, window.innerHeight) / 65;

// Rumus Matematika Hati
function heartXY(t) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    return { x: x, y: -y };
}

function toScreen(x, y) {
    return {
        x: x * scaleFactor + canvas.width / 2,
        y: y * scaleFactor + canvas.height / 2
    };
}

// Inisialisasi Partikel Outline
for (let i = 0; i < numOutline; i++) {
    const t = (i / numOutline) * 2 * Math.PI;
    const b = heartXY(t);
    const pos = toScreen(b.x, b.y);
    particles.push({
        x: pos.x,
        y: pos.y,
        word: WORDS[Math.floor(Math.random() * WORDS.length)],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: 0,
        maxAlpha: Math.random() * 100 + 155,
        flickerSpeed: Math.random() * 0.05 + 0.02,
        flickerOffset: Math.random() * Math.PI * 2,
        delay: i * 2,
        size: 14
    });
}

// Inisialisasi Partikel Fill (Isi)
for (let i = 0; i < numFill; i++) {
    const t = Math.random() * 2 * Math.PI;
    const r = Math.random() * 0.85;
    const b = heartXY(t);
    const pos = toScreen(b.x * r, b.y * r);
    particles.push({
        x: pos.x,
        y: pos.y,
        word: WORDS[Math.floor(Math.random() * WORDS.length)],
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: 0,
        maxAlpha: Math.random() * 100 + 155,
        flickerSpeed: Math.random() * 0.05 + 0.02,
        flickerOffset: Math.random() * Math.PI * 2,
        delay: numOutline * 2 + i * 1.5,
        size: 12
    });
}

let frame = 0;

function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // Efek jejak / trail tipis
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    frame++;

    particles.forEach(p => {
        if (frame > p.delay) {
            if (p.alpha < p.maxAlpha) {
                p.alpha += 3;
            }

            // Efek kedip (flicker)
            const flicker = 0.75 + 0.25 * Math.sin(frame * p.flickerSpeed + p.flickerOffset);
            const currentAlpha = Math.min(255, p.alpha * flicker);

            ctx.save();
            ctx.font = `bold ${p.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Efek Glow / Cahaya
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 10;
            ctx.globalAlpha = currentAlpha / 255;
            ctx.fillStyle = p.color;

            ctx.fillText(p.word, p.x, p.y);
            ctx.restore();
        }
    });

    requestAnimationFrame(animate);
}

animate();