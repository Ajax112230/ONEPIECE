document.addEventListener('DOMContentLoaded', function () {
  // === Elements ===
  var inputScreen = document.getElementById('input-screen');
  var resultScreen = document.getElementById('result-screen');
  var nameInput = document.getElementById('name-input');
  var searchBtn = document.getElementById('search-btn');
  var retryBtn = document.getElementById('retry-btn');
  var colorDisplay = document.getElementById('color-display');
  var colorName = document.getElementById('color-name');
  var colorHex = document.getElementById('color-hex');
  var colorRgb = document.getElementById('color-rgb');
  var poemText = document.getElementById('poem-text');
  var poemSource = document.getElementById('poem-source');
  var particleCanvas = document.getElementById('particle-canvas');

  // Init particles if available
  if (typeof initParticles === 'function') {
    initParticles(particleCanvas);
  }

  // === Show color result ===
  function showColor(name) {
    var color = getNameColor(name);

    // Fill in color data
    colorDisplay.style.backgroundColor = color.hex;
    colorName.textContent = color.name;
    colorHex.textContent = color.hex;
    colorRgb.textContent = 'RGB(' + color.r + ', ' + color.g + ', ' + color.b + ')';
    poemText.textContent = '「' + color.poem + '」';

    var sourceParts = [];
    if (color.poet) sourceParts.push(color.poet);
    if (color.dynasty && color.dynasty !== '—') sourceParts.push(color.dynasty);
    if (color.source) sourceParts.push('《' + color.source + '》');
    poemSource.textContent = '—— ' + sourceParts.join(' · ');

    // Update particles
    if (typeof updateParticleColor === 'function') {
      updateParticleColor(color.hex);
    }

    // Transition: fade out input
    inputScreen.classList.add('fade-out');

    // Show result
    resultScreen.classList.remove('hidden');

    // Trigger color display bloom after a tiny delay (for transition to fire)
    setTimeout(function () {
      colorDisplay.classList.add('show');
    }, 50);
  }

  function showInput() {
    // Hide color display bloom
    colorDisplay.classList.remove('show');

    // Fade out result screen
    resultScreen.style.opacity = '0';

    setTimeout(function () {
      resultScreen.classList.add('hidden');
      resultScreen.style.opacity = '';
    }, 600);

    // Show input
    inputScreen.classList.remove('fade-out');
    nameInput.value = '';
    nameInput.focus();

    // Reset particles
    if (typeof updateParticleColor === 'function') {
      updateParticleColor('#C9A96E');
    }
  }

  function handleSearch() {
    var name = nameInput.value.trim();
    if (!name) {
      nameInput.classList.add('shake');
      setTimeout(function () { nameInput.classList.remove('shake'); }, 500);
      nameInput.focus();
      return;
    }
    showColor(name);
  }

  // === Events ===
  searchBtn.addEventListener('click', handleSearch);
  nameInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') handleSearch();
  });
  retryBtn.addEventListener('click', showInput);

  // Auto focus
  nameInput.focus();
});
