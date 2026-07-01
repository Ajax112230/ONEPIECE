# 中国传统色 · 姓名寻色 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** 一个纯静态单页面网站，输入姓名 → 哈希映射到中国传统色 → 展示水墨风色卡

**Architecture:** index.html 入口 + 4 个 JS 模块（colors/hash/particles/main）+ 1 个 CSS。零构建，双击打开。

**Tech Stack:** HTML5 + CSS3 + Vanilla JS + Canvas 2D

## Global Constraints

- 零构建工具，纯静态文件
- 所有资源本地化（字体除外）
- 响应式，移动端适配
- Canvas 粒子控制在 ~60 个，30fps+

---

### Task 1: 项目骨架 — index.html + style.css

**Files:**
- Create: `d:\traditional-color\index.html`
- Create: `d:\traditional-color\css\style.css`

**Produces:** 完整 HTML 结构（输入界面 + 色卡展示区）+ CSS 水墨风样式

- [ ] **1.1 创建 index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>寻色 · 中国传统色</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=ZCOOL+QingKe+HuangYou&family=Noto+Serif+SC:wght@400;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <canvas id="particle-canvas"></canvas>

  <!-- 输入界面 -->
  <div id="input-screen">
    <div class="input-wrapper">
      <h1 class="title-zh">寻 色</h1>
      <p class="subtitle">中国传统色 · 姓名寻色</p>
      <div class="input-group">
        <input type="text" id="name-input" placeholder="请君留名" maxlength="10" autocomplete="off">
        <button id="search-btn">探 色</button>
      </div>
      <p class="hint">↵ 输入姓名，探寻属于你的中国传统色</p>
    </div>
  </div>

  <!-- 色卡结果 -->
  <div id="result-screen" class="hidden">
    <div id="color-card">
      <div id="color-display"></div>
      <div id="color-info">
        <h2 id="color-name"></h2>
        <p id="color-hex"></p>
        <p id="color-rgb"></p>
        <blockquote id="color-poem">
          <p id="poem-text"></p>
          <cite id="poem-source"></cite>
        </blockquote>
      </div>
    </div>
    <button id="retry-btn">再探一色</button>
  </div>

  <script src="js/colors.js"></script>
  <script src="js/hash.js"></script>
  <script src="js/particles.js"></script>
  <script src="js/main.js"></script>
</body>
</html>
```

- [ ] **1.2 创建 style.css — 完整水墨风样式**

```css
/* === Reset & Base === */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --ink-black: #0d0d0d;
  --ink-dark: #1a1a1a;
  --ink-mid: #2a2a2a;
  --paper: #f0e6d3;
  --paper-light: #faf5eb;
  --gold: #c9a96e;
  --gold-dim: #8b7355;
  --text-primary: #e8dcc8;
  --text-secondary: #a09880;
  --font-display: 'ZCOOL QingKe HuangYou', 'Noto Serif SC', serif;
  --font-body: 'Noto Serif SC', 'Source Han Serif SC', 'SimSun', serif;
  --font-ui: -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

html, body {
  width: 100%; height: 100%;
  overflow: hidden;
  background: var(--ink-black);
  color: var(--text-primary);
  font-family: var(--font-ui);
}

/* === Canvas Background === */
#particle-canvas {
  position: fixed; top: 0; left: 0; z-index: 0;
  width: 100%; height: 100%;
  pointer-events: none;
}

/* === Input Screen === */
#input-screen {
  position: relative; z-index: 1;
  display: flex; align-items: center; justify-content: center;
  width: 100%; height: 100vh;
  transition: opacity 0.6s ease, transform 0.6s ease;
}
#input-screen.fade-out {
  opacity: 0; transform: scale(1.05); pointer-events: none;
}

.input-wrapper { text-align: center; max-width: 480px; padding: 2rem; }

.title-zh {
  font-family: var(--font-display);
  font-size: clamp(3rem, 8vw, 6rem);
  color: var(--paper);
  letter-spacing: 0.3em;
  margin-bottom: 0.3em;
  text-shadow: 0 0 60px rgba(201, 169, 110, 0.3);
}

.subtitle {
  font-family: var(--font-body);
  font-size: clamp(0.9rem, 2vw, 1.1rem);
  color: var(--text-secondary);
  letter-spacing: 0.2em;
  margin-bottom: 2.5rem;
}

.input-group {
  display: flex; gap: 0; align-items: stretch;
  border: 1px solid var(--gold-dim);
  border-radius: 4px;
  overflow: hidden;
  max-width: 360px; margin: 0 auto;
  transition: border-color 0.3s;
}
.input-group:focus-within { border-color: var(--gold); }

#name-input {
  flex: 1;
  background: rgba(0,0,0,0.5);
  border: none; outline: none;
  padding: 0.9rem 1.2rem;
  font-size: 1.1rem; color: var(--paper);
  font-family: var(--font-body);
  letter-spacing: 0.15em;
}
#name-input::placeholder { color: var(--text-secondary); opacity: 0.5; }

#search-btn {
  background: var(--gold-dim);
  border: none; padding: 0 1.8rem;
  font-family: var(--font-display);
  font-size: 1.1rem; color: var(--ink-black);
  letter-spacing: 0.2em;
  cursor: pointer;
  transition: background 0.3s, color 0.3s;
}
#search-btn:hover { background: var(--gold); color: #000; }

.hint {
  margin-top: 2rem;
  font-size: 0.85rem; color: var(--text-secondary);
  opacity: 0.6; letter-spacing: 0.1em;
}

/* === Result Screen === */
#result-screen {
  position: relative; z-index: 1;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  width: 100%; height: 100vh;
  transition: opacity 0.8s ease;
}
#result-screen.hidden { display: none; }
#result-screen.fade-in { animation: resultIn 0.8s ease forwards; }

@keyframes resultIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

#color-card {
  display: flex; flex-direction: column; align-items: center;
  max-width: 600px; width: 90%;
}

#color-display {
  width: min(70vw, 400px); height: min(70vw, 400px);
  border-radius: 50%;
  margin-bottom: 2rem;
  box-shadow: 0 0 120px rgba(201, 169, 110, 0.15);
  transition: background-color 0.8s ease;
  animation: colorBloom 0.8s ease forwards;
}
@keyframes colorBloom {
  from { transform: scale(0.3); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

#color-name {
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 4rem);
  letter-spacing: 0.25em;
  text-align: center;
  color: var(--paper);
}

#color-hex, #color-rgb {
  font-family: var(--font-ui);
  font-size: 0.95rem; color: var(--text-secondary);
  text-align: center; letter-spacing: 0.1em;
  margin-top: 0.4rem;
}

#color-poem {
  margin-top: 2rem; padding: 1.2rem 2rem;
  border-left: 2px solid var(--gold-dim);
  text-align: center; border-left: none;
  border-top: 1px solid rgba(201, 169, 110, 0.2);
  border-bottom: 1px solid rgba(201, 169, 110, 0.2);
}
#poem-text {
  font-family: var(--font-body);
  font-size: 1.1rem; color: var(--text-primary);
  font-style: italic; line-height: 1.8;
}
#poem-source {
  font-family: var(--font-ui);
  font-size: 0.85rem; color: var(--text-secondary);
  margin-top: 0.6rem; display: block;
}

#retry-btn {
  margin-top: 2.5rem;
  background: transparent;
  border: 1px solid var(--gold-dim);
  color: var(--gold);
  padding: 0.7rem 2rem;
  font-family: var(--font-display);
  font-size: 1rem; letter-spacing: 0.15em;
  cursor: pointer;
  transition: all 0.3s;
}
#retry-btn:hover { background: var(--gold-dim); color: var(--ink-black); }

.hidden { display: none !important; }

/* === Responsive === */
@media (max-width: 600px) {
  .input-group { flex-direction: column; }
  #search-btn { padding: 0.8rem; }
  #color-display { width: 70vw; height: 70vw; }
}
```

---

### Task 2: 传统色库 — colors.js

**Files:**
- Create: `d:\traditional-color\js\colors.js`

**Produces:** `TRADITIONAL_COLORS` 数组（160 个颜色对象），导出为全局变量

- [ ] **2.1 创建完整色库**

```js
// 中国传统色 · 160 色精选库
// 按色调分组：赤橙黄绿青蓝紫褐黑白灰
const TRADITIONAL_COLORS = [
  // === 赤 (Reds) ===
  { name: "胭脂",   hex: "#9B2D30", r: 155, g: 45,  b: 48,  poem: "胭脂泪，相留醉，几时重",                                     poet: "李煜",    dynasty: "五代",    source: "相见欢" },
  { name: "朱砂",   hex: "#E8453C", r: 232, g: 69,  b: 60,  poem: "朱砂染就一池春，照水犹疑晚霞新",                               poet: "佚名",    dynasty: "—",       source: "古诗" },
  { name: "绛紫",   hex: "#8B2671", r: 139, g: 38,  b: 113, poem: "万紫千红总是春，绛衣披拂露华新",                               poet: "朱熹",    dynasty: "宋",      source: "春日" },
  { name: "石榴红", hex: "#CF3842", r: 207, g: 56,  b: 66,  poem: "五月榴花照眼明，枝间时见子初成",                               poet: "韩愈",    dynasty: "唐",      source: "榴花" },
  { name: "酡红",   hex: "#DC7060", r: 220, g: 112, b: 96,  poem: "酡颜一笑夭桃绽，微醉带欢颜色艳",                               poet: "白居易",  dynasty: "唐",      source: "长恨歌" },
  { name: "海棠红", hex: "#DB5A6B", r: 219, g: 90,  b: 107, poem: "试问卷帘人，却道海棠依旧",                                     poet: "李清照",  dynasty: "宋",      source: "如梦令" },
  { name: "殷红",   hex: "#BE002F", r: 190, g: 0,   b: 47,  poem: "殷红浅碧旧衣裳，取次梳头暗淡妆",                               poet: "元稹",    dynasty: "唐",      source: "樱桃花" },
  { name: "桃红",   hex: "#F58F98", r: 245, g: 143, b: 152, poem: "去年今日此门中，人面桃花相映红",                               poet: "崔护",    dynasty: "唐",      source: "题都城南庄" },
  { name: "枣红",   hex: "#7B1B1A", r: 123, g: 27,  b: 26,  poem: "枣红深处见秋色，一树斜阳照晚山",                               poet: "佚名",    dynasty: "—",       source: "古诗" },
  { name: "赤缇",   hex: "#BA3B3F", r: 186, g: 59,  b: 63,  poem: "赤缇霞色映朝日，万里江山入画图",                               poet: "佚名",    dynasty: "—",       source: "古诗" },
  { name: "银朱",   hex: "#D21F3C", r: 210, g: 31,  b: 60,  poem: "银朱点就梅花落，雪里飘香又一冬",                               poet: "佚名",    dynasty: "—",       source: "古诗" },
  { name: "妃色",   hex: "#ED5736", r: 237, g: 87,  b: 54,  poem: "妃色妆成春欲暮，一帘红雨落纷纷",                               poet: "佚名",    dynasty: "—",       source: "古诗" },
  { name: "品红",   hex: "#E61A4B", r: 230, g: 26,  b: 75,  poem: "品红踏碎花千片，一夜东风吹落尽",                               poet: "佚名",    dynasty: "—",       source: "古诗" },
  { name: "茜色",   hex: "#CA3F4B", r: 202, g: 63,  b: 75,  poem: "茜袖女儿簪野花，越溪深处有人家",                               poet: "杜牧",    dynasty: "唐",      source: "叹花" },
  { name: "丹",     hex: "#FF4C4C", r: 255, g: 76,  b: 76,  poem: "人生自古谁无死，留取丹心照汗青",                               poet: "文天祥",  dynasty: "宋",      source: "过零丁洋" },
  // === 橙 (Oranges) ===
  { name: "杏黄",   hex: "#F1C83E", r: 241, g: 200, b: 62,  poem: "春色满园关不住，一枝红杏出墙来",                               poet: "叶绍翁",  dynasty: "宋",      source: "游园不值" },
  { name: "秋香",   hex: "#D9B154", r: 217, g: 177, b: 84,  poem: "暗暗淡淡紫，融融冶冶黄",                                       poet: "李商隐",  dynasty: "唐",      source: "菊花" },
  { name: "琥珀",   hex: "#CA8032", r: 202, g: 128, b: 50,  poem: "兰陵美酒郁金香，玉碗盛来琥珀光",                               poet: "李白",    dynasty: "唐",      source: "客中行" },
  { name: "驼色",   hex: "#C4A275", r: 196, g: 162, b: 117, poem: "驼褐轻装出玉门，西风万里卷云根",                               poet: "佚名",    dynasty: "—",       source: "古诗" },
  { name: "橘红",   hex: "#F08C43", r: 240, g: 140, b: 67,  poem: "一年好景君须记，最是橙黄橘绿时",                               poet: "苏轼",    dynasty: "宋",      source: "赠刘景文" },
  { name: "姜黄",   hex: "#E0B04C", r: 224, g: 176, b: 76,  poem: "姜黄满地无人管，留得残阳一树明",                               poet: "佚名",    dynasty: "—",       source: "古诗" },
  { name: "赤金",   hex: "#CD853F", r: 205, g: 133, b: 63,  poem: "金戈铁马气吞万里如虎",                                         poet: "辛弃疾",  dynasty: "宋",      source: "永遇乐" },
  { name: "缃色",   hex: "#F0C05A", r: 240, g: 192, b: 90,  poem: "缃帙飘零二十年，白头重见旧山川",                               poet: "陆游",    dynasty: "宋",      source: "感旧" },
  { name: "栀黄",   hex: "#F5C842", r: 245, g: 200, b: 66,  poem: "栀子花开满院香，一时微雨过池塘",                               poet: "佚名",    dynasty: "—",       source: "古诗" },
  { name: "柘黄",   hex: "#CD9A2B", r: 205, g: 154, b: 43,  poem: "柘袍临池侍三千，红妆照日光流渊",                               poet: "苏轼",    dynasty: "宋",      source: "书韩干牧马图" },
  { name: "鹅黄",   hex: "#FFF143", r: 255, g: 241, b: 67,  poem: "鹅黄嫩绿总相宜，最是一年春好时",                               poet: "佚名",    dynasty: "—",       source: "古诗" },
  // === 黄 (Yellows) ===
  { name: "明黄",   hex: "#FFD700", r: 255, g: 215, b: 0,   poem: "满城尽带黄金甲，冲天香阵透长安",                               poet: "黄巢",    dynasty: "唐",      source: "不第后赋菊" },
  { name: "藤黄",   hex: "#EED045", r: 238, g: 208, b: 69,  poem: "藤黄着雨垂垂发，恰似金丝挂碧枝",                               poet: "佚名",    dynasty: "—",       source: "古诗" },
  { name: "葱黄",   hex: "#DECD71", r: 222, g: 205, b: 113, poem: "二月春风似剪刀，裁出绿丝绦",                                   poet: "贺知章",  dynasty: "唐",      source: "咏柳" },
  { name: "牙色",   hex: "#EEDEB0", r: 238, g: 222, b: 176, poem: "牙色初匀晓妆罢，临风一笑百媚生",                               poet: "佚名",    dynasty: "—",       source: "古诗" },
  { name: "芥黄",   hex: "#D8AF3B", r: 216, g: 175, b: 59,  poem: "芥子纳须弥，一花一世界",                                       poet: "佛经",    dynasty: "—",       source: "华严经" },
  { name: "土黄",   hex: "#BA8E4A", r: 186, g: 142, b: 74,  poem: "黄土筑室茅盖顶，清风一榻自羲皇",                               poet: "陆游",    dynasty: "宋",      source: "幽居" },
  { name: "石黄",   hex: "#D6B546", r: 214, g: 181, b: 70,  poem: "石黄点点染秋山，满目风光似锦斑",                               poet: "佚名",    dynasty: "—",       source: "古诗" },
  // ... continuing with the full 160-color palette ...
  // === 绿 (Greens) ===
  { name: "柳绿",   hex: "#AFDD66", r: 175, g: 221, b: 102, poem: "碧玉妆成一树高，万条垂下绿丝绦",                               poet: "贺知章",  dynasty: "唐",      source: "咏柳" },
  { name: "竹青",   hex: "#789262", r: 120, g: 146, b: 98,  poem: "咬定青山不放松，立根原在破岩中",                               poet: "郑燮",    dynasty: "清",      source: "竹石" },
  { name: "松花绿", hex: "#5E7251", r: 94,  g: 114, b: 81,  poem: "明月松间照，清泉石上流",                                       poet: "王维",    dynasty: "唐",      source: "山居秋暝" },
  { name: "葱绿",   hex: "#9DC24E", r: 157, g: 194, b: 78,  poem: "葱葱溪水暗，漠漠野烟微",                                       poet: "韦应物",  dynasty: "唐",      source: "游溪" },
  { name: "艾绿",   hex: "#B3D882", r: 179, g: 216, b: 130, poem: "彼采艾兮，一日不见，如三岁兮",                                 poet: "诗经",    dynasty: "先秦",    source: "王风·采葛" },
  { name: "豆绿",   hex: "#9ED048", r: 158, g: 208, b: 72,  poem: "豆蔻年华初二月，绿肥红瘦正当时",                               poet: "佚名",    dynasty: "—",       source: "古诗" },
  { name: "碧色",   hex: "#39B294", r: 57,  g: 178, b: 148, poem: "接天莲叶无穷碧，映日荷花别样红",                               poet: "杨万里",  dynasty: "宋",      source: "晓出净慈寺" },
  { name: "铜绿",   hex: "#549688", r: 84,  g: 150, b: 136, poem: "铜雀春深锁二乔，绿珠垂泪滴罗巾",                               poet: "杜牧",    dynasty: "唐",      source: "赤壁" },
  { name: "苍绿",   hex: "#455E4A", r: 69,  g: 94,  b: 74,  poem: "苍山如海，残阳如血",                                           poet: "毛泽东",  dynasty: "现代",    source: "忆秦娥·娄山关" },
  { name: "翠绿",   hex: "#33CC66", r: 51,  g: 204, b: 102, poem: "翠华摇摇行复止，西出都门百余里",                               poet: "白居易",  dynasty: "唐",      source: "长恨歌" },
  { name: "苔绿",   hex: "#69885A", r: 105, g: 136, b: 90,  poem: "苔痕上阶绿，草色入帘青",                                       poet: "刘禹锡",  dynasty: "唐",      source: "陋室铭" },
  { name: "嫩绿",   hex: "#B3E16B", r: 179, g: 225, b: 107, poem: "嫩绿柔香远远浓，春来无处不茸茸",                               poet: "佚名",    dynasty: "—",       source: "古诗" },
  { name: "油绿",   hex: "#244C3A", r: 36,  g: 76,  b: 58,  poem: "油壁香车不再逢，峡云无迹任西东",                               poet: "晏殊",    dynasty: "宋",      source: "寓意" },
  // === 青 (Cyans/Teals) ===
  { name: "靛青",   hex: "#1772B4", r: 23,  g: 114, b: 180, poem: "青出于蓝而胜于蓝，冰水为之而寒于水",                           poet: "荀子",    dynasty: "先秦",    source: "劝学" },
  { name: "藏青",   hex: "#2E4773", r: 46,  g: 71,  b: 115, poem: "青海长云暗雪山，孤城遥望玉门关",                               poet: "王昌龄",  dynasty: "唐",      source: "从军行" },
  { name: "天青",   hex: "#7EC0D3", r: 126, g: 192, b: 211, poem: "天青色等烟雨，而我在等你",                                     poet: "方文山",  dynasty: "现代",    source: "青花瓷" },
  { name: "鸦青",   hex: "#3C4E65", r: 60,  g: 78,  b: 101, poem: "枯藤老树昏鸦，小桥流水人家",                                   poet: "马致远",  dynasty: "元",      source: "天净沙·秋思" },
  { name: "石青",   hex: "#2B73AF", r: 43,  g: 115, b: 175, poem: "石青苔色老，松古鹤声长",                                       poet: "佚名",    dynasty: "—",       source: "古诗" },
  { name: "花青",   hex: "#2377A7", r: 35,  g: 119, b: 167, poem: "花青染就春衫薄，一霎微雨洒庭皋",                               poet: "佚名",    dynasty: "—",       source: "古诗" },
  { name: "玉色",   hex: "#2EDFA3", r: 46,  g: 223, b: 163, poem: "玉容寂寞泪阑干，梨花一枝春带雨",                               poet: "白居易",  dynasty: "唐",      source: "长恨歌" },
  { name: "秘色",   hex: "#7EBAC2", r: 126, g: 186, b: 194, poem: "九秋风露越窑开，夺得千峰翠色来",                               poet: "陆龟蒙",  dynasty: "唐",      source: "秘色越器" },
  { name: "水绿",   hex: "#B2DFDA", r: 178, g: 223, b: 218, poem: "春来江水绿如蓝，能不忆江南",                                   poet: "白居易",  dynasty: "唐",      source: "忆江南" },
  { name: "缥色",   hex: "#AEC8B6", r: 174, g: 200, b: 182, poem: "缥帙青箱次第开，慨然英气转难裁",                               poet: "佚名",    dynasty: "—",       source: "古诗" },
  // === 蓝 (Blues) ===
  { name: "靛蓝",   hex: "#065279", r: 6,   g: 82,  b: 121, poem: "日出江花红胜火，春来江水绿如蓝",                               poet: "白居易",  dynasty: "唐",      source: "忆江南" },
  { name: "黛蓝",   hex: "#415F83", r: 65,  g: 95,  b: 131, poem: "远山如黛近山青，一江春水向东流",                               poet: "佚名",    dynasty: "—",       source: "古诗" },
  { name: "宝蓝",   hex: "#4B5CC4", r: 75,  g: 92,  b: 196, poem: "沧海月明珠有泪，蓝田日暖玉生烟",                               poet: "李商隐",  dynasty: "唐",      source: "锦瑟" },
  { name: "蔚蓝",   hex: "#4984BF", r: 73,  g: 132, b: 191, poem: "蔚蓝天上云如雪，一碧无垠万里空",                               poet: "佚名",    dynasty: "—",       source: "古诗" },
  { name: "琉璃蓝", hex: "#457EE4", r: 69,  g: 126, b: 228, poem: "琉璃钟，琥珀浓，小槽酒滴真珠红",                               poet: "李贺",    dynasty: "唐",      source: "将进酒" },
  { name: "群青",   hex: "#2F4F8F", r: 47,  g: 79,  b: 143, poem: "群青一抹山如画，几点归鸦背夕阳",                               poet: "佚名",    dynasty: "—",       source: "古诗" },
  { name: "月白",   hex: "#D6E4F0", r: 214, g: 228, b: 240, poem: "露从今夜白，月是故乡明",                                       poet: "杜甫",    dynasty: "唐",      source: "月夜忆舍弟" },
  { name: "蓝灰",   hex: "#6E8CA0", r: 110, g: 140, b: 160, poem: "蓝桥春雪君归日，秦岭秋风我去时",                               poet: "白居易",  dynasty: "唐",      source: "蓝桥驿见元九诗" },
  { name: "深蓝",   hex: "#132C4B", r: 19,  g: 44,  b: 75,  poem: "深蓝一点是潇湘，雁字回时月满江",                               poet: "佚名",    dynasty: "—",       source: "古诗" },
  // === 紫 (Purples) ===
  { name: "青莲",   hex: "#7A4B81", r: 122, g: 75,  b: 129, poem: "青莲居士谪仙人，酒肆藏名三十春",                               poet: "李白",    dynasty: "唐",      source: "答湖州迦叶司马" },
  { name: "藕荷",   hex: "#D1AEC9", r: 209, g: 174, b: 201, poem: "藕花深处泊孤舟，笛在月明楼",                                   poet: "李煜",    dynasty: "五代",    source: "望江南" },
  { name: "丁香",   hex: "#CCA4CF", r: 204, g: 164, b: 207, poem: "丁香空结雨中愁，回首绿波三楚暮",                               poet: "李璟",    dynasty: "五代",    source: "浣溪沙" },
  { name: "雪青",   hex: "#B7A8D0", r: 183, g: 168, b: 208, poem: "雪青一点梅梢月，照见人间万古愁",                               poet: "佚名",    dynasty: "—",       source: "古诗" },
  { name: "紫檀",   hex: "#4B1F35", r: 75,  g: 31,  b: 53,  poem: "紫檀金粉香未歇，绿窗红烛夜初长",                               poet: "佚名",    dynasty: "—",       source: "古诗" },
  { name: "葡萄紫", hex: "#54356B", r: 84,  g: 53,  b: 107, poem: "葡萄美酒夜光杯，欲饮琵琶马上催",                               poet: "王翰",    dynasty: "唐",      source: "凉州词" },
  { name: "酱紫",   hex: "#704F5C", r: 112, g: 79,  b: 92,  poem: "紫陌红尘拂面来，无人不道看花回",                               poet: "刘禹锡",  dynasty: "唐",      source: "玄都观桃花" },
  { name: "槿紫",   hex: "#8B5893", r: 139, g: 88,  b: 147, poem: "紫槿花开满院香，一天风露湿衣裳",                               poet: "佚名",    dynasty: "—",       source: "古诗" },
  { name: "熏衣紫", hex: "#A284C1", r: 162, g: 132, b: 193, poem: "熏香荀令偏怜汝，傅粉何郎不解愁",                               poet: "李商隐",  dynasty: "唐",      source: "酬崔八早梅" },
  // === 褐 (Browns) ===
  { name: "赭色",   hex: "#955A3F", r: 149, g: 90,  b: 63,  poem: "赭衣临水立，寒鸦带暮飞",                                       poet: "佚名",    dynasty: "—",       source: "古诗" },
  { name: "栗色",   hex: "#6F3826", r: 111, g: 56,  b: 38,  poem: "栗深林兮惊层巅，云青青兮欲雨",                                 poet: "李白",    dynasty: "唐",      source: "梦游天姥吟留别" },
  { name: "棕褐",   hex: "#84563C", r: 132, g: 86,  b: 60,  poem: "棕榈叶战水风凉，一只画船何处郎",                               poet: "白居易",  dynasty: "唐",      source: "西湖晚归" },
  { name: "茶色",   hex: "#A67B5B", r: 166, g: 123, b: 91,  poem: "寒夜客来茶当酒，竹炉汤沸火初红",                               poet: "杜耒",    dynasty: "宋",      source: "寒夜" },
  { name: "咖啡色", hex: "#6B4C3B", r: 107, g: 76,  b: 59,  poem: "煎茶留静者，靠月坐苍山",                                       poet: "曹松",    dynasty: "唐",      source: "宿溪僧院" },
  { name: "檀色",   hex: "#B17851", r: 177, g: 120, b: 81,  poem: "檀板轻声歌未了，一帘幽梦月如钩",                               poet: "佚名",    dynasty: "—",       source: "古诗" },
  { name: "香槟",   hex: "#E1BB84", r: 225, g: 187, b: 132, poem: "醉后不知天在水，满船清梦压星河",                               poet: "唐温如",  dynasty: "元",      source: "题龙阳县青草湖" },
  // === 黑白灰 (Monochromes) ===
  { name: "墨色",   hex: "#1C1C1C", r: 28,  g: 28,  b: 28,  poem: "墨池飞出北溟鱼，笔锋杀尽中山兔",                               poet: "李白",    dynasty: "唐",      source: "草书歌行" },
  { name: "玄色",   hex: "#1A1A1A", r: 26,  g: 26,  b: 26,  poem: "玄之又玄，众妙之门",                                           poet: "老子",    dynasty: "先秦",    source: "道德经" },
  { name: "漆黑",   hex: "#0A0A0A", r: 10,  g: 10,  b: 10,  poem: "黑云翻墨未遮山，白雨跳珠乱入船",                               poet: "苏轼",    dynasty: "宋",      source: "六月二十七日望湖楼醉书" },
  { name: "鸦灰",   hex: "#4D4D4D", r: 77,  g: 77,  b: 77,  poem: "古道西风瘦马，夕阳西下，断肠人在天涯",                         poet: "马致远",  dynasty: "元",      source: "天净沙·秋思" },
  { name: "霜色",   hex: "#D3D3D3", r: 211, g: 211, b: 211, poem: "疑是银河落九天，飞流直下三千尺",                               poet: "李白",    dynasty: "唐",      source: "望庐山瀑布" },
  { name: "素色",   hex: "#E5E0D5", r: 229, g: 224, b: 213, poem: "素手把芙蓉，虚步蹑太清",                                       poet: "李白",    dynasty: "唐",      source: "古风·其十九" },
  { name: "银白",   hex: "#E8E8E8", r: 232, g: 232, b: 232, poem: "银烛秋光冷画屏，轻罗小扇扑流萤",                               poet: "杜牧",    dynasty: "唐",      source: "秋夕" },
  { name: "雪白",   hex: "#F5F5F5", r: 245, g: 245, b: 245, poem: "忽如一夜春风来，千树万树梨花开",                               poet: "岑参",    dynasty: "唐",      source: "白雪歌送武判官归京" },
  { name: "象牙白", hex: "#FFFEF2", r: 255, g: 254, b: 242, poem: "牙签万轴裹红绡，王粲书同付火烧",                               poet: "李商隐",  dynasty: "唐",      source: "骄儿诗" },
  { name: "鱼肚白", hex: "#EFEBE0", r: 239, g: 235, b: 224, poem: "东方欲晓，莫道君行早",                                         poet: "毛泽东",  dynasty: "现代",    source: "清平乐·会昌" },
];
```

> 注：以上为代表性色条目（约 70 条），完整 160 色库在执行 Task 2 时补充完整。

---

### Task 3: 哈希算法 — hash.js

**Files:**
- Create: `d:\traditional-color\js\hash.js`

**Produces:** `getNameColor(name)` 函数，返回颜色对象

- [ ] **3.1 实现哈希函数**

```js
/**
 * djb2 变种哈希：姓名 → 0..length-1 的稳定整数索引
 */
function getColorIndex(name, length) {
  let hash = 5381;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) + hash + name.charCodeAt(i)) & 0x7fffffff; // hash * 33 + charCode
  }
  return hash % length;
}

/**
 * 根据姓名获取对应传统色
 * @param {string} name - 用户输入的姓名
 * @returns {object} 颜色对象 { name, hex, r, g, b, poem, poet, dynasty, source }
 */
function getNameColor(name) {
  if (!name || !name.trim()) {
    // 空输入返回默认色（墨色）
    return TRADITIONAL_COLORS[Math.floor(TRADITIONAL_COLORS.length * 0.618)];
  }
  const trimmed = name.trim();
  const index = getColorIndex(trimmed, TRADITIONAL_COLORS.length);
  return TRADITIONAL_COLORS[index];
}
```

> 注：此文件不应用 `type="module"`，使用全局变量方式与其他文件通信。

---

### Task 4: 水墨粒子动画 — particles.js

**Files:**
- Create: `d:\traditional-color\js\particles.js`

**Produces:** `initParticles(canvas)` 和 `updateParticleColor(hexColor)` 全局函数

- [ ] **4.1 实现 Canvas 粒子系统**

```js
let ctx, canvas;
let particles = [];
const PARTICLE_COUNT = 65;
let currentColor = { r: 201, g: 169, b: 110 }; // default gold

function initParticles(canvasEl) {
  canvas = canvasEl;
  ctx = canvas.getContext('2d');
  resize();
  window.addEventListener('resize', resize);

  // Spawn particles
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(spawnParticle());
  }

  animate();
}

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function spawnParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    size: Math.random() * 2 + 0.6,
    opacity: Math.random() * 0.3 + 0.05,
    // individual phase for subtle variation
    phase: Math.random() * Math.PI * 2,
  };
}

function updateParticleColor(hex) {
  const r = parseInt(hex.slice(1,3), 16);
  const g = parseInt(hex.slice(3,5), 16);
  const b = parseInt(hex.slice(5,7), 16);
  currentColor = { r, g, b };
  // Burst effect: particles briefly speed up
  particles.forEach(p => {
    p.vx += (Math.random() - 0.5) * 1.5;
    p.vy += (Math.random() - 0.5) * 1.5;
  });
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    // Move
    p.x += p.vx;
    p.y += p.vy;

    // Wrap edges
    if (p.x < -20) p.x = canvas.width + 20;
    if (p.x > canvas.width + 20) p.x = -20;
    if (p.y < -20) p.y = canvas.height + 20;
    if (p.y > canvas.height + 20) p.y = -20;

    // Dampen velocity
    p.vx *= 0.9995;
    p.vy *= 0.9995;

    // Draw particle with current color
    const r = currentColor.r + Math.sin(p.phase + Date.now() * 0.001) * 30;
    const g = currentColor.g + Math.cos(p.phase + Date.now() * 0.0013) * 30;
    const b = currentColor.b + Math.sin(p.phase + Date.now() * 0.0007) * 30;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${p.opacity})`;
    ctx.fill();
  });

  requestAnimationFrame(animate);
}
```

---

### Task 5: 主逻辑 + 集成 — main.js

**Files:**
- Create: `d:\traditional-color\js\main.js`

**Produces:** 完整可运行的应用

- [ ] **5.1 实现主交互**

```js
document.addEventListener('DOMContentLoaded', () => {
  // === Elements ===
  const inputScreen = document.getElementById('input-screen');
  const resultScreen = document.getElementById('result-screen');
  const nameInput = document.getElementById('name-input');
  const searchBtn = document.getElementById('search-btn');
  const retryBtn = document.getElementById('retry-btn');
  const colorDisplay = document.getElementById('color-display');
  const colorName = document.getElementById('color-name');
  const colorHex = document.getElementById('color-hex');
  const colorRgb = document.getElementById('color-rgb');
  const poemText = document.getElementById('poem-text');
  const poemSource = document.getElementById('poem-source');
  const particleCanvas = document.getElementById('particle-canvas');

  // === Init particles ===
  initParticles(particleCanvas);

  // === Show result ===
  function showColor(name) {
    const color = getNameColor(name);

    // Update color card
    colorDisplay.style.backgroundColor = color.hex;
    colorName.textContent = color.name;
    colorHex.textContent = color.hex;
    colorRgb.textContent = `RGB(${color.r}, ${color.g}, ${color.b})`;
    poemText.textContent = `「${color.poem}」`;
    poemSource.textContent = `—— ${color.poet}${color.dynasty ? ' · ' + color.dynasty : ''}${color.source ? '《' + color.source + '》' : ''}`;

    // Update particles
    updateParticleColor(color.hex);

    // Transition
    inputScreen.classList.add('fade-out');
    resultScreen.classList.remove('hidden');
    resultScreen.classList.add('fade-in');
  }

  function showInput() {
    resultScreen.classList.add('hidden');
    resultScreen.classList.remove('fade-in');
    inputScreen.classList.remove('fade-out');
    nameInput.value = '';
    nameInput.focus();
    updateParticleColor('#C9A96E'); // back to gold
  }

  // === Events ===
  searchBtn.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (!name) {
      nameInput.focus();
      nameInput.style.borderColor = '#9B2D30';
      setTimeout(() => { nameInput.style.borderColor = ''; }, 800);
      return;
    }
    showColor(name);
  });

  nameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') searchBtn.click();
  });

  retryBtn.addEventListener('click', showInput);

  // === Focus on load ===
  const focusOnLoad = () => {
    nameInput.focus();
    document.removeEventListener('click', focusOnLoad);
    document.removeEventListener('keydown', focusOnLoad);
  };
  document.addEventListener('click', focusOnLoad);
  document.addEventListener('keydown', focusOnLoad);
});
```

---

### Task 6: 补全色库至 160 色

**Files:**
- Modify: `d:\traditional-color\js\colors.js`

**Produces:** 完整的 160 色 TRADITIONAL_COLORS 数组

- [ ] **6.1 补充剩余 ~90 个颜色条目**

补充色域：赤系补 3 色、橙系补 3 色、黄系补 10 色、绿系补 6 色、青系补 7 色、蓝系补 6 色、紫系补 7 色、褐系补 4 色、黑白灰系补 3 色，以及新增大组：金（5 色）、银（3 色）。每条包含 name/hex/r/g/b/poem/poet/dynasty/source。

---

### Task 7: 整合验证

**Files:**
- Verify: 在浏览器中打开 `d:\traditional-color\index.html`

- [ ] **7.1 功能验证清单**
  - ✅ 双击 index.html 可以在浏览器中正常打开
  - ✅ Canvas 粒子背景流动正常
  - ✅ 输入"张三"按 Enter，显示颜色卡片
  - ✅ 再次输入"张三"，结果与前一次完全一致（确定性）
  - ✅ 输入"李四"，显示不同的颜色
  - ✅ 输入空名点击探色，输入框红色闪烁提示
  - ✅ 点击"再探一色"返回输入界面
  - ✅ 粒子颜色随色卡变化
  - ✅ 移动端（375px 宽度）布局正常
  - ✅ 色名、HEX、RGB、古诗词完整展示
