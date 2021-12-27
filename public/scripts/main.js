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
  
  // Vertex shader program
  const vsSource = `
    attribute vec4 aVertexPosition;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
  `;
  
  // Fragment shader program
  const fsSource = `
    void main() {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
  `;

  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
  
  // Set clear color to black, fully opaque
  // クリアカラーを黒に設定し、完全に不透明にします
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear the color buffer with specified clear color
  // 指定されたクリアカラーでカラーバッファをクリアします
  gl.clear(gl.COLOR_BUFFER_BIT);
  
}


function drawScene() {
}

// シェーダープログラムを初期化して、WebGLがデータの描画方法を認識できるようにします
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
}

// 指定されたタイプのシェーダーを作成し、ソースをアップロードしてコンパイルします。
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  console.log(gl.COMPILE_STATUS);
  console.log('loadShader');
  console.log(gl.getShaderParameter(shader, gl.COMPILE_STATUS));
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}


