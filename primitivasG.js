// ---------------------------------------------------------------------------
// Primitivas geometricas basicas
// J. Ribelles, A. Lopez
// Mayo 2018
// ---------------------------------------------------------------------------

var examplePlane = {  // 4 vértices, 2 triángulos

    "vertices" : [-0.5, 0.0, 0.5,
                   0.5, 0.0, 0.5,
                   0.5, 0.0,-0.5,
                  -0.5, 0.0,-0.5],
    
    "indices" : [0, 1, 2, 0, 2, 3]

};
  
var exampleCube = {  // 8 vértices, 12 triángulos
    
    "vertices" : [-0.5,-0.5,  0.5,
                   0.5,-0.5,  0.5,
                   0.5, 0.5,  0.5,
                  -0.5, 0.5,  0.5,
                  -0.5,-0.5, -0.5,
                   0.5,-0.5, -0.5,
                   0.5, 0.5, -0.5,
                  -0.5, 0.5, -0.5],

    "indices" : [ 0, 1, 2, 0, 2, 3, 
                  1, 5, 6, 1, 6, 2,
                  3, 2, 6, 3, 6, 7,
                  5, 4, 7, 5, 7, 6,
                  4, 0, 3, 4, 3, 7,
                  4, 5, 1, 4, 1, 0]

};

var exampleCover = {  // 13 vértices, 12 triángulos

    "vertices" : [ 1,  0, 0,  0.866,  0.5,   0,  0.5,    0.866, 0, 
                   0,  1, 0, -0.5,    0.866, 0, -0.86,   0.5,   0, 
                  -1,  0, 0, -0.866, -0.5,   0, -0.5,   -0.866, 0, 
                   0, -1, 0,  0.5,   -0.866, 0,  0.866, -0.5,   0, 
                   0,  0, 0],
                     
    "indices" : [ 0, 1, 12, 1, 2, 12, 2, 3, 12, 3,  4, 12,  4,  5, 12,  5, 6, 12,  
                  6, 7, 12, 7, 8, 12, 8, 9, 12, 9, 10, 12, 10, 11, 12, 11, 0, 12]

};

var exampleCone = {  // 13 vértices, 12 triángulos

    "vertices" : [ 1,  0, 0,  0.866,  0.5,   0,  0.5,    0.866, 0, 
                   0,  1, 0, -0.5,    0.866, 0, -0.86,   0.5,   0, 
                  -1,  0, 0, -0.866, -0.5,   0, -0.5,   -0.866, 0, 
                   0, -1, 0,  0.5,   -0.866, 0,  0.866, -0.5,   0, 
                   0,  0, 1],
                     
    "indices" : [ 0, 1, 12, 1, 2, 12, 2, 3, 12, 3,  4, 12,  4,  5, 12,  5, 6, 12,  
                  6, 7, 12, 7, 8, 12, 8, 9, 12, 9, 10, 12, 10, 11, 12, 11, 0, 12]

};
                    
var exampleCylinder = {  // 24 vértices, 24 triángulos

    "vertices" : [ 1,  0, 0,  0.866,  0.5,   0,  0.5,    0.866, 0, 
                   0,  1, 0, -0.5,    0.866, 0, -0.86,   0.5,   0, 
                  -1,  0, 0, -0.866, -0.5,   0, -0.5,   -0.866, 0, 
                   0, -1, 0,  0.5,   -0.866, 0,  0.866, -0.5,   0,
                   1,  0, 1,  0.866,  0.5,   1,  0.5,    0.866, 1, 
                   0,  1, 1, -0.5,    0.866, 1, -0.86,   0.5,   1, 
                  -1,  0, 1, -0.866, -0.5,   1, -0.5,   -0.866, 1, 
                   0, -1, 1,  0.5,   -0.866, 1,  0.866, -0.5,   1],
    
    "indices" : [ 0,  1, 12, 1,  2, 13, 2,  3, 14,  3,  4, 15,  4,  5, 16,  5,  6, 17,  
                  6,  7, 18, 7,  8, 19, 8,  9, 20,  9, 10, 21, 10, 11, 22, 11,  0, 23,
                  1, 13, 12, 2, 14, 13, 3, 15, 14,  4, 16, 15,  5, 17, 16,  6, 18, 17,
                  7, 19, 18, 8, 20, 19, 9, 21, 20, 10, 22, 21, 11, 23, 22,  0, 12, 23]

};

var halfCylinder = { //medio cilindro cerrado con tapa

    "vertices" : [ 1,  0, 0,     0.866,  0.5,   0,       0.5,    0.866, 0, 
                   0,  1, 0,    -0.5,    0.866, 0,      -0.86,   0.5,   0, 
                  -1,  0, 0,     0,      0,     0,

                   1,  0, 1,     0.866,  0.5,   1,       0.5,    0.866, 1, 
                   0,  1, 1,    -0.5,    0.866, 1,      -0.86,   0.5,   1,
                  -1,  0, 1,     0,      0,     1],
    
    "indices" : [  0, 1, 8,   1, 2, 9 ,   2, 3, 10,  3, 4, 11,   4, 5, 12,  5,  6, 13,
                   0, 15, 7,  7, 14, 6,
                   1, 9, 8,   2, 10, 9,   3, 11, 10,  4, 12, 11,  5, 13, 12,  6, 14, 13,
                   7, 15, 14,  0, 8, 15,
                   0, 7, 1,     1, 7, 2,    2, 7, 3,    3, 7, 4,    4, 7, 5,    5, 7, 6,
                   15, 8, 9,   15, 9, 10,  15, 10, 11,   15, 11, 12,   15, 12, 13,   15, 13, 14
    ]

};

function conoTruncado(rS, rI) {
    var conoTrunc = {

        "vertices" : [ 1*rI, 0, 0,      0.866*rI,  0.5*rI,   0,       0.5*rI,    0.866*rI, 0, 
                       0,  1*rI, 0,     -0.5*rI,    0.866*rI, 0,      -0.86*rI,   0.5*rI,   0, 
                      -1*rI,  0, 0,     -0.866*rI, -0.5*rI,   0,      -0.5*rI,   -0.866*rI, 0, 
                       0, -1*rI, 0,      0.5*rI,   -0.866*rI, 0,       0.866*rI, -0.5*rI,   0,
                       1*rS,  0, 1,      0.866*rS,  0.5*rS,   1,       0.5*rS,    0.866*rS, 1, 
                       0,  1*rS, 1,     -0.5*rS,    0.866*rS, 1,      -0.86*rS,   0.5*rS,   1, 
                      -1*rS,  0, 1,     -0.866*rS, -0.5*rS,   1,      -0.5*rS,   -0.866*rS, 1, 
                       0, -1*rS, 1,      0.5*rS,   -0.866*rS, 1,       0.866*rS, -0.5*rS,   1,
                       0, 0, 0,          0, 0, 1],

        "indices" : [ 0,  1, 12, 1,  2, 13, 2,  3, 14,  3,  4, 15,  4,  5, 16,  5,  6, 17,  
                      6,  7, 18, 7,  8, 19, 8,  9, 20,  9, 10, 21, 10, 11, 22, 11,  0, 23,
                      1, 13, 12, 2, 14, 13, 3, 15, 14,  4, 16, 15,  5, 17, 16,  6, 18, 17,
                      7, 19, 18, 8, 20, 19, 9, 21, 20, 10, 22, 21, 11, 23, 22,  0, 12, 23, 
                      1, 0, 24, 2, 1, 24, 3, 2, 24, 4, 3, 24, 5, 4, 24, 6, 5, 24, 7, 6, 24,
                      8, 7, 24, 9, 8, 24, 10, 9, 24, 11, 10, 24, 0, 11, 24,
                      13, 12, 25, 14, 13, 25, 15, 14, 25, 16, 15, 25, 17, 16, 25, 18, 17, 25,
                      19, 18, 25, 20, 19, 25, 21, 20, 25, 22, 21, 25, 23, 22, 25, 12, 23, 25
        ]

    };
    return conoTrunc;
}

function escalera(rF, rD) { //octaedro con hueco
    var stair = { 

        "vertices" : [ -0.414*rF, 1*rF, 0,        0.414*rF, 1*rF, 0,        1*rF, 0.414*rF, 0,
                        1*rF, -0.414*rF, 0,       0.414*rF, -1*rF, 0,      -0.414*rF, -1*rF, 0,
                       -1*rF, -0.414*rF, 0,      -1*rF, 0.414*rF, 0,
                       -0.414*rD, 1*rD, 0,        0.414*rD, 1*rD, 0,        1*rD, 0.414*rD, 0,
                        1*rD, -0.414*rD, 0,       0.414*rD, -1*rD, 0,      -0.414*rD, -1*rD, 0,
                       -1*rD, -0.414*rD, 0,      -1*rD, 0.414*rD, 0,
                       -0.414*rF, 1*rF, 1,        0.414*rF, 1*rF, 1,        1*rF, 0.414*rF, 1,
                        1*rF, -0.414*rF, 1,       0.414*rF, -1*rF, 1,      -0.414*rF, -1*rF, 1,
                       -1*rF, -0.414*rF, 1,      -1*rF, 0.414*rF, 1,
                       -0.414*rD, 1*rD, 1,        0.414*rD, 1*rD, 1,        1*rD, 0.414*rD, 1,
                        1*rD, -0.414*rD, 1,       0.414*rD, -1*rD, 1,      -0.414*rD, -1*rD, 1,
                       -1*rD, -0.414*rD, 1,      -1*rD, 0.414*rD, 1
        ],

        "indices" : [   0, 1, 8, 1, 2, 9, 2, 3, 10, 3, 4, 11, 4, 5, 12, 5, 6, 13, 6, 7, 14, 7, 0, 15,
                        1, 9, 8, 2, 10, 9, 3, 11, 10, 4, 12, 11, 5, 13, 12, 6, 14, 13, 7, 15, 14, 0, 8, 15,
                        
                        17, 16, 24, 18, 17, 25, 19, 18, 26, 20, 19, 27, 21, 20, 28, 22, 21, 29, 23 ,22 ,30, 16, 23, 31,
                        17, 24, 25, 18, 25, 26, 19, 26, 27, 20, 27, 28, 21, 28, 29, 22, 29, 30, 23, 30, 31, 16, 31, 24, 
                        
                        8, 9, 24, 9, 10, 25, 10, 11, 26, 11, 12, 27, 12, 13, 28, 13, 14, 29, 14, 15, 30, 15, 8, 31,
                        9, 25, 24, 10, 26, 25, 11, 27, 26, 12, 28, 27, 13, 29, 28, 14, 30, 29, 15, 31, 30, 8, 24, 31, 
                        
                        17, 1, 0, 18, 2, 1, 19, 3, 2, 20, 4, 3, 21, 5, 4, 22, 6, 5, 23, 7, 6, 16, 0, 7, 
                        16, 17, 0, 17, 18, 1, 18, 19, 2, 19, 20, 3, 20, 21, 4, 21, 22, 5, 22, 23, 6, 23, 16, 7
        ]
    };
    return stair;
}
           
var exampleSphere = {  // 42 vértices, 80 triángulos

    "vertices" : [ 0.000000, 0.850651, 0.525731,
                  -0.309017, 0.500000, 0.809017,
                   0.309017, 0.500000, 0.809017,
                  -0.525731, 0.000000, 0.850651,
                   0.000000, 0.000000, 1.000000,
                   0.525731, 0.000000, 0.850651,
                  -0.850651, 0.525731, 0.000000,
                  -0.809017, 0.309017, 0.500000,
                  -0.500000, 0.809017, 0.309017,
                   0.000000, 0.850651,-0.525731,
                  -0.500000, 0.809017,-0.309017,
                   0.000000, 1.000000, 0.000000,
                   0.500000, 0.809017,-0.309017,
                   0.500000, 0.809017, 0.309017,
                   0.850651, 0.525731, 0.000000,
                   0.809017, 0.309017, 0.500000,
                   0.850651,-0.525731, 0.000000,
                   1.000000, 0.000000, 0.000000,
                   0.809017,-0.309017, 0.500000,
                   0.525731, 0.000000,-0.850651,
                   0.809017, 0.309017,-0.500000,
                   0.809017,-0.309017,-0.500000,
                   0.309017, 0.500000,-0.809017,
                  -0.525731, 0.000000,-0.850651,
                  -0.309017, 0.500000,-0.809017,
                   0.000000, 0.000000,-1.000000,
                   0.000000,-0.850651,-0.525731,
                  -0.309017,-0.500000,-0.809017,
                   0.309017,-0.500000,-0.809017,
                   0.500000,-0.809017,-0.309017,
                   0.000000,-0.850651, 0.525731,
                   0.000000,-1.000000, 0.000000,
                   0.500000,-0.809017, 0.309017,
                  -0.850651,-0.525731, 0.000000,
                  -0.500000,-0.809017,-0.309017,
                  -0.500000,-0.809017, 0.309017,
                  -0.809017,-0.309017, 0.500000,
                  -0.309017,-0.500000, 0.809017,
                   0.309017,-0.500000, 0.809017,
                  -1.000000, 0.000000, 0.000000,
                  -0.809017,-0.309017,-0.500000,
                  -0.809017, 0.309017,-0.500000],

    "indices" : [  1,  0,  2,  4,  3,  1,  2,  5,  4,  4,  1,  2,  7,  6,  8,  1,  3,  7,  8,  0,  1,  1,  7,  8, 10,  9, 11,  8,  6, 10,
                  11,  0,  8,  8, 10, 11, 11,  9, 12, 13,  0, 11, 12, 14, 13, 13, 11, 12, 13, 14, 15,  2,  0, 13, 15,  5,  2,  2, 13, 15,
                  17, 16, 18, 15, 14, 17, 18,  5, 15, 15, 17, 18, 20, 19, 21, 17, 14, 20, 21, 16, 17, 17, 20, 21, 22, 19, 20, 12,  9, 22,
                  20, 14, 12, 12, 22, 20, 24, 23, 25, 22,  9, 24, 25, 19, 22, 22, 24, 25, 27, 26, 28, 25, 23, 27, 28, 19, 25, 25, 27, 28,
                  29, 16, 21, 28, 26, 29, 21, 19, 28, 28, 29, 21, 31, 30, 32, 29, 26, 31, 32, 16, 29, 29, 31, 32, 34, 33, 35, 31, 26, 34,
                  35, 30, 31, 31, 34, 35, 36,  3, 37, 35, 33, 36, 37, 30, 35, 35, 36, 37,  4,  5, 38, 37,  3,  4, 38, 30, 37, 37,  4, 38,
                  38,  5, 18, 32, 30, 38, 18, 16, 32, 32, 38, 18,  7,  3, 36, 39,  6,  7, 36, 33, 39, 39,  7, 36, 39, 33, 40, 41,  6, 39,
                  40, 23, 41, 41, 39, 40, 41, 23, 24, 10,  6, 41, 24,  9, 10, 10, 41, 24, 27, 23, 40, 34, 26, 27, 40, 33, 34, 34, 27, 40]

};

function makeTorus (innerRadius, outerRadius, nSides, nRings) {
        
  var torus = {
      "vertices" : [],
      "indices"  : []
  };
  
  if (nSides < 1 ) nSides = 1;
  if (nRings < 1 ) nRings = 1;
        
  var dpsi =  2.0 * Math.PI / nRings ;
  var dphi = -2.0 * Math.PI / nSides ;
  var psi  =  0.0;
  
  for (var j = 0; j < nRings; j++) {
    var cpsi = Math.cos ( psi ) ;
    var spsi = Math.sin ( psi ) ;
    phi      = 0.0;

    for (var i = 0; i < nSides; i++) {
      var offset = 3 * ( j * (nSides+1) + i ) ;
      var cphi   = Math.cos ( phi ) ;
      var sphi   = Math.sin ( phi ) ;
      torus.vertices[offset + 0] = cpsi * ( outerRadius + cphi * innerRadius ) ;
      torus.vertices[offset + 1] = spsi * ( outerRadius + cphi * innerRadius ) ;
      torus.vertices[offset + 2] =                        sphi * innerRadius   ;
      phi += dphi;
    }

    var offset = torus.vertices.length;
    for (var i = 0; i < 3; i++)
      torus.vertices[offset + i] = torus.vertices[offset-nSides*3+i];

    psi += dpsi;
    
  }

  var offset = torus.vertices.length;
  for (var i = 0; i < 3*(nSides+1); i++){
    torus.vertices[offset+i] = torus.vertices[i];
  }

  for (var j = 0; j < nRings; j++){
    for (var i = 0; i < nSides; i++){
      torus.indices[(6*j*nSides)+6*i]   = (j*(nSides+1))+i;
      torus.indices[(6*j*nSides)+6*i+1] = (j*(nSides+1))+i+1;
      torus.indices[(6*j*nSides)+6*i+2] = (j*(nSides+1))+i+(nSides+1); 
      torus.indices[(6*j*nSides)+6*i+3] = (j*(nSides+1))+i+1;
      torus.indices[(6*j*nSides)+6*i+4] = (j*(nSides+1))+i+(nSides+1)+1;
      torus.indices[(6*j*nSides)+6*i+5] = (j*(nSides+1))+i+(nSides+1); 
    }
  }

  return torus; 
}

