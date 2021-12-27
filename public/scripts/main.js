'use strict';

//main();
window.addEventListener('load', main);


function main() {
  const canvas = document.querySelector('#glcanvas');
  // Initialize the GL context
  const gl = canvas.getContext('webgl');

  // If we don't have a GL context, give up now
  // Only continue if WebGL is available and working

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser or machine may not support it.');
    return;
  }

  // Set clear color to black, fully opaque
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT);
  
  console.log('load');
}
