//pour les drawLayer, plus on est haut, plus on est visible (=plus on est dessiné tard)

/*
    BIBLE DES DRAWLAYER
    
  1     - fond (=le ciel)
  5/20   - les background objects (nuages, oiseaux, lune...)
  50/60  - les particules
  60/70  - balles
  80/90  - ennemis 
  100    - player
  200    - HUD
  
  
  
*/

//class Animation(path, nbframes, w, h, scale, dephasage, delay = 1) //path = "assets/images/biplane/biplane"


var fondJour = new Image();
addImageToLoad(fondJour, "assets/images/fond_jour_x6.png", 320, 180, 6.5);

var biplaneAnimation = new Animation("assets/images/biplane/biplane", 4, 44, 23, 3, true, 2);

var blimpAnimation = new Animation("assets/images/blimp/blimp", 8, 72, 34, 3, true, 4);

var bulletPlaneImage = new Image();
addImageToLoad(bulletPlaneImage, "assets/images/bulletPlane.png", 10, 5, 3);
var bulletPlaneDouilleImage = new Image();
addImageToLoad(bulletPlaneDouilleImage, "assets/images/bulletPlaneDouille.png", 4, 2, 3);

var bulletShotgunImage = new Image();
addImageToLoad(bulletShotgunImage, "assets/images/bulletShotgun.png", 11, 5, 5);

var onaImage = new Image();
addImageToLoad(onaImage, "assets/images/Ona/Ona0.png", 35, 20, 5);

var smokePlaneAnimation = new Animation("assets/images/smokePlane/smokePlane", 8, 16, 16, 2, false, 10);
var smokePlaneFireAnimation = new Animation("assets/images/smokePlane/smokePlaneFire", 8, 16, 16, 2, false, 10);
var smokePlaneWhiteAnimation = new Animation("assets/images/smokePlane/smokePlaneWhite", 8, 16, 16, 2, false, 10);
var smokePlaneBlackAnimation = new Animation("assets/images/smokePlane/smokePlaneBlack", 8, 16, 16, 2, false, 10);

var cumulusImage = new Image();
addImageToLoad(cumulusImage, "assets/images/clouds/cumulus0.png", 39, 22, 3);


var shotgunBlastAnimation = new Animation("assets/images/shotgunBlast/shotgunBlast", 4, 100, 108, 2, false, 1);

var explosionRocheLimitAnimation = new Animation("assets/images/explosionRocheLimit/explosionRocheLimit_", 34, 67, 67, 5, false, 0.8);



//=================================================================
//collections :

var sizeRussianClouds = [
    [29, 10],
    [31, 5],
    [13, 3],
    [17, 6],
    [23, 8],
    [41, 8],
    [35, 8],
    [26, 7],
    [32, 15]
]
var russianCloudsCollection = addCollectionToLoad("assets/images/clouds/russianClouds/russianCloud", 9, sizeRussianClouds, 3)


var planeSmokeWhiteParticleCollection = [
    smokePlaneWhiteAnimation
];
var planeSmokeParticleCollection = [
    smokePlaneAnimation,
    smokePlaneAnimation,
    smokePlaneAnimation,
    smokePlaneAnimation,
    smokePlaneWhiteAnimation
];
var planeSmokeGrayParticleCollection = [
    smokePlaneAnimation,
    smokePlaneBlackAnimation,
    smokePlaneBlackAnimation
];
var planeSmokeFireParticleCollection = [
    smokePlaneAnimation,
    smokePlaneBlackAnimation,
    smokePlaneFireAnimation,
    smokePlaneFireAnimation
];
var planeSmokeNoBuenoParticleCollection = [
    smokePlaneBlackAnimation,
    smokePlaneBlackAnimation,
    smokePlaneFireAnimation,
    smokePlaneFireAnimation,
    smokePlaneFireAnimation
];


var cumulusColl = [
    cumulusImage
];


























