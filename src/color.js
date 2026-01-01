export function hsvToXyz(h, s, v) {
  const {r, g, b} = hsvToRgb(h, s, v);
  return srgbToXyz(r, g, b);
}

// HSVから変換したRGBを[0, 1]で返す関数
// Hは[0, 360), S,Vは[0, 100]
export function hsvToRgb(h, s, v) {
  // [0, 1]に正規化
  s /= 100, v /= 100;

  let r, g, b;

  const max = v;
  const min = max * (1 - s);

  // 色相角の60°セクターの番号[0, 5]
  // h/60の整数部分
  const k = Math.floor(h / 60);

  // セクターの原点からの座標(割合)
  // h/60の小数部分
  const x = h / 60 - k;

  // 中間値の傾き
  const a = (k % 2 === 0 ? 1 : -1) * (max - min);

  switch(k) {
    case 0: // 0°~60°
      r = max;
      g = a * x + min;
      b = min;
      break;
    case 1: // 60°~120°
      r = a * x + max;
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
      g = a * x + max;
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
      b = a * x + max;
      break;
  }

  return {r, g, b};
}

export function srgbToXyz(r, g, b) {
  // ガンマ解除
  const linearRgb = srgbToLinearRgb(r, g, b);

  // sRGB->XYZの変換行列
  const matrix = [
    [0.4124, 0.3576, 0.1805],
    [0.2126, 0.7152, 0.0722],
    [0.0193, 0.1192, 0.9505]
  ];
  // 行列積によるLinear sRGB->XYZの変換
  const results = multiplyMatrix(matrix, [[linearRgb.r], [linearRgb.g], [linearRgb.b]]);
  // 縦ベクトルの転置をして返す
  const [x, y, z] = results.map(v => v[0]);
  return {x, y, z};
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

// 行列積を計算する関数
// 行列積が定義されないような演算の場合はnullを返す
export function multiplyMatrix(matA, matB) {
  // 行方向に要素が存在するかチェック
  if(matA.length === 0 || matB.length === 0) {
    return null;
  }

  // 行列積が定義できるかチェック
  if(matA[0].length !== matB.length) {
    return null;
  }

  // lxm行列とmxn行列の積をとる
  const l = matA.length;
  const m = matB.length;
  const n = matB[0].length;

  // 列方向に要素が存在するかチェック
  if(n === 0) {
    return null;
  }

  // xxy行列として正しい形かチェック
  // 行方向の要素数はチェック済みとする
  const validateMatrix = (matrix, x, y) => {
    for(let i = 0;i < x;i++) {
      if(matrix[i].length !== y) {
        return false;
      }
    }
    return true;
  }
  // A, Bどちらかが不正でないかチェック
  if(!validateMatrix(matA, l, m) || !validateMatrix(matB, m, n)) {
    return null;
  }
  
  // 結果となる行列の初期化
  const matC = [];
  for(let i = 0;i < l;i++) {
    matC.push([]);
    for(let j = 0;j < n;j++) {
      matC[i].push(0);
    }
  }

  for(let i = 0;i < l;i++) {
    for(let j = 0;j < n;j++) {
      for(let k = 0;k < m;k++) {
        matC[i][j] += matA[i][k] * matB[k][j];
      }
    }
  }

  return matC;
}