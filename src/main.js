import { rgbToLab, hsvToLab, getDeltaE } from "./color.js";

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

// 出題される色
// [0, 1]
const questionColor = {
  r: 1,
  g: 1,
  b: 1
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
  const questionLab = rgbToLab(questionColor.r, questionColor.g, questionColor.b);
  const selectLab = hsvToLab(currentSelectColor.h, currentSelectColor.s, currentSelectColor.v);

  const deltaE = getDeltaE(questionLab, selectLab);
  const score = calcScore(deltaE);
  console.log("score: ", score);
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
  const rect = svPanel.getBoundingClientRect();
  
  // クリック位置を0-1の比率に変換
  const clamp = (min, pos, max) => Math.max(min, Math.min(pos, max));
  let sRatio = clamp(0, (e.clientX - rect.left) / rect.width, 1);
  let vRatio = clamp(0, (e.clientY - rect.top) / rect.height, 1);

  // 選択色の更新
  currentSelectColor.s = sRatio * 100;
  currentSelectColor.v = (1 - vRatio) * 100;

  // セレクター位置の更新
  svSelector.style.left = `${currentSelectColor.s}%`;
  svSelector.style.top = `${100 - currentSelectColor.v}%`;
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

// スコア計算を行う関数
function calcScore(deltaE) {
  // deltaE * e^{-k * x}の形でスコアを算出する
  // kが大きいほど難易度が高くなる
  const k = 0.08;
  let score = 100 * Math.exp(-k * deltaE);
  return Math.round(score);
}