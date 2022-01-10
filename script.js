const canvas = document.getElementById('canvas1');

const c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let particleArray = []
let adjustX = 5;
let adjustY = 5;

const mouse = {
    x: null,
    y: null,
    radius: 150
}

window.addEventListener('mousemove', function(event){
    mouse.x = event.x;
    mouse.y = event.y;
});

c.fillStyle = 'white';
c.font = '30px Verdana';
c.fillText('Ran.dev', 20, 60);
const textCoordinates = c.getImageData(0, 0, canvas.width, canvas.height)


class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 200 + 1)
    }
    draw() {
        c.fillStyle = '#ffffff';
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.closePath();
        c.fill();
    }

    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy)
        let forceDirectionX = dx / distance;
        let forceDirectionY = dy / distance;
        let maxDistance = mouse.radius;
        let force = (maxDistance - distance) / maxDistance;
        let directionX = forceDirectionX * force * this.density;
        let directionY = forceDirectionY * force * this.density;

        if (distance < mouse.radius) {
            this.x -= directionX;
            this.y -= directionY;
        } else {

            if(this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx;
            }

            if(this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy;
            }
        }
    }
}

function init() {
    particleArray = [];

    for (let y = 0, y2 = textCoordinates.height; y < y2; y++){
        for (let x = 0, x2 = textCoordinates.width; x < x2; x++){
            if(textCoordinates.data[(y * 4 * textCoordinates.width) + (x * 4) + 3] > 128){
                let positionX = x + adjustX;
                let positionY = y + adjustY; 
                particleArray.push(new Particle(positionX * 8, positionY * 8))
            }
        }
    }
    
}

init();

function animate() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i++) {
        particleArray[i].draw();
        particleArray[i].update();
    }
    //connect();
    requestAnimationFrame(animate);
}
animate();

function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particleArray.length; a++){
        for (let b = a; b < particleArray.length; b++){
            let dx = particleArray[a].x - particleArray[b].x;
            let dy = particleArray[a].y - particleArray[b].y;
            let distance = Math.sqrt(dx * dx + dy * dy)

            if(distance < 10) {
                opacityValue = 1 - (distance/50)
                c.strokeStyle = `rgba(255, 255, 255, ${opacityValue})`;
                c.lineWidth = 1;
                c.beginPath();
                c.moveTo(particleArray[a].x, particleArray[a].y);
                c.lineTo(particleArray[b].x, particleArray[b].y);
                c.stroke();
            }
        }
    }
}