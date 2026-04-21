let colors = ["#2ec4b6", "#e71d36", "#ff9f1c"];
let anemoneData = [];
let bubbles = [];

// 滑鼠座標初始化
let mx = 0;
let my = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);
    
    mx = width / 2;
    my = height / 2;

    generateAnemoneData();

    // 連結 HTML 中的透明層
    const overlay = document.getElementById('mouseOverlay');
    if (overlay) {
        overlay.addEventListener('mousemove', (e) => {
            mx = e.clientX;
            my = e.clientY;
        });
    }
}

function generateAnemoneData() {
    anemoneData = [];
    const baseSpacing = 35;
    const count = Math.floor(width / baseSpacing) + 1;
    
    for (let i = 0; i < count; i++) {
        let ratio = i / count;
        anemoneData.push({
            ratio: ratio,
            id: i,
            color: colors[i % colors.length],
            strokeWeight: random(20, 40),
            height: random(height * 0.2, height * 0.5),
            amplitude: random(50, 150)
        });
    }
}

function updateBubbles() {
    if (random() < 0.05) {
        bubbles.push({
            x: random(width),
            y: height + 20,
            r: random(5, 15),
            speed: random(1, 3)
        });
    }

    for (let i = bubbles.length - 1; i >= 0; i--) {
        let b = bubbles[i];
        b.y -= b.speed;
        fill(255, 100);
        noStroke();
        circle(b.x, b.y, b.r);
        if (b.y < -20) bubbles.splice(i, 1);
    }
}

function drawAnemone(data) {  
    let baseX = data.ratio * width;
    stroke(data.color);
    strokeWeight(data.strokeWeight);
    noFill();

    beginShape();
    for(let i = 0; i < 20; i++){
        let p = i / 20;
        let wave = sin(frameCount * 0.03 + i * 0.2 + data.id) * 30;
        let topSwing = wave * pow(p, 2);

        // 滑鼠互動：靠近時海草會向兩邊避開或跟隨
        let distToMouse = abs(mx - baseX);
        let influence = map(distToMouse, 0, 300, 1, 0, true);
        let mouseForce = (mx - baseX) * 0.5;

        let x = baseX + topSwing + (mouseForce * influence * p);
        let y = height - (p * data.height);
        curveVertex(x, y);
    }
    endShape();
}

function draw() {
    clear(); // ⭐ 關鍵：清除背景變成透明，才能看到後面的網站

    for (let i = 0; i < anemoneData.length; i++) {
        drawAnemone(anemoneData[i]);
    }

    updateBubbles();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    generateAnemoneData();
}