import { mat4 } from './gl-matrix.js';

//main();
window.addEventListener('load', main);

function main() {
  const canvas = document.querySelector('#glcanvas');
  // Initialize the GL context
  const gl = canvas.getContext('webgl');

  // WebGL が使用可能で動作している場合にのみ続行します
  if (!gl) {
    alert(
      'Unable to initialize WebGL. Your browser or machine may not support it.'
    );
    return;
  }

  // Vertex shader program
  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;

  // Fragment shader program
  const fsSource = `
    varying lowp vec4 vColor;

    void main(void) {
      gl_FragColor = vColor;
    }
  `;

  // シェーダープログラムを初期化します。 これは、頂点などのすべての照明が確立される場所です。
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

  // シェーダープログラムを使用するために必要なすべての情報を収集します。 シェーダープログラムがaVertexPositionに使用している属性を検索し、均一な場所を検索します。
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(
        shaderProgram,
        'uProjectionMatrix'
      ),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };

  // ここで、描画するすべてのオブジェクトを作成するルーチンを呼び出します。
  const buffers = initBuffers(gl);

  drawScene(gl, programInfo, buffers);
}

//
// initBuffers
//
// 必要なバッファを初期化します。 このデモでは、1つのオブジェクト（単純な2次元の正方形）があります。
//
function initBuffers(gl) {
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];

  // 次に、位置のリストをWebGLに渡して、形状を作成します。 これを行うには、JavaScript配列からFloat32Arrayを作成し、それを使用して現在のバッファーを埋めます。
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  var colors = [
    1.0,
    1.0,
    1.0,
    1.0, // white
    1.0,
    0.0,
    0.0,
    1.0, // red
    0.0,
    1.0,
    0.0,
    1.0, // green
    0.0,
    0.0,
    1.0,
    1.0, // blue
  ];

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
    color: colorBuffer,
  };
}

function drawScene(gl, programInfo, buffers) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const fieldOfView = (45 * Math.PI) / 180;
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();
  // 注：glmatrix.jsには、結果を受け取る宛先として常に最初の引数があります。
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  const modelViewMatrix = mat4.create();

  // 次に、描画位置を、正方形の描画を開始する場所に少し移動します。
  mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);

  // 位置バッファからvertexPosition属性に位置を引き出す方法をWebGLに指示します。
  {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
  }

  {
    const numComponents = 4;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexColor,
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
  }

  gl.useProgram(programInfo.program);
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix
  );

  {
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }
}

// シェーダープログラムを初期化して、WebGLがデータの描画方法を認識できるようにします
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      'Unable to initialize the shader program: ' +
        gl.getProgramInfoLog(shaderProgram)
    );
    return null;
  }
  return shaderProgram;
}

// 指定されたタイプのシェーダーを作成し、ソースをアップロードしてコンパイルします。
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      'An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader)
    );
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}
