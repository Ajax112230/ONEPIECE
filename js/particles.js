/**
 * 水墨粒子背景动画
 * 60+ 个低密度漂浮粒子，颜色跟随当前色卡
 */
var _ctx, _canvas, _particles = [];
var _PARTICLE_COUNT = 65;
var _currentColor = { r: 201, g: 169, b: 110 }; // 默认金色

function initParticles(canvasEl) {
  _canvas = canvasEl;
  _ctx = _canvas.getContext('2d');
  _resizeParticles();
  window.addEventListener('resize', _resizeParticles);

  for (var i = 0; i < _PARTICLE_COUNT; i++) {
    _particles.push(_spawnParticle());
  }

  _animate();
}

function _resizeParticles() {
  _canvas.width = window.innerWidth;
  _canvas.height = window.innerHeight;
}

function _spawnParticle() {
  return {
    x: Math.random() * (_canvas.width || window.innerWidth),
    y: Math.random() * (_canvas.height || window.innerHeight),
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    size: Math.random() * 2 + 0.6,
    opacity: Math.random() * 0.3 + 0.05,
    phase: Math.random() * Math.PI * 2
  };
}

function updateParticleColor(hex) {
  var r = parseInt(hex.slice(1, 3), 16);
  var g = parseInt(hex.slice(3, 5), 16);
  var b = parseInt(hex.slice(5, 7), 16);
  _currentColor = { r: r, g: g, b: b };
  // 涟漪加速
  for (var i = 0; i < _particles.length; i++) {
    _particles[i].vx += (Math.random() - 0.5) * 1.5;
    _particles[i].vy += (Math.random() - 0.5) * 1.5;
  }
}

function _animate() {
  _ctx.clearRect(0, 0, _canvas.width, _canvas.height);

  var t = Date.now() * 0.001;
  for (var i = 0; i < _particles.length; i++) {
    var p = _particles[i];

    // 移动
    p.x += p.vx;
    p.y += p.vy;

    // 边界环绕
    if (p.x < -20) p.x = _canvas.width + 20;
    if (p.x > _canvas.width + 20) p.x = -20;
    if (p.y < -20) p.y = _canvas.height + 20;
    if (p.y > _canvas.height + 20) p.y = -20;

    // 阻尼
    p.vx *= 0.9995;
    p.vy *= 0.9995;

    // 微调颜色
    var rr = Math.min(255, Math.max(0, Math.round(_currentColor.r + Math.sin(p.phase + t) * 30)));
    var gg = Math.min(255, Math.max(0, Math.round(_currentColor.g + Math.cos(p.phase + t * 1.3) * 30)));
    var bb = Math.min(255, Math.max(0, Math.round(_currentColor.b + Math.sin(p.phase + t * 0.7) * 30)));

    _ctx.beginPath();
    _ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    _ctx.fillStyle = 'rgba(' + rr + ',' + gg + ',' + bb + ',' + p.opacity + ')';
    _ctx.fill();
  }

  requestAnimationFrame(_animate);
}
