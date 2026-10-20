<script setup lang="ts">
import { computed, ref } from 'vue'
import { lines, linePath, stations, type Line, type Station } from './data'

const selectedLine = ref<Line>(lines[0])
const selectedStation = ref<Station | null>(stations[0])
const isStation = ref(false)

const stationById = (id: string) => stations.find((s) => s.id === id)!

function selectLine(l: Line) {
  selectedLine.value = l
  isStation.value = false
  selectedStation.value = stationById(l.stations[0])
}
function selectStation(s: Station) {
  selectedStation.value = s
  isStation.value = true
  const first = s.lines[0]
  const line = lines.find((l) => l.id === first)
  if (line) selectedLine.value = line
}

function isOnSelectedLine(s: Station) {
  return selectedLine.value.stations.includes(s.id)
}

function trainStyle(line: Line) {
  const d = linePath(line)
  return { offsetPath: `path("${d}")`, animationDuration: (line.stations.length * 1.6 + 3).toFixed(1) + 's' }
}

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

function stationLinesText(s: Station | null): string {
  if (!s) return ''
  return s.lines
    .map((id) => lines.find((l) => l.id === id)?.name.split(' · ')[0])
    .filter((n): n is string => Boolean(n))
    .join('、')
}
</script>

<template>
  <div class="metro">
    <div class="grid-floor" aria-hidden="true"></div>
    <header class="masthead">
      <div class="masthead-brand">
        <span class="glyph">≋</span>
        <span class="brand-text"><b>霓虹脉络</b><i>NEON METRO · 未来城市交通控制台</i></span>
      </div>
      <div class="clock">
        <span>NIGHT NETWORK</span>
        <b>23:47</b>
      </div>
    </header>

    <section class="hero">
      <div class="hero-copy">
        <p class="kicker">A GLOWING MAP OF THE NIGHT CITY</p>
        <h1 class="hero-title">霓虹<br /><em>脉络</em></h1>
        <p class="hero-sub">一座不夜城的地下，五条线路把人们送往各自的去处。点选一条线路或一个站点，看列车流光如何穿过整张地图。</p>
        <button class="btn" @click="scrollToId('network')">进入控制台 ↓</button>
      </div>
      <div class="skyline" aria-hidden="true">
        <i v-for="(b, n) in 12" :key="n" :style="{ height: (14 + ((n * 37) % 42)) + '%', animationDelay: (n * 0.3) + 's' }"></i>
      </div>
    </section>

    <section class="network" id="network">
      <div class="net-head">
        <div>
          <p class="kicker">SIGNATURE INTERACTION</p>
          <h2>交通网络 <span>· The Network</span></h2>
        </div>
        <div class="net-hint">点击地图上的站点，或下方线路按钮</div>
      </div>
      <div class="net-body">
        <div class="map-wrap">
          <svg viewBox="0 0 800 600" class="map">
            <g class="map-bg">
              <line v-for="g in 10" :key="g" :x1="g * 80" y1="0" :x2="g * 80" y2="600" />
              <line v-for="g in 7" :key="g" :x1="0" :y1="g * 85" x2="800" :y2="g * 85" />
            </g>
            <g v-for="l in lines" :key="l.id">
              <path :d="linePath(l)" fill="none" :stroke="l.color" :stroke-width="selectedLine.id === l.id ? 7 : 3" :opacity="selectedLine.id === l.id ? 1 : 0.32" stroke-linejoin="round" />
            </g>
            <g v-if="selectedLine" class="train" :style="trainStyle(selectedLine)">
              <circle r="7" :fill="selectedLine.color" class="train-dot" />
            </g>
            <g v-for="s in stations" :key="s.id" class="station-node" :class="{ on: isOnSelectedLine(s) }" @click="selectStation(s)">
              <circle :cx="s.x" :cy="s.y" :r="selectedStation?.id === s.id ? 10 : 6" class="node-ring" />
              <circle :cx="s.x" :cy="s.y" r="4" class="node-core" />
              <text :x="s.x" :y="s.y - 12" class="node-label">{{ s.name }}</text>
            </g>
          </svg>
        </div>
        <aside class="data-panel">
          <p class="panel-kicker">LINE / STATION DATA</p>
          <template v-if="!isStation">
            <div class="line-swatch" :style="{ background: selectedLine.color }"></div>
            <h3>{{ selectedLine.name }}</h3>
            <p class="panel-desc">{{ selectedLine.desc }}</p>
            <dl>
              <div><dt>线路长度</dt><dd>{{ selectedLine.length }}</dd></div>
              <div><dt>发车间隔</dt><dd>{{ selectedLine.headway }}</dd></div>
              <div><dt>车站数</dt><dd>{{ selectedLine.stations.length }} 座</dd></div>
            </dl>
            <p class="panel-foot">※ 本图与数据为虚构示例，仅用于视觉演示。</p>
          </template>
          <template v-else>
            <h3 class="st-name">{{ selectedStation?.name }} <span>{{ selectedStation?.en }}</span></h3>
            <p class="panel-desc">{{ selectedStation?.landmark }}</p>
            <dl>
              <div><dt>所在片区</dt><dd>{{ selectedStation?.district }}</dd></div>
              <div><dt>经过线路</dt><dd>{{ stationLinesText(selectedStation) }}</dd></div>
              <div><dt>换乘属性</dt><dd>{{ (selectedStation?.lines.length || 0) > 1 ? '换乘站' : '普通站' }}</dd></div>
            </dl>
          </template>
        </aside>
      </div>
      <div class="line-bar">
        <button v-for="l in lines" :key="l.id" :class="{ on: selectedLine.id === l.id && !isStation }" :style="{ '--lc': l.color }" @click="selectLine(l)">
          <i :style="{ background: l.color }"></i>
          {{ l.name }}
        </button>
      </div>
    </section>

    <section class="stations">
      <div class="net-head">
        <div>
          <p class="kicker">STATION INDEX</p>
          <h2>站点索引 <span>· Stations</span></h2>
        </div>
      </div>
      <div class="station-grid">
        <button v-for="s in stations" :key="s.id" class="station-card" :class="{ on: selectedStation?.id === s.id }" @click="selectStation(s); scrollToId('network')">
          <span class="st-dot" :style="{ background: lines.find((l) => l.id === s.lines[0])?.color }"></span>
          <span class="st-name">{{ s.name }} <i>{{ s.en }}</i></span>
          <span class="st-district">{{ s.district }}</span>
        </button>
      </div>
    </section>

    <section class="about">
      <div class="about-inner">
        <h2>关于这座不夜城</h2>
        <p>
          《霓虹脉络》用一张发光的城市交通网，演示「线路—站点—列车流光」的互动叙事。
          线路、站点与运营数据均为虚构示例，仅用于视觉展示，不代表任何真实城市的交通系统。
          全部图形由 SVG 与 CSS 原创绘制。
        </p>
        <div class="about-meta"><span>Vue 3 + SVG</span><span>列车流光 · 节点脉冲 · 赛博朋克</span><span>无外部素材依赖</span></div>
      </div>
    </section>

    <footer class="foot"><span>霓虹脉络 · Neon Metro</span><span>当前线路 {{ selectedLine.name }}</span><span>DIGITAL VISUAL LAB</span></footer>
  </div>
</template>

<style>
:root {
  --mono: 'Cascadia Mono', Consolas, 'Courier New', monospace;
  --cyan: #4dd6ff;
  --magenta: #ff4d8f;
}
.metro {
  min-height: 100vh;
  background: linear-gradient(180deg, #0b0818 0%, #160a24 55%, #0b0818 100%);
  color: #f2edff;
  font-family: var(--mono);
  overflow-x: hidden;
}
.grid-floor {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image:
    linear-gradient(rgba(77, 214, 255, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 77, 143, 0.07) 1px, transparent 1px);
  background-size: 44px 44px;
  perspective: 600px;
  transform: rotateX(50deg) scale(2) translateY(24%);
  mask-image: linear-gradient(180deg, transparent, #000 40%);
}
.masthead {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px clamp(18px, 4vw, 56px);
  border-bottom: 1px solid rgba(77, 214, 255, 0.2);
}
.masthead-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}
.glyph {
  font-size: 26px;
  color: var(--cyan);
  text-shadow: 0 0 16px var(--cyan);
}
.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}
.brand-text b {
  letter-spacing: 4px;
  font-size: 17px;
}
.brand-text i {
  font-style: normal;
  font-size: 10px;
  letter-spacing: 2px;
  color: #8d82ad;
}
.clock {
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.clock span {
  font-size: 10px;
  letter-spacing: 3px;
  color: #8d82ad;
}
.clock b {
  color: var(--magenta);
  font-size: 22px;
  text-shadow: 0 0 16px var(--magenta);
}

.hero {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  align-items: end;
  gap: 30px;
  padding: clamp(52px, 9vh, 110px) clamp(18px, 5vw, 90px) 0;
  max-width: 1240px;
  margin: 0 auto;
}
.kicker {
  font-size: 11px;
  letter-spacing: 4px;
  color: var(--cyan);
  margin: 0 0 14px;
}
.hero-title {
  font-size: clamp(52px, 11vw, 140px);
  line-height: 0.94;
  margin: 0;
  letter-spacing: 0.03em;
}
.hero-title em {
  font-style: normal;
  color: var(--magenta);
  text-shadow: 0 0 30px var(--magenta);
}
.hero-sub {
  max-width: 50ch;
  color: #b9aed6;
  font-size: clamp(14px, 1.6vw, 17px);
  margin: 22px 0 0;
  line-height: 1.75;
}
.btn {
  margin-top: 26px;
  background: var(--magenta);
  border: 0;
  color: #18050e;
  padding: 12px 24px;
  font-weight: 700;
  letter-spacing: 2px;
  font-family: var(--mono);
  box-shadow: 0 0 20px rgba(255, 77, 143, 0.5);
}
.skyline {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  height: 280px;
  justify-content: flex-end;
}
.skyline i {
  width: 34px;
  background: linear-gradient(180deg, rgba(77, 214, 255, 0.5), rgba(255, 77, 143, 0.2));
  border: 1px solid rgba(77, 214, 255, 0.3);
  border-bottom: 0;
  border-radius: 3px 3px 0 0;
  animation: flicker 3s infinite;
}
@keyframes flicker {
  0%, 92% { opacity: 1; }
  93% { opacity: 0.4; }
  95% { opacity: 1; }
  97% { opacity: 0.6; }
}

.network,
.stations,
.about {
  position: relative;
  z-index: 2;
  padding: clamp(44px, 7vh, 88px) clamp(18px, 4vw, 56px);
  max-width: 1240px;
  margin: 0 auto;
}
.net-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 22px;
}
.net-head h2 {
  font-size: clamp(24px, 4vw, 44px);
  margin: 0;
  letter-spacing: 1px;
}
.net-head h2 span {
  color: #8d82ad;
  font-weight: 400;
}
.net-hint {
  font-size: 12px;
  color: #8d82ad;
  letter-spacing: 1px;
}
.net-body {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 20px;
}
.map-wrap {
  border: 1px solid rgba(77, 214, 255, 0.2);
  border-radius: 8px;
  background: rgba(8, 6, 20, 0.7);
  overflow: hidden;
}
.map {
  width: 100%;
  height: auto;
  display: block;
}
.map-bg line {
  stroke: rgba(77, 214, 255, 0.06);
  stroke-width: 1;
}
.train {
  animation: ride linear infinite;
  offset-rotate: 0deg;
}
@keyframes ride {
  from { offset-distance: 0%; }
  to { offset-distance: 100%; }
}
.train-dot {
  filter: drop-shadow(0 0 8px currentColor);
}
.station-node {
  cursor: pointer;
}
.node-ring {
  fill: rgba(8, 6, 20, 0.9);
  stroke: #8d82ad;
  stroke-width: 2;
}
.station-node.on .node-ring {
  stroke: var(--cyan);
}
.node-core {
  fill: #c9c3e0;
}
.station-node.on .node-core {
  fill: #fff;
}
.node-label {
  fill: #b9aed6;
  font-size: 12px;
  text-anchor: middle;
  letter-spacing: 1px;
}
.data-panel {
  border: 1px solid rgba(77, 214, 255, 0.25);
  background: rgba(12, 9, 28, 0.8);
  padding: 26px 22px;
}
.panel-kicker {
  font-size: 10px;
  letter-spacing: 3px;
  color: var(--cyan);
  margin: 0 0 16px;
}
.line-swatch {
  width: 100%;
  height: 8px;
  border-radius: 999px;
  margin-bottom: 16px;
  box-shadow: 0 0 14px currentColor;
}
.data-panel h3 {
  margin: 0 0 10px;
  font-size: 20px;
  letter-spacing: 1px;
}
.st-name {
  color: var(--magenta);
}
.st-name span {
  display: block;
  font-size: 12px;
  color: #8d82ad;
  letter-spacing: 2px;
}
.panel-desc {
  color: #b9aed6;
  line-height: 1.7;
  font-size: 14px;
  margin: 0 0 16px;
}
.data-panel dl {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.data-panel dl div {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(77, 214, 255, 0.15);
  padding-bottom: 8px;
}
.data-panel dt {
  color: #8d82ad;
  font-size: 12px;
}
.data-panel dd {
  margin: 0;
  font-size: 13px;
  color: #f2edff;
}
.panel-foot {
  margin: 18px 0 0;
  font-size: 11px;
  color: #6d648c;
  line-height: 1.6;
}
.line-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}
.line-bar button {
  --lc: #fff;
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(12, 9, 28, 0.8);
  border: 1px solid #2a2348;
  color: #b9aed6;
  padding: 10px 14px;
  font-family: var(--mono);
  letter-spacing: 1px;
}
.line-bar button i {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.line-bar button.on {
  border-color: var(--lc);
  color: #fff;
  box-shadow: 0 0 12px color-mix(in srgb, var(--lc) 50%, transparent);
}
.station-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}
.station-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 14px;
  background: rgba(12, 9, 28, 0.8);
  border: 1px solid #2a2348;
  color: #f2edff;
  text-align: left;
  font-family: var(--mono);
  transition: transform 0.2s, border-color 0.2s;
}
.station-card:hover {
  transform: translateY(-4px);
  border-color: var(--cyan);
}
.station-card.on {
  border-color: var(--magenta);
}
.st-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.st-name {
  font-size: 15px;
  letter-spacing: 1px;
}
.st-name i {
  display: block;
  font-style: normal;
  font-size: 10px;
  color: #8d82ad;
  letter-spacing: 1px;
}
.st-district {
  font-size: 11px;
  color: #8d82ad;
}
.about-inner {
  border: 1px solid rgba(77, 214, 255, 0.2);
  background: rgba(12, 9, 28, 0.8);
  padding: clamp(24px, 4vw, 44px);
  max-width: 820px;
}
.about-inner h2 {
  margin: 0 0 14px;
}
.about-inner p {
  color: #b9aed6;
  line-height: 1.75;
  margin: 0 0 16px;
}
.about-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 22px;
  font-size: 12px;
  color: #8d82ad;
  letter-spacing: 1px;
}
.foot {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  padding: 22px clamp(18px, 4vw, 56px);
  border-top: 1px solid rgba(77, 214, 255, 0.2);
  color: #8d82ad;
  letter-spacing: 2px;
  font-size: 12px;
}

@media (max-width: 900px) {
  .hero {
    grid-template-columns: 1fr;
  }
  .skyline {
    display: none;
  }
  .net-body {
    grid-template-columns: 1fr;
  }
  .station-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
