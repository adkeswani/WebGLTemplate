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

var triangleVertexPositionBuffer;
var lastTime = 0;

function initBuffers()
{
    // Set up vertex buffers
    triangleVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    var vertices = [
        0.0,  0.0,  0.01,
        20.0, 0.0,  0.01,
        10.0, 10.0,  0.01
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    triangleVertexPositionBuffer.itemSize = 3;
    triangleVertexPositionBuffer.numItems = 3;
}

function drawScene() 
{
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    glMatrix.mat4.translate(mvMatrix, mvMatrix, glMatrix.vec3.fromValues(1.0, 0.0, 0.0));

    // Send vertex buffer to GL
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.aVertexPosition, triangleVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0); 
    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, triangleVertexPositionBuffer.numItems);
}

function tick(now)
{
    drawScene();
    if (lastTime != 0) 
    {
        var elapsed = now - lastTime;
    }

    lastTime = now;
    requestAnimationFrame(tick);
}

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
