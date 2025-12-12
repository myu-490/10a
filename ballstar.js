const c = document.getElementById('c');
const ctx = c.getContext('2d');

// ===== パラメータだけで遊べる CONFIG =====
const CONFIG = {
  radius: 16,              // ボール半径
  speed:  220,             // 1秒あたりの速さ(px/sec)
  dir:    { x: 1, y: -1 }, // 初期方向（正/負）
  color:  '#7ef5e1',       // ボール色
  trail:  0.0              // 0.0: 残像なし, 0.15 で残像演出
};

// ===== 状態 =====
let x = c.width * 0.25, y = c.height * 0.5;
let vx = CONFIG.speed * CONFIG.dir.x;
let vy = CONFIG.speed * CONFIG.dir.y;

let last = performance.now();

function update(dt) {
  // 位置更新（dt は “秒”）
  x += vx * dt;
  y += vy * dt;

  // ===== TODO-1: 左右の壁で反射（vx を反転 & めり込み補正） =====
  const r = CONFIG.radius;

   if (x - r < 0) {
    x = r;
    vx *= -1;
  }
  if (x + r > c.width) {
    x = c.width - r;
    vx *= -1;
  }

  // ===== TODO-2: 上下の壁で反射（vy を反転 & めり込み補正） =====

  if (y - r < 0) {
    y = r;
    vy *= -1;
  }
  if (y + r > c.height) {
    y = c.height - r;
    vy *= -1;
  }

  //自分ルール
   const v = CONFIG.speed;
  const t = Math.min(1, Math.max(0, (v - 40) / 560)); 

  const palette = [
    [255,   0,   0], // 赤
    [255, 128,   0], // オレンジ
    [255, 255,   0], // 黄色
    [255, 255, 255], // 白
    [128, 255, 255]  // 水色
  ];

  const idx = t * (palette.length - 1);
  const i0 = Math.floor(idx);
  const i1 = Math.min(i0 + 1, palette.length - 1);
  const k = idx - i0;

  const c0 = palette[i0];
  const c1 = palette[i1];
  const rCol = Math.floor(c0[0] + (c1[0] - c0[0]) * k);
  const gCol = Math.floor(c0[1] + (c1[1] - c0[1]) * k);
  const bCol = Math.floor(c0[2] + (c1[2] - c0[2]) * k);

  CONFIG.color = `rgb(${rCol},${gCol},${bCol})`;
}

function draw() {
  // クリア or 残像
  if (CONFIG.trail > 0) {
    ctx.fillStyle = `rgba(15,23,48,${CONFIG.trail})`;
    ctx.fillRect(0,0,c.width,c.height);
  } else {
    ctx.clearRect(0,0,c.width,c.height);
  }

  // ボール
  ctx.fillStyle = CONFIG.color;
  ctx.beginPath();
  ctx.arc(x, y, CONFIG.radius, 0, Math.PI*2);
  ctx.fill();
}

function loop(now) {
  const dt = (now - last) / 1000; // 秒
  last = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

// ==== TODO-3:キーで微調整（任意）：上下で速さ、左右で半径 ====
addEventListener('keydown', e=>{
  if (e.key === 'ArrowUp') {
    CONFIG.speed = Math.min(600, CONFIG.speed + 20);
    const s = CONFIG.speed / Math.hypot(vx, vy);
    vx *= s; vy *= s;
  }
  if (e.key === 'ArrowDown') {
    CONFIG.speed = Math.max(40, CONFIG.speed - 20);
    const s = CONFIG.speed / Math.hypot(vx, vy);
    vx *= s; vy *= s;
  }
  if (e.key === 't') {
    CONFIG.trail = Math.min(0.5, CONFIG.trail + 0.05);
  }
  if (e.key === 'g') {
    CONFIG.trail = Math.max(0.0, CONFIG.trail - 0.05);
  }
});