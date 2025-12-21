const colorWheel = document.querySelector(".p-picker__hue");
const hueHandle = document.querySelector(".p-picker__hue-handle");

colorWheel.addEventListener("mousedown", (e) => {
  updateHue(e);
});

function updateHue(e) {
  debugger;
  const rect = colorWheel.getBoundingClientRect();
  // 中心座標
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;

  const dx = e.clientX - cx;
  const dy = e.clientY - cy;

  // マウス座標から角度を度数法で求める
  let deg = Math.atan2(dy, dx) * 180 / Math.PI;

  // 角度の範囲を-180~180から0~360に補正
  if(deg < 0) {
    deg += 360;
  }

  hueHandle.style.setProperty("--hue-angle", `${deg}deg`);
}