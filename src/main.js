const HUE_OFFSET = 90;

const colorWheel = document.getElementById("js-color-wheel");
const hueHandle = document.getElementById("js-hue-handle");
const svPanel = document.getElementById("js-sv-panel");

colorWheel.addEventListener("mousedown", (e) => {
  updateHue(e);
});

function updateHue(e) {
  debugger;
  const rect = colorWheel.getBoundingClientRect();
  // 中心座標
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  // クリック位置の中心からの座標
  const dx = e.clientX - cx;
  const dy = e.clientY - cy;

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
}