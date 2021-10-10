var gl;

var mvMatrix = glMatrix.mat4.create();
var pMatrix = glMatrix.mat4.create();

var triangleVertexPositionBuffer;

var lastTime = 0;

function initGL(canvas) 
{
    try 
    {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } 
    catch (e) 
    {

    }

    if (!gl) 
    {
        alert("Could not initialise WebGL");
    }
}

function getShader(gl, id) 
{
    var shaderScript = document.getElementById(id);
    if (!shaderScript) 
    {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) 
    {
        if (k.nodeType == 3) 
        {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") 
    {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } 
    else if (shaderScript.type == "x-shader/x-vertex") 
    {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } 
    else 
    {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) 
    {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function initShaders() 
{
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) 
    {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    // Link JS and GL 
    shaderProgram.aVertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.aVertexPosition);

    shaderProgram.uPMatrix = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.uMVMatrix = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}

function initMatrices()
{
    glMatrix.mat4.ortho(pMatrix, -gl.viewportWidth / 2, gl.viewportWidth / 2, gl.viewportHeight / 2, -gl.viewportHeight / 2, -0.1, 0.1);
    glMatrix.mat4.identity(mvMatrix);
}

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

function setMatrixUniforms() 
{
    // Send JS matrices to GL
    gl.uniformMatrix4fv(shaderProgram.uPMatrix, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.uMVMatrix, false, mvMatrix);
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

function mazeStart() 
{
    var canvas = document.getElementById("maze");
    initGL(canvas);
    initShaders();
    initMatrices();
    initBuffers();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    tick();
}
