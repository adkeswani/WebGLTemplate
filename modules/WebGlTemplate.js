var gl;

var mvMatrix = glMatrix.mat4.create();
var pMatrix = glMatrix.mat4.create();

function initGl(canvas) 
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

function compileShader(script, isFragmentShader) 
{
    var shader;
    if (isFragmentShader)
    {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } 
    else
    {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } 

    gl.shaderSource(shader, script);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) 
    {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function initShaders(fragmentShaderScript, vertexShaderScript)
{
    var fragmentShader = compileShader(fragmentShaderScript, true);
    var vertexShader = compileShader(vertexShaderScript, false);

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

function setMatrixUniforms() 
{
    // Send JS matrices to GL
    gl.uniformMatrix4fv(shaderProgram.uPMatrix, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.uMVMatrix, false, mvMatrix);
}
