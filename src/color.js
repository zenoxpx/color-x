// HSVから変換したRGBを[0, 1]で返す関数
// Hは[0, 360), S,Vは[0, 100]
export function hsvToRgb(h, s, v) {
  // [0, 1]に正規化
  s /= 100, v /= 100;

  let r, g, b;

  const max = v;
  const min = max * (1 - s);


  // 色相角の60°セクターのインデックス
  const k = Math.floor(h / 60);

  // セクターの原点からの座標(割合)
  const x = h / 60 - k;

  // 中間値の傾き
  const a = (-1 * (k % 2)) * (max - min) / 60;

  switch(k) {
    case 0: // 0°~60°
      r = max;
      g = a * x + min;
      b = min;
      break;
    case 1: // 60°~120°
      r = a * x + min;
      g = max;
      b = min;
      break;
    case 2: // 120°~180°
      r = min;
      g = max;
      b = a * x + min;
      break;
    case 3: // 180°~240°
      r = min;
      g = a * x + min;
      b = max;
      break;
    case 4: // 240°~300°
      r = a * x + min;
      g = min;
      b = max;
      break;
    case 5: // 300°~360°
      r = max;
      g = min;
      b = a * x + min;
      break;
  }

  return {r, g, b};
}