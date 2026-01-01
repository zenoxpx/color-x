import { hsvToXyz } from "./color.js";

// CSS変数取得のためrootのスタイルを取得
const rootStyles = getComputedStyle(document.documentElement);
// 定数取得
const HUE_OFFSET = parseFloat(rootStyles.getPropertyValue("--hue-offset")) || 0;

// HTML要素取得
const colorWheel = document.getElementById("js-color-wheel");
const hueHandle = document.getElementById("js-hue-handle");
const svPanel = document.getElementById("js-sv-panel");
const svSelector = document.getElementById("js-sv-selector");
const submitButton = document.getElementById("submit-btn");

// 現在の選択色
// 整数で保持する
const currentSelectColor = {
  h: 0,     // 0 - 359
  s: 100,   // 0 - 100
  v: 100    // 0 - 100
}

/* ================================================================================
   色相環のセレクター制御
   ================================================================================*/
let isHueDragging = false;

colorWheel.addEventListener("mousedown", (e) => {
  if(!isClickOnColorWheel(e)) {
    return;
  }
  isHueDragging = true;
  e.preventDefault();
  updateHue(e);
});

window.addEventListener("mousemove", (e) => {
  if(isHueDragging) {
    updateHue(e);
  }
});

window.addEventListener("mouseup", () => {
  isHueDragging = false;
})

/* ================================================================================
   SVパネルのセレクター制御
   ================================================================================*/
let isSvDragging = false;

svPanel.addEventListener("mousedown", (e) => {
  isSvDragging = true;
  e.preventDefault();
  updateSV(e);
});

window.addEventListener("mousemove", (e) => {
  if(isSvDragging) {
    updateSV(e);
  }
});

window.addEventListener("mouseup", () => {
  isSvDragging = false;
})

/* ================================================================================
   Submitボタン押下時
   ================================================================================*/
submitButton.addEventListener("click", () => {
  logCurrentSelectColor();
  console.log(hsvToXyz(
    currentSelectColor.h,
    currentSelectColor.s,
    currentSelectColor.v
  ));
})


function updateHue(e) {
  // クリック位置を色相環中央からの座標として取得
  const rect = colorWheel.getBoundingClientRect();
  const [dx, dy] = getClickPositionFromCenter(e, rect);

  // クリック位置から角度を度数法で求める
  let rawDeg = Math.atan2(dy, dx) * 180 / Math.PI;

  // 角度の範囲を-180~180から0~360に補正
  if(rawDeg < 0) {
    rawDeg += 360;
  }

  // 色相はy軸負が基準になる
  let hue = (rawDeg+90-HUE_OFFSET) % 360;

  hueHandle.style.setProperty("--hue-angle", `${rawDeg}deg`);
  svPanel.style.backgroundColor = `hsl(${hue}deg, 100%, 50%)`;

  // 色相は[0, 360)で動かすため切り捨て
  // 色相はループするため360は0と同じ色相
  currentSelectColor.h = Math.floor(hue);
  logCurrentSelectColor();
}

// 色相環の中でクリックしてるか
function isClickOnColorWheel(e) {
  const rect = colorWheel.getBoundingClientRect();
  const [dx, dy] = getClickPositionFromCenter(e, rect);

  const distance = Math.sqrt(dx * dx + dy * dy);

  const ratio = parseFloat(rootStyles.getPropertyValue("--hue-circle-ratio"));
  const innerRadius = (rect.width * (1 - ratio)) / 2;
  const outerRadius = rect.width / 2;

  if(innerRadius <= distance && distance <= outerRadius) {
    return true;
  }
  return false;
}

function updateSV(e) {
  // クリック位置を左上からの座標として取得
  const rect = svPanel.getBoundingClientRect();
  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;

  // パネル内に収める
  const clampPos = (min, pos, max) => Math.max(min, Math.min(pos, max));
  x = clampPos(0, x, rect.width);
  y = clampPos(0, y, rect.height);

  // TODO: selectorSizeをCSSから取り出す処理を実装する
  const selectorSize = 15;
  svSelector.style.left = `${x - selectorSize / 2}px`;
  svSelector.style.top = `${y - selectorSize / 2}px`;

  // SV変換
  currentSelectColor.s = Math.round((x / rect.width) * 100);
  currentSelectColor.v = Math.round((1 - (y / rect.height)) * 100);
  logCurrentSelectColor();
}

// click位置をrectの中心からの座標に変換する
function getClickPositionFromCenter(e, rect) {
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  
  const dx = e.clientX - cx;
  const dy = e.clientY - cy;
  return [dx, dy];
}

// 選択色のログ出力
function logCurrentSelectColor() {
  const { h, s, v } = currentSelectColor;
  console.log(`Current HSV: (${h}, ${s}%, ${v}%)`);
}