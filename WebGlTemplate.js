var fragmentShaderScript = `
    precision mediump float;
    void main(void) 
    {
        gl_FragColor = vec4(0.4, 0.0, 1.0, 1.0);
    }
`

var vertexShaderScript = `
    attribute vec3 aVertexPosition; 

    uniform mat4 uMVMatrix;
    uniform mat4 uPMatrix;

    void main(void) 
    {
        gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
    }
`

function templateStart() 
{
    var canvas = document.getElementById("template");
    initGl(canvas);
    initShaders(fragmentShaderScript, vertexShaderScript);
    initMatrices();
    initBuffers();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    tick();
}
