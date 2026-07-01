/**
 * djb2 变种哈希：姓名 → 色库索引
 * 同一个名字永远得到同一个索引
 */
function getColorIndex(name, length) {
  var hash = 5381;
  for (var i = 0; i < name.length; i++) {
    hash = ((hash << 5) + hash + name.charCodeAt(i)) & 0x7fffffff;
  }
  return hash % length;
}

/**
 * @param {string} name - 用户输入的姓名
 * @returns {object} 颜色对象 { name, hex, r, g, b, poem, poet, dynasty, source }
 */
function getNameColor(name) {
  if (!name || !name.trim()) {
    // 空输入返回默认色：墨色
    return TRADITIONAL_COLORS[Math.floor(TRADITIONAL_COLORS.length * 0.618)];
  }
  var index = getColorIndex(name.trim(), TRADITIONAL_COLORS.length);
  return TRADITIONAL_COLORS[index];
}
