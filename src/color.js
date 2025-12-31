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

export function srgbToXyz(r, g, b) {
  // ガンマ解除
  const linearRgb = srgbToLinearRgb(r, g, b);

  // sRGB->XYZの変換行列
  const matrix = [
    0.4124, 0.3576, 0.1805,
    0.2126, 0.7152, 0.0722,
    0.0193, 0.1192, 0.9505
  ];
  // 行列積によるLinear sRGB->XYZの変換
  const results = multiplyMatrix(matrix, [[r], [g], [b]]);
  return results.map(v => v[0]);
}

// sRGBに対するガンマ解除を行う関数
function srgbToLinearRgb(r, g, b) {
  [r, g, b] = [r, g, b].map((v) => {
    if(v > 0.04045) {
      return Math.pow((v + 0.055) / 1.055, 2.4);
    } else {
      return v / 12.92;
    }
  });

  return {r, g, b};
}

function multiplyMatrix(a, b) {

}