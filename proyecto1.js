//**********************************************************************************************************
//NOTA: ALGUNOS BOTONES NO FUNCIONAN SI HAY UNA TRANSICION ENTRE ESTADOS EN MARCHA (Esta hecho a proposito)
//**********************************************************************************************************
var gl, program;
var myTorus;
var myZeta = 0.5, myPhi = Math.PI/3.0, radius = 1.5, fovy = 1.4;

var modelMatrix, modelViewMatrix;
var idMyColor;
var conoTr, stair;

var matA = mat4.create();
var matB = mat4.create();
var matC = mat4.create();
var matD = mat4.create();
var matE = mat4.create();
var matF = mat4.create();
var matG = mat4.create();
var matH = mat4.create();

var inclinationAngle = Math.PI/6.0;
var inclinationSpeed = 0.07;
var rotationAngle = 0;
var rotationSpeed = 0.04;

var bajando = 2;
var barAngle = 3*Math.PI/4;

var time = 0; //variable del M.A.S.

//interpolaciones y rows
var actualRows = 2;
var objectiveRows = 2;
var interpolateStep = 0.0;

var interval;
var play = false; //animacion
var drawLines = false; //lineas o triangulos rellenos

var lightMode = 0;

var working = 1; //si esta en marcha o no la atraccion
var totalSpeed = rotationSpeed; //para las transiciones de apagado/arranque


function getWebGLContext() {

  var canvas = document.getElementById("myCanvas");

  try {
    return canvas.getContext("webgl2",{antialias:true});
  }
  catch(e) {
  }

  return null;

}

function initShaders() {
    
  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, document.getElementById("myVertexShader").text);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(vertexShader));
    return null;
  }
 
  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, document.getElementById("myFragmentShader").text);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    alert(gl.getShaderInfoLog(fragmentShader));
    return null;
  }
  
  program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  
  gl.linkProgram(program);
    
  gl.useProgram(program);
    
  program.vertexPositionAttribute = gl.getAttribLocation(program, "VertexPosition");
  gl.enableVertexAttribArray(program.vertexPositionAttribute);
  gl.enable(gl.DEPTH_TEST);
  
  program.modelViewMatrixIndex  = gl.getUniformLocation(program,"modelViewMatrix");
  program.projectionMatrixIndex = gl.getUniformLocation(program,"projectionMatrix");

}

function initRendering() {

  gl.clearColor(0.0, 0.2, 0.5 ,1.0); //COLOR DE FONDO
  gl.lineWidth(1.5);

}

function initBuffers(model) {
    
  model.idBufferVertices = gl.createBuffer ();
  gl.bindBuffer (gl.ARRAY_BUFFER, model.idBufferVertices);
  gl.bufferData (gl.ARRAY_BUFFER, new Float32Array(model.vertices), gl.STATIC_DRAW);
    
  model.idBufferIndices = gl.createBuffer ();
  gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
  gl.bufferData (gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(model.indices), gl.STATIC_DRAW);

}

function draw(model){
	if (drawLines)
		drawWire(model);
	else
		drawFull(model);
}

function drawWire(model) {
    
  gl.bindBuffer (gl.ARRAY_BUFFER, model.idBufferVertices);
  gl.vertexAttribPointer (program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    
  gl.bindBuffer (gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
  for (var i = 0; i < model.indices.length; i += 3)
    gl.drawElements (gl.LINE_LOOP, 3, gl.UNSIGNED_SHORT, i*2);

}

function drawFull(model) {
    
    gl.bindBuffer (gl.ARRAY_BUFFER, model.idBufferVertices);
	gl.vertexAttribPointer (program.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.idBufferIndices);
    for (var i = 0; i < model.indices.length; i += 3)
		gl.drawElements (gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, i*2);
}

function drawObject(){
    

    
    //IDEA: DIBUJAR LA ZONA DONDE SE SUBE A LA SILLA (y escaleras o algo)
    
    idMyColor = gl.getUniformLocation(program, "myColor");

    // Calcula la matriz de transformacion del modelo-vista
    modelMatrix     = mat4.create();
    modelViewMatrix = mat4.create();
    
    //Llamar a funciones para dibujar los elementos
    
    drawBody();
    
    
    for (i=0; i<8; i++){
        drawArm(rotationAngle+Math.PI/4.0*i, interpolate(actualRows, objectiveRows, interpolateStep, i)); //La rotacion es cada uno de los angulos, la inclinacion son -30 grados por ahora
    }
}

/* ************************************************************
 * el angulo de rotacion es para dibujar los 8 brazos (rota en z)
 * la inclinacion es lo levantado que este el brazo (esto se usara cuando hagamos que se mueva)
 * ************************************************************
 */

function drawBody(){ 

//Rotacion de los cilindros y conos.
    mat4.fromRotation(matE, rotationAngle, [0, 1, 0]);    

//Suelo

    gl.uniform4f (idMyColor, 0.5, 0.5, 0.5, 1.0);
    mat4.fromScaling(matC,  [2.5, 2.5, 2.5]);
    mat4.fromTranslation(matA, [0, -0.51, 0]);
    mat4.multiply(modelMatrix, matA, matC);
    mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);
    gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, modelViewMatrix);
    
    draw(examplePlane);

//Cilindro Base

    gl.uniform4f (idMyColor, 0.7, 0.45, 0.7, 1.0); 
    mat4.fromScaling(matC,  [0.15, 0.15, 0.11]);
    mat4.fromTranslation(matA, [0, -0.51, 0]);
    mat4.fromRotation(matD, -Math.PI/2, [1, 0, 0]);
    mat4.multiply(modelMatrix, matD, matC);
    mat4.multiply(modelMatrix, matA, modelMatrix);
    mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);
    gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, modelViewMatrix);

    draw(exampleCylinder);


//Tapa del cilindro base

    mat4.fromScaling(matC,  [0.15, 0.15, 0.1]);
    mat4.fromTranslation(matA, [0, -0.4, 0]);
    mat4.fromRotation(matD, -Math.PI/2, [1, 0, 0]);
    mat4.multiply(modelMatrix, matD, matC);
    mat4.multiply(modelMatrix, matA, modelMatrix);
    mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);
    gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, modelViewMatrix);

    draw(exampleCover);


//Cilindro Bajo
    gl.uniform4f (idMyColor, 0.8, 0.5, 0.8, 1.0); 
    mat4.fromScaling(matC,  [0.1, 0.1, 0.2]);
    mat4.fromTranslation(matA, [0, -0.4, 0]);
    mat4.fromRotation(matD, -Math.PI/2, [1, 0, 0]);
    mat4.multiply(modelMatrix, matD, matC);
    mat4.multiply(modelMatrix, matA, modelMatrix);
    mat4.multiply(modelMatrix, matE, modelMatrix);
    mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);
    gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, modelViewMatrix);

    draw(exampleCylinder);


//Tapa del cilindro bajo

    mat4.fromScaling(matC,  [0.1, 0.1, 0.3]);
    mat4.fromTranslation(matA, [0, -0.2, 0]);
    mat4.fromRotation(matD, -Math.PI/2, [1, 0, 0]);
    mat4.multiply(modelMatrix, matD, matC);
    mat4.multiply(modelMatrix, matA, modelMatrix);
    mat4.multiply(modelMatrix, matE, modelMatrix);
    mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);
    gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, modelViewMatrix);

    draw(exampleCover);


//Cilindro Alto

    gl.uniform4f (idMyColor, 0.2, 0.4, 0.5, 1.0); 
    mat4.fromScaling(matC,  [0.08, 0.08, 0.27]);
    mat4.fromTranslation(matA, [0, -0.2, 0]);
    mat4.fromRotation(matD, -Math.PI/2, [1, 0, 0]);
    mat4.multiply(modelMatrix, matD, matC);
    mat4.multiply(modelMatrix, matA, modelMatrix);
    mat4.multiply(modelMatrix, matE, modelMatrix);
    mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);
    gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, modelViewMatrix);

    draw(exampleCylinder);


// Cono Truncado Arriba del cilindro alto
    
    gl.uniform4f (idMyColor, 0.6, 0.3, 0.6, 1.0); 
    mat4.fromScaling(matC,  [1, 1, 0.05]);
    mat4.fromTranslation(matA, [0, 0.07, 0]);
    mat4.fromRotation(matD, -Math.PI/2, [1, 0, 0]);
    mat4.multiply(modelMatrix, matD, matC);
    mat4.multiply(modelMatrix, matA, modelMatrix);
    mat4.multiply(modelMatrix, matE, modelMatrix);
    mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);
    gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, modelViewMatrix);

    conoTr = conoTruncado(0.15, 0.1);
    initBuffers(conoTr);
    draw(conoTr);


//Cilindro Decorativo

    gl.uniform4f (idMyColor, 0.7, 0.4, 1.0, 1.0); 
    mat4.fromScaling(matC,  [0.12, 0.12, 0.06]);
    mat4.fromTranslation(matA, [0, 0.12, 0]);
    mat4.fromRotation(matD, -Math.PI/2, [1, 0, 0]);
    mat4.multiply(modelMatrix, matD, matC);
    mat4.multiply(modelMatrix, matA, modelMatrix);
    mat4.multiply(modelMatrix, matE, modelMatrix);
    mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);
    gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, modelViewMatrix);

    draw(exampleCylinder);
    
    //Luces
    for (var j = 0; j<12; j++){
        if (lightMode===2)
            lightColor(Math.trunc(j/2));
        else
            lightColor(j);

        mat4.fromTranslation(matA, [0, 0.135, 0.12]);
        mat4.fromRotation(matD, rotationAngle+Math.PI/6*j, [0, 1, 0]);
        mat4.fromScaling(matC,  [0.01, 0.01, 0.01]);


        mat4.multiply(modelMatrix, matA, matC);
        mat4.multiply(modelMatrix, matD, modelMatrix);

        mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);
        gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, modelViewMatrix);

        draw(exampleCone);
        
        mat4.fromTranslation(matA, [0, 0.165, 0.12]);
        mat4.multiply(modelMatrix, matA, matC);
        mat4.multiply(modelMatrix, matD, modelMatrix);

        mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);
        gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, modelViewMatrix);

        draw(exampleCone);
    }


// Cono Truncado Encima del cilindro decorativo
    
    gl.uniform4f (idMyColor, 0.6, 0.3, 0.6, 1.0);  
    mat4.fromScaling(matC,  [1, 1, 0.05]);
    mat4.fromTranslation(matA, [0, 0.18, 0]);
    mat4.fromRotation(matD, -Math.PI/2, [1, 0, 0]);
    mat4.multiply(modelMatrix, matD, matC);
    mat4.multiply(modelMatrix, matA, modelMatrix);
    mat4.multiply(modelMatrix, matE, modelMatrix);
    mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);
    gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, modelViewMatrix);

    conoTr = conoTruncado(0.1, 0.15);
    initBuffers(conoTr);
    draw(conoTr);
    
    //Cilindro Decorativo

    gl.uniform4f (idMyColor, 0.6, 0.2, 0.5, 0.7); 
    mat4.fromScaling(matC,  [0.1, 0.1, 0.03]);
    mat4.fromTranslation(matA, [0, 0.23, 0]);
    mat4.fromRotation(matD, -Math.PI/2, [1, 0, 0]);
    mat4.multiply(modelMatrix, matD, matC);
    mat4.multiply(modelMatrix, matA, modelMatrix);
    mat4.multiply(modelMatrix, matE, modelMatrix);
    mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);
    gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, modelViewMatrix);

    draw(exampleCylinder);
    
    mat4.fromScaling(matC,  [1, 1, 0.03]);
    mat4.fromTranslation(matA, [0, 0.26, 0]);
    mat4.fromRotation(matD, -Math.PI/2, [1, 0, 0]);
    mat4.multiply(modelMatrix, matD, matC);
    mat4.multiply(modelMatrix, matA, modelMatrix);
    mat4.multiply(modelMatrix, matE, modelMatrix);
    mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);
    gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, modelViewMatrix);

    conoTr = conoTruncado(0.05, 0.1);
    initBuffers(conoTr);
    draw(conoTr);
    



//Escaleras

    for (i =0; i<7; i++){
        var r = 1-0.05*i;
        var h = -0.51+0.025*i;
        var factor = 0.015*(7-i)+(1-2*(i%2))*0.015;
        gl.uniform4f (idMyColor, 0.4-factor, 0.4-factor, 0.6-factor, 1.0); 
        mat4.fromTranslation(matA, [0, h, 0]);
        mat4.fromScaling(matC,  [1.0, 1.0, 0.025]);
        mat4.fromRotation(matD, -Math.PI/2, [1, 0, 0]);
        mat4.multiply(modelMatrix, matD, matC);
        mat4.multiply(modelMatrix, matA, modelMatrix);
        mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);
        gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, modelViewMatrix);

        stair = escalera(r, 0.3);
        initBuffers(stair);
        draw(stair);
        
        var hueco = (r*0.828-0.3)/16;
        
        mat4.fromScaling(matC,  [0.01, 0.01, 0.01]);
        
        for (var m = 0; m<8; m++){
            mat4.fromRotation(matD, Math.PI/4*m, [0, 1, 0]);
            for (var j = 0; j<15; j++){
                if (lightMode !==2)
                    lightColor(j+m*15);
                else
                    lightColor(j);

                mat4.fromTranslation(matA, [-(7-j)*(0.02+hueco), h+0.0125, r]);
                

                mat4.multiply(modelMatrix, matA, matC);
                mat4.multiply(modelMatrix, matD, modelMatrix);

                mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);
                gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, modelViewMatrix);

                draw(exampleCone);
            }
        }

    }
    
}

function drawChair(rotation, inclination){ 
    mat4.fromRotation(matE, barAngle, [1, 0, 0]);
    mat4.fromRotation(matH, rotation, [0, 1, 0]);
    mat4.fromRotation(matG, inclination, [0, 0, -1]);
    mat4.fromTranslation(matF, [-0.1, 0, 0]);
    var xsilla = -0.49;
    var ysilla = 0.133;
    var zsilla = -0.035;
        
    
    //Respaldo
    gl.uniform4f (idMyColor, 0.6, 0.3, 0.6, 1.0);
    mat4.fromTranslation(matA, [xsilla, ysilla-0.03, zsilla]);
    mat4.fromScaling(matB,  [0.24, 0.1, 0.016]);
    mat4.multiply(modelMatrix, matA, matB);
    mat4.multiply(modelMatrix, matG, modelMatrix);
    mat4.multiply(modelMatrix, matF, modelMatrix);
    mat4.multiply(modelMatrix, matH, modelMatrix);
    mat4.fromRotation(matB, Math.PI, [0, 1, 0]);
    mat4.multiply(modelMatrix, matB, modelMatrix);
    mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);
    gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, modelViewMatrix);
    draw(exampleCube);
    
    //Asiento
    mat4.fromTranslation(matA, [xsilla, ysilla-0.099, zsilla+0.032]); //-0.1
    mat4.fromScaling(matB,  [0.24, 0.018, 0.08]);
    mat4.multiply(modelMatrix, matA, matB);
    mat4.multiply(modelMatrix, matG, modelMatrix);
    mat4.multiply(modelMatrix, matF, modelMatrix);
    mat4.multiply(modelMatrix, matH, modelMatrix);
    mat4.fromRotation(matB, Math.PI, [0, 1, 0]);
    mat4.multiply(modelMatrix, matB, modelMatrix);
    mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);
    gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, modelViewMatrix);
    draw(exampleCube);
    
    //Cabecero
    gl.uniform4f (idMyColor, 0.55, 0.27, 0.55, 1.0);
    mat4.fromTranslation(matA, [xsilla-0.12, ysilla, zsilla+0.008]);
    mat4.fromScaling(matB,  [0.02, 0.01, 0.24]);
    mat4.fromRotation(matC, Math.PI/2.0, [0, 0, 1]);
    mat4.fromRotation(matD, Math.PI/2.0, [0, 1, 0]);
    mat4.multiply(modelMatrix, matC, matB);
    mat4.multiply(modelMatrix, matD, modelMatrix);
    mat4.multiply(modelMatrix, matA, modelMatrix);
    mat4.multiply(modelMatrix, matG, modelMatrix);
    mat4.multiply(modelMatrix, matF, modelMatrix);
    mat4.multiply(modelMatrix, matH, modelMatrix);
    mat4.fromRotation(matB, Math.PI, [0, 1, 0]);
    mat4.multiply(modelMatrix, matB, modelMatrix);
    mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);
    gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, modelViewMatrix);
    draw(halfCylinder);
    
    //Borde
    mat4.fromTranslation(matA, [xsilla-0.12, ysilla-0.099, zsilla+0.072]);
    mat4.fromScaling(matB,  [0.009, 0.009, 0.24]);
    mat4.fromRotation(matC, Math.PI/2.0, [0, 0, 1]);
    mat4.fromRotation(matD, Math.PI/2.0, [0, 1, 0]);
    mat4.multiply(modelMatrix, matC, matB);
    mat4.multiply(modelMatrix, matD, modelMatrix);
    mat4.multiply(modelMatrix, matA, modelMatrix);
    mat4.multiply(modelMatrix, matG, modelMatrix);
    mat4.multiply(modelMatrix, matF, modelMatrix);
    mat4.multiply(modelMatrix, matH, modelMatrix);
    mat4.fromRotation(matB, Math.PI, [0, 1, 0]);
    mat4.multiply(modelMatrix, matB, modelMatrix);
    mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);
    gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, modelViewMatrix);
    draw(halfCylinder);
	
    //Barra
    gl.uniform4f (idMyColor, 0.2, 0.2, 0.2, 1.0);
    mat4.fromTranslation(matA, [-0.12, 0.08, 0]);
    mat4.fromScaling(matB,  [0.01, 0.01, 0.24]);
    mat4.fromRotation(matC, Math.PI/2.0, [0, 0, 1]);
    mat4.fromRotation(matD, Math.PI/2.0, [0, 1, 0]);
    mat4.multiply(modelMatrix, matC, matB);
    mat4.multiply(modelMatrix, matD, modelMatrix);
    mat4.multiply(modelMatrix, matA, modelMatrix);
    mat4.multiply(modelMatrix, matE, modelMatrix);
    mat4.fromTranslation(matA, [xsilla, ysilla, zsilla]);
    mat4.multiply(modelMatrix, matA, modelMatrix)
    mat4.multiply(modelMatrix, matG, modelMatrix);
    mat4.multiply(modelMatrix, matF, modelMatrix);
    mat4.multiply(modelMatrix, matH, modelMatrix);
    mat4.fromRotation(matB, Math.PI, [0, 1, 0]);
    mat4.multiply(modelMatrix, matB, modelMatrix);
    mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);
    gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, modelViewMatrix);
    draw(exampleCylinder);
    
    //Caja 1
    gl.uniform4f (idMyColor, 0.8, 0.8, 0.8, 1.0);
    mat4.fromTranslation(matA, [-0.1225, 0.04, 0]);
    mat4.fromScaling(matB,  [0.005, 0.08, 0.02]);
    mat4.multiply(modelMatrix, matA, matB);
    mat4.multiply(modelMatrix, matE, modelMatrix);
    mat4.fromTranslation(matA, [xsilla, ysilla, zsilla]);
    mat4.multiply(modelMatrix, matA, modelMatrix)
    mat4.multiply(modelMatrix, matG, modelMatrix);
    mat4.multiply(modelMatrix, matF, modelMatrix);
    mat4.multiply(modelMatrix, matH, modelMatrix);
    mat4.fromRotation(matB, Math.PI, [0, 1, 0]);
    mat4.multiply(modelMatrix, matB, modelMatrix);
    mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);
    gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, modelViewMatrix);
    draw(exampleCube);
    
    //Caja 2
    mat4.fromTranslation(matA, [0.1225, 0.04, 0]);
    mat4.fromScaling(matB,  [0.005, 0.08, 0.02]);
    mat4.multiply(modelMatrix, matA, matB);
    mat4.multiply(modelMatrix, matE, modelMatrix);
    mat4.fromTranslation(matA, [xsilla, ysilla, zsilla]);
    mat4.multiply(modelMatrix, matA, modelMatrix)
    mat4.multiply(modelMatrix, matG, modelMatrix);
    mat4.multiply(modelMatrix, matF, modelMatrix);
    mat4.multiply(modelMatrix, matH, modelMatrix);
    mat4.fromRotation(matB, Math.PI, [0, 1, 0]);
    mat4.multiply(modelMatrix, matB, modelMatrix);
    mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);
    gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, modelViewMatrix);
    draw(exampleCube);
    
    //Semicirculos centrales
    mat4.fromTranslation(matA, [-0.125, 0, 0]);
    mat4.fromScaling(matB,  [0.01, 0.01, 0.005]);
    mat4.fromRotation(matC, Math.PI/2.0, [0, 1, 0]);
    mat4.fromRotation(matD, Math.PI, [0, 0, 1]);
    mat4.multiply(modelMatrix, matB, matD);
    mat4.multiply(modelMatrix, matC, modelMatrix);
    mat4.multiply(modelMatrix, matA, modelMatrix);
    mat4.multiply(modelMatrix, matE, modelMatrix);
    mat4.fromTranslation(matA, [xsilla, ysilla, zsilla]);
    mat4.multiply(modelMatrix, matA, modelMatrix)
    mat4.multiply(modelMatrix, matG, modelMatrix);
    mat4.multiply(modelMatrix, matF, modelMatrix);
    mat4.multiply(modelMatrix, matH, modelMatrix);
    mat4.fromRotation(matB, Math.PI, [0, 1, 0]);
    mat4.multiply(modelMatrix, matB, modelMatrix);
    mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);
    gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, modelViewMatrix);
    draw(halfCylinder);
    
    mat4.fromTranslation(matA, [0.120, 0, 0]);
    mat4.fromScaling(matB,  [0.01, 0.01, 0.005]);
    mat4.fromRotation(matC, Math.PI/2.0, [0, 1, 0]);
    mat4.fromRotation(matD, Math.PI, [0, 0, 1]);
    mat4.multiply(modelMatrix, matB, matD);
    mat4.multiply(modelMatrix, matC, modelMatrix);
    mat4.multiply(modelMatrix, matA, modelMatrix);
    mat4.multiply(modelMatrix, matE, modelMatrix);
    mat4.fromTranslation(matA, [xsilla, ysilla, zsilla]);
    mat4.multiply(modelMatrix, matA, modelMatrix)
    mat4.multiply(modelMatrix, matG, modelMatrix);
    mat4.multiply(modelMatrix, matF, modelMatrix);
    mat4.multiply(modelMatrix, matH, modelMatrix);
    mat4.fromRotation(matB, Math.PI, [0, 1, 0]);
    mat4.multiply(modelMatrix, matB, modelMatrix);
    mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);
    gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, modelViewMatrix);
    draw(halfCylinder);
    
    //Semicirculos barra
    mat4.fromTranslation(matA, [-0.125, 0.08, 0]);
    mat4.fromScaling(matB,  [0.01, 0.01, 0.005]);
    mat4.fromRotation(matC, Math.PI/2.0, [0, 1, 0]);
    mat4.multiply(modelMatrix, matC, matB);
    mat4.multiply(modelMatrix, matA, modelMatrix);
    mat4.multiply(modelMatrix, matE, modelMatrix);
    mat4.fromTranslation(matA, [xsilla, ysilla, zsilla]);
    mat4.multiply(modelMatrix, matA, modelMatrix)
    mat4.multiply(modelMatrix, matG, modelMatrix);
    mat4.multiply(modelMatrix, matF, modelMatrix);
    mat4.multiply(modelMatrix, matH, modelMatrix);
    mat4.fromRotation(matB, Math.PI, [0, 1, 0]);
    mat4.multiply(modelMatrix, matB, modelMatrix);
    mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);
    gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, modelViewMatrix);
    draw(halfCylinder);
    
    mat4.fromTranslation(matA, [0.120, 0.08, 0]);
    mat4.fromScaling(matB,  [0.01, 0.01, 0.005]);
    mat4.fromRotation(matC, Math.PI/2.0, [0, 1, 0]);
    mat4.multiply(modelMatrix, matC, matB);
    mat4.multiply(modelMatrix, matA, modelMatrix);
    mat4.multiply(modelMatrix, matE, modelMatrix);
    mat4.fromTranslation(matA, [xsilla, ysilla, zsilla]);
    mat4.multiply(modelMatrix, matA, modelMatrix)
    mat4.multiply(modelMatrix, matG, modelMatrix);
    mat4.multiply(modelMatrix, matF, modelMatrix);
    mat4.multiply(modelMatrix, matH, modelMatrix);
    mat4.fromRotation(matB, Math.PI, [0, 1, 0]);
    mat4.multiply(modelMatrix, matB, modelMatrix);
    mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);
    gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, modelViewMatrix);
    draw(halfCylinder);
	
    //Cilindros 1
    mat4.fromTranslation(matA, [xsilla-0.1, ysilla-0.08, zsilla]);
    mat4.fromScaling(matB,  [0.005, 0.005, 0.01]);
    mat4.fromRotation(matC, Math.PI/2.0, [1, 0, 0]);
    mat4.multiply(modelMatrix, matC, matB);
    mat4.multiply(modelMatrix, matA, modelMatrix);
    mat4.multiply(modelMatrix, matG, modelMatrix);
    mat4.multiply(modelMatrix, matF, modelMatrix);
    mat4.multiply(modelMatrix, matH, modelMatrix);
    mat4.fromRotation(matB, Math.PI, [0, 1, 0]);
    mat4.multiply(modelMatrix, matB, modelMatrix);
    mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);
    gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, modelViewMatrix);
    draw(exampleCylinder);
    
    mat4.fromTranslation(matA, [xsilla+0.1, ysilla-0.08, zsilla]);
    mat4.fromScaling(matB,  [0.005, 0.005, 0.01]);
    mat4.fromRotation(matC, Math.PI/2.0, [1, 0, 0]);
    mat4.multiply(modelMatrix, matC, matB);
    mat4.multiply(modelMatrix, matA, modelMatrix);
    mat4.multiply(modelMatrix, matG, modelMatrix);
    mat4.multiply(modelMatrix, matF, modelMatrix);
    mat4.multiply(modelMatrix, matH, modelMatrix);
    mat4.fromRotation(matB, Math.PI, [0, 1, 0]);
    mat4.multiply(modelMatrix, matB, modelMatrix);
    mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);
    gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, modelViewMatrix);
    draw(exampleCylinder);
}

function bajarbarra(){
    if (bajando%2 == 0){
            bajando ++;
    }
}

function drawArm(rotation, inclination){ //ALEJANDRO
    gl.uniform4f (idMyColor, 0.7, 0.4, 0.7, 1.0); //cambiar color
    
    
    //***************************************
    //**              brazo                **
    //***************************************
    
    
    mat4.fromTranslation(matA, [0.3, 0, 0]);
    mat4.fromScaling(matC,  [0.6, 0.05, 0.05]);
    mat4.fromRotation(matD, rotation, [0, 1, 0]);
    mat4.fromRotation(matE, inclination, [0, 0, 1]);
    
    mat4.multiply(modelMatrix, matA, matC);
    mat4.multiply(modelMatrix, matE, modelMatrix);
    mat4.fromTranslation(matA, [0.1, 0, 0]);
    mat4.multiply(modelMatrix, matA, modelMatrix);
    mat4.multiply(modelMatrix, matD, modelMatrix);

    mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);
    gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, modelViewMatrix);
    
    draw(exampleCube);
    
    mat4.fromTranslation(matA, [0.6, 0, -0.025]);
    mat4.fromRotation(matB, Math.PI/2.0, [0, 0, 1]);
    mat4.fromScaling(matC,  [0.025, -0.025, 0.05]);
    mat4.fromRotation(matD, rotation, [0, 1, 0]);
    mat4.fromRotation(matE, inclination, [0, 0, 1]);
    
    mat4.multiply(modelMatrix, matB, matC);
    mat4.multiply(modelMatrix, matA, modelMatrix);
    mat4.multiply(modelMatrix, matE, modelMatrix);
    mat4.fromTranslation(matA, [0.1, 0, 0]);
    mat4.multiply(modelMatrix, matA, modelMatrix);
    mat4.multiply(modelMatrix, matD, modelMatrix);
    mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);
    gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, modelViewMatrix);
    
    draw(halfCylinder);
    
    //***************************************
    //**            enganche               **
    //***************************************
    
    
    mat4.fromTranslation(matA, [0.1, 0, -0.025]);
    mat4.fromRotation(matB, Math.PI/2.0, [0, 0, 1]);
    mat4.fromScaling(matC,  [0.025, 0.025, 0.05]);
    mat4.fromRotation(matD, rotation, [0, 1, 0]);
    mat4.fromRotation(matE, inclination, [0, 0, 1]);
    
    mat4.multiply(modelMatrix, matB, matC);
    mat4.multiply(modelMatrix, matE, modelMatrix);
    mat4.multiply(modelMatrix, matA, modelMatrix);
    mat4.multiply(modelMatrix, matD, modelMatrix);
    mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);
    gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, modelViewMatrix);
    
    draw(halfCylinder);
    
    
    //***************************************
    //** la cosa que lo hace subir y bajar **
    //***************************************
    
    
    var x = 0.1 * Math.sin(inclination) + 0.3;
    var h = 0.1 * Math.cos(inclination);
    
    //angulo entre enganche de la palanca y la base (es 30 cuando la inclinacion es el minimo, -30)
    var downAngle = Math.atan(h/x); //calcular (ahora solo vale para -30)
    
    mat4.fromRotation(matC, rotation, [0, 1, 0]);
    mat4.fromTranslation(matA, [0.1, -0.3, 0]);
    mat4.fromRotation(matB, -downAngle, [0, 0, 1]);
    
    mat4.multiply(matF, matA, matB);
    mat4.multiply(matF, matC, matF); //matriz del subconjunto (aplicar al final)
    
    
    mat4.fromTranslation(matA, [0, 0.08, 0]);
    mat4.fromScaling(matC,  [0.03, 0.16, 0.03]);
    mat4.multiply(modelMatrix, matA, matC);
    mat4.multiply(modelMatrix, matF, modelMatrix);
    mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);
    gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, modelViewMatrix);
    
    gl.uniform4f (idMyColor, 0.8, 0.8, 0.8, 1.0);
    draw(exampleCube);
    
    mat4.fromTranslation(matA, [0, 0, -0.015]);
    mat4.fromScaling(matC,  [0.015, -0.015, 0.03]);
    mat4.multiply(modelMatrix, matA, matC);
    mat4.multiply(modelMatrix, matF, modelMatrix);
    mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);
    gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, modelViewMatrix);
    
    draw(halfCylinder);
    
    var length = Math.abs(x-0.02/Math.cos(inclination))/Math.cos(downAngle)-0.16; //para angulos arbitrarios (-30 a 30)
     
    mat4.fromTranslation(matA, [0, 0.16+length, 0]);
    mat4.fromRotation(matB, Math.PI/2.0, [1, 0, 0]);
    mat4.fromScaling(matC,  [0.005, length, 0.005]);
    mat4.multiply(modelMatrix, matC, matB);
    mat4.multiply(modelMatrix, matA, modelMatrix);
    mat4.multiply(modelMatrix, matF, modelMatrix);
    mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);
    gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, modelViewMatrix);
    
    gl.uniform4f (idMyColor, 0.1, 0.1, 0.1, 1.0);
    draw(exampleCylinder);
    draw(exampleCover);
    
    
    //***************************************
    //**             silla                 **
    //***************************************
    
    
    gl.uniform4f (idMyColor, 0.7, 0.4, 0.7, 1.0);
    drawChair(rotation, inclination); //Esto va aqui porque se dibuja junto al brazo
    
    
    //***************************************
    //**             luces                 **
    //***************************************
    mat4.fromRotation(matD, rotation, [0, 1, 0]);
    mat4.fromRotation(matE, inclination, [0, 0, 1]);
    mat4.fromTranslation(matB, [0.1, 0, 0]);

    for (var i = 0; i<20; i++){
        //Elegir color de luz, segun el modo
        lightColor(i);
        
        mat4.fromTranslation(matA, [0.03*(i+1), 0, 0.025]);
        mat4.fromScaling(matC,  [0.01, 0.01, 0.01]);
        

        mat4.multiply(modelMatrix, matA, matC);
        mat4.multiply(modelMatrix, matE, modelMatrix);
        mat4.multiply(modelMatrix, matB, modelMatrix);
        mat4.multiply(modelMatrix, matD, modelMatrix);

        mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);
        gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, modelViewMatrix);

        draw(exampleCone);
        
        mat4.fromTranslation(matA, [0.03*(i+1), 0, -0.025]);
        mat4.fromScaling(matC,  [0.01, 0.01, -0.01]);
        mat4.multiply(modelMatrix, matA, matC);
        mat4.multiply(modelMatrix, matE, modelMatrix);
        mat4.multiply(modelMatrix, matB, modelMatrix);
        mat4.multiply(modelMatrix, matD, modelMatrix);

        mat4.multiply(modelViewMatrix, getCameraMatrix(), modelMatrix);
        gl.uniformMatrix4fv(program.modelViewMatrixIndex, false, modelViewMatrix);

        draw(exampleCone);
    }


}

function interpolate(initRows, finalRows, step, i){
    if (working === 0) {
        return -inclinationAngle;
    }
    else if (working === 2){
        return inclinationAngle*Math.cos(inclinationSpeed*time+Math.PI/initRows*i)+(-inclinationAngle-inclinationAngle*Math.cos(inclinationSpeed*time+Math.PI/initRows*i))*step;
    }
    else if (working === 3){
        return -inclinationAngle+(inclinationAngle*Math.cos(inclinationSpeed*time+Math.PI/initRows*i)+inclinationAngle)*step;
    }
    else if (initRows === finalRows){
        return inclinationAngle*Math.cos(inclinationSpeed*time+Math.PI/initRows*i);
    } else {
        return inclinationAngle*Math.cos(inclinationSpeed*time+Math.PI/initRows*i)+(inclinationAngle*Math.cos(inclinationSpeed*time+Math.PI/finalRows*i)-inclinationAngle*Math.cos(inclinationSpeed*time+Math.PI/initRows*i))*step;
    }
}

function lightColor(i){
    var x;
    if (lightMode === 0){ //estatico
        if (i%4===0)
            gl.uniform4f (idMyColor, 1.0, 0.0, 0.0, 1.0); //Rojo
        else if (i%4===1)
            gl.uniform4f (idMyColor, 0.0, 1.0, 0.0, 1.0); //Verde
        else if (i%4===2)
            gl.uniform4f (idMyColor, 1.0, 1.0, 0.5, 1.0); //Amarillo
        else
            gl.uniform4f (idMyColor, 0.0, 0.8, 0.8, 1.0); //Cian
    }
    
    else if (lightMode === 1){ //movimiento hacia fuera
        x = (10+i-Math.trunc(time/10)%10);
        if (x%4===0)
            gl.uniform4f (idMyColor, 1.0, 0.0, 0.0, 1.0); //Rojo
        else if (x%4===1)
            gl.uniform4f (idMyColor, 0.0, 1.0, 0.0, 1.0); //Verde
        else if (x%4===2)
            gl.uniform4f (idMyColor, 1.0, 1.0, 0.5, 1.0); //Amarillo
        else
            gl.uniform4f (idMyColor, 0.0, 0.8, 0.8, 1.0); //Cian
    }

    else if (lightMode === 2){ //lineas
        x = (i+Math.trunc(time/2))%20;
        if ((Math.trunc(time/2)+i)%160<80){
            if (x<10)
                gl.uniform4f (idMyColor, 1.0, 0.0, 0.0, 1.0); //Rojo
            else
                gl.uniform4f (idMyColor, 1.0, 1.0, 0.5, 1.0); //Amarillo
        } else {
            if (x<10)
                gl.uniform4f (idMyColor, 0.0, 0.8, 0.8, 1.0); //Cian
            else
                gl.uniform4f (idMyColor, 0.0, 1.0, 0.0, 1.0); //Verde
        }
    }

    else if (lightMode === 3){ //alternado
        x = (Math.trunc(i/2)+Math.trunc(time/10))%2;
        if (x === 0){
            if ((Math.trunc(time/10))%20<10)
                gl.uniform4f (idMyColor, 1.0, 1.0, 0.5, 1.0); //Amarillo
            else
                gl.uniform4f (idMyColor, 1.0, 0.0, 0.0, 1.0); //Rojo
        } else {
            if ((Math.trunc(time/10))%20<10)
                gl.uniform4f (idMyColor, 0.0, 0.8, 0.8, 1.0); //Cian
            else
                gl.uniform4f (idMyColor, 0.0, 1.0, 0.0, 1.0); //Verde
        }
    }
}

function initPrimitives() {

  initBuffers(examplePlane);
  initBuffers(exampleCube);
  initBuffers(exampleCover);
  initBuffers(exampleCone);
  initBuffers(exampleCylinder);
  initBuffers(exampleSphere);
  initBuffers(halfCylinder);
  
}

function setProjection() {
    
  // obtiene la matriz de transformación de la proyección perspectiva
  var projectionMatrix  = mat4.create();
  mat4.perspective(projectionMatrix, fovy, 1.0, 0.1, 100.0);
  
  // envía la matriz de transformación de la proyección al shader de vértices
  gl.uniformMatrix4fv(program.projectionMatrixIndex,false,projectionMatrix);

}

function getCameraMatrix() {

  // coordenadas esféricas a rectangulares: https://en.wikipedia.org/wiki/Spherical_coordinate_system
  var x = radius * Math.sin(myPhi) * Math.sin(myZeta);
  var y = radius * Math.cos(myPhi);
  var z = radius * Math.sin(myPhi) * Math.cos(myZeta);

  return mat4.lookAt(mat4.create(), [x, y, z], [0, 0, 0], [0, 1, 0]);
    
}

function drawScene() {
    
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  setProjection();

  drawObject();
  

}

function frame(){
    time+=1;
    rotationAngle += rotationSpeed; 

	if (bajando == 1) {
		barAngle += 0.03;
		if(barAngle > 3*Math.PI/4){ barAngle = 3*Math.PI/4; bajando = 2; }
	}
	else if (bajando == 3) {
		barAngle -= 0.03;
		if(barAngle < 0){ barAngle = 0; bajando = 0; }
	}
    if (working === 2){ //transicion apagado
            if (interpolateStep<1){
                rotationSpeed = totalSpeed * (1-interpolateStep);
                interpolateStep+=0.01;
            } else if (bajando===2){
                bajarbarra();
            }
            else if (bajando===0){
                rotationSpeed = 0;
                working = 0;
                interpolateStep = 0.0;
            }

    }
    else if (working === 3){ //transicion encendido
            if (bajando===0){
                bajarbarra();
            }
            if (interpolateStep<1 && bajando===2){
                rotationSpeed = totalSpeed *interpolateStep;
                interpolateStep+=0.01;
            } 
            else if (bajando===2){
                rotationSpeed = totalSpeed;
                working = 1;
                interpolateStep = 0.0;
            }
    }
    else if (working === 1){
        if (actualRows !== objectiveRows){
                if (interpolateStep<1){
                        interpolateStep+=0.025;
                } else {
                        actualRows = objectiveRows;
                        interpolateStep = 0.0;
                }
        } 
    }

    requestAnimationFrame(drawScene);
}	

function initHandlers() {
	
    //BOTONES PLAY / PAUSE

    document.addEventListener("keydown",
	function (event) {
		switch (event.keyCode) {
			case 65: 
                            if (play){
                                clearInterval(interval);
                                play = false;
                            }
                            else {
                                interval = setInterval(frame, 20);
                                play = true;
                            } 
                            break; 
			case 66: 
                            if (actualRows === objectiveRows){
                                if (actualRows===1) objectiveRows = 4; else if (actualRows===4) objectiveRows = 2; else objectiveRows = 1;
                            }
                            break; 
			case 67: 
                            drawLines = !drawLines; 
                            break;
		}
                if (!play)
                    requestAnimationFrame(drawScene);
	},
    false);

  var mouseDown = false;
  var lastMouseX;
  var lastMouseY;

  var canvas = document.getElementById("myCanvas");

    canvas.addEventListener("mousedown",
        function(event) {
          mouseDown  = true;
          lastMouseX = event.clientX;
          lastMouseY = event.clientY;
        },
        false);

    canvas.addEventListener("mouseup",
        function() {
          mouseDown = false;
        },
        false);
  
    canvas.addEventListener("wheel",
    function (event) {
      
        var delta = 0.0;

        if (event.deltaMode == 0)
            delta = event.deltaY * 0.001;
        else if (event.deltaMode == 1)
            delta = event.deltaY * 0.03;
        else
            delta = event.deltaY;

        if (event.shiftKey == 1) { // fovy
          
            fovy *= Math.exp(-delta);
            fovy = Math.max (0.1, Math.min(3.0, fovy));
        
        
        } else {
        
            radius *= Math.exp(-delta);
            radius  = Math.max(Math.min(radius, 30), 0.05);
        
        }
      
        event.preventDefault();
        if (!play)
            requestAnimationFrame(drawScene);

    }, false);

    canvas.addEventListener("mousemove",
        function (event) {
      
        if (!mouseDown) {
            return;
        }
      
        var newX = event.clientX;
        var newY = event.clientY;
      
        myZeta -= (newX - lastMouseX) * 0.005;
        myPhi  -= (newY - lastMouseY) * 0.005;
        
        var margen = 0.01;
        myPhi = Math.min (Math.max(myPhi, margen), Math.PI - margen);
      
     
        lastMouseX = newX;
        lastMouseY = newY;
      
        event.preventDefault();
        if (!play)
            requestAnimationFrame(drawScene);
    },
    false);
    
    var botones = document.getElementsByTagName("button");
  
    for (var i = 0; i < botones.length; i++) {
        botones[i].addEventListener("click",
        function(){
            switch (this.innerHTML) {
            case "Play-Pause":
                if (play){
                    clearInterval(interval);
                    play = false;
                }
                else {
                    interval = setInterval(frame, 20);
                    play = true;
                } break;
            case "Draw mode":
                drawLines = !drawLines;
                break;
            case "Next frame":
                if (!play){
                    frame();
                }
                break;
            case "Turn on-off": //hacer interpolacion para que pare (con inclinacion -30) o arranque
                if (interpolateStep===0){ //no hay transiciones en marcha
                    if (working === 1){ //encendido
                        totalSpeed = rotationSpeed; //guarda la ultima velocidad, para interpolarla y despues arrancar con la misma
                        working = 2; //transicion de apagado
                    } else  if (working === 0){ //apagado
                        working = 3; //transicion de arranque
                    }
                }
            break;
              
        //Modos de movimiento (numero de ondas en el movimiento)
            case "Mode 1":
                if (actualRows === objectiveRows && working === 1)
                    objectiveRows = 1;
                break;
            case "Mode 2":
                if (actualRows === objectiveRows && working === 1)
                    objectiveRows = 2;
                break;
            case "Mode 3":
                if (actualRows === objectiveRows && working === 1)
                    objectiveRows = 4;
                break;
              
        //Rotation speed
            case "Less": 
                if (working === 1){
                    rotationSpeed -= 0.005;
                    if (rotationSpeed<0.02) rotationSpeed = 0.02;
                }
                    break;
            case "More": 
                if (working === 1){
                    rotationSpeed += 0.005;
                    if (rotationSpeed>0.15) rotationSpeed = 0.15;
                }
                break;
            case "Reset": 
                if (working === 1)
                    rotationSpeed = 0.04;
                    break;
              
        //light mode
            case "0": 
                lightMode = 0;
                break;
            case "1": 
                lightMode = 1;
                break;
            case "2": 
                lightMode = 2;
                break;
            case "3": 
                lightMode = 3;
                break;
            }
          
        if (!play)
            requestAnimationFrame(drawScene);
        },
        false);
    }
}   

function initWebGL() {
    
    gl = getWebGLContext();
    
    if (!gl) {
        alert("WebGL 2.0 no está disponible");
        return;
    }
    
    initShaders();
    initPrimitives();
    initRendering();
    initHandlers();
    requestAnimationFrame(drawScene);
}

initWebGL();
