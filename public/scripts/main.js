'use strict';

//main();
window.addEventListener('load', main);


function main() {
  const canvas = document.querySelector('#glcanvas');
  // Initialize the GL context
  // GL コンテキストを初期化する
  const gl = canvas.getContext('webgl');

  // If we don't have a GL context, give up now
  // Only continue if WebGL is available and working
  // WebGL が使用可能で動作している場合にのみ続行します

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  // Set clear color to black, fully opaque
  // クリアカラーを黒に設定し、完全に不透明にします
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear the color buffer with specified clear color
  // 指定されたクリアカラーでカラーバッファをクリアします
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  console.log('load');
}
