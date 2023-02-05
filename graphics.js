var imagesToLoad = [];
function addImageToLoad (variable, src, x, y, scale) { 
    variable.width = x; 
    variable.height = y; 
    variable.scale = scale; 
    variable.twidth = x/devicePixelRatio; 
    variable.theight = y/devicePixelRatio; 
    variable.tswidth = variable.twidth*scale;  //ScaledWidth
    variable.tsheight = variable.theight*scale;
    imagesToLoad.push([variable, src]);
}
function addCollectionToLoad (src, nb, arraySizes, scale)
{
    var rep = [];
    for (var  i = 0; i<nb; i++)
    {
        var temp = new Image();
        rep.push(temp);
        addImageToLoad(temp, src+i+".png", arraySizes[i][0], arraySizes[i][1], scale);
    }
    return rep;
}
//on doit rajouter les tailles des images à la main car JS est trop débile pour le faire dans l'ordre 

ctx.resetScale = function () { ctx.setTransform(1, 0, 0, 1, 0, 0); }

ctx.drawImageScaleRot = function (image, x, y, scale, rotation, invertedX = false){
    scale *=globalMultFactor;
    //if (centered === undefined || centered === true) //pour l'instant, c'est le seul cas possible. l'autre n'estpas implémenté partout (notamment pour les boundingbox)
    //{
        //centered = true;
        ctx.setTransform(-1*boolToSign(invertedX)*scale, 0, 0, scale, x, y); // sets scale and origin
        ctx.rotate(rotation);
        ctx.drawImage(image, -image.width / 2 , -image.height / 2 );
    /*}
    else
    {
        //centered == false
        ctx.setTransform(scale, 0, 0, scale, x+scale*image.width / 2, y+scale*image.height / 2); // sets scale and origin
        ctx.rotate(rotation);
        ctx.drawImage(image, -image.width / 2 / devicePixelRatio, -image.height / 2 / devicePixelRatio);
    }*/
    
    
    ctx.resetScale();
} 


//pour les drawLayer, plus on est haut, plus on est visible (=plus on est dessiné tard)

class Animation 
{
    //le delay donne le nombre de frame que chaque image de l'anilation a. Le Biplane a deux par ex.
    constructor (path, nbframes, w, h, scale, dephasage, delay = 1) //path = "assets/images/biplane/biplane"
    {
        this.images = [];
        this.nbframes = nbframes;
        this.scale = scale;
        this.width = w;
        this.height = h;
        this.delay = delay;
        
        this.twidth = w/devicePixelRatio;
        this.theight = h/devicePixelRatio;
        this.tswidth = this.twidth*scale;
        this.tsheight = this.theight*scale;
        
        this.dephasage = dephasage ? randomIntFromInterval(0, nbframes-1) : 0;
        
        for (var  i = 0; i<nbframes; i++)
        {
            var temp = new Image();
            addImageToLoad(temp, path+i+".png", w, h, scale);
            this.images.push(temp);
        }
    }
}


//si on display une image, ya pas de soucis, on utilise la fonction drawImageScaleRot avec le bon scale (x6 pour le fondJour)
//si on veut utiliser le dessin avec des pixels (rect, arc, line, etc), il faut diviser la taille du truc par devicePixelRatio


function Draw ()
{
    ctx.resetScale();
    
    ctx.beginPath();
    ctx.rect(0, 0, wCanvas, hCanvas);
    ctx.fillStyle = "#f0f";
    ctx.fill();

    for (let i = Pawn.sarr.length-1; -1<i; i--)
    {
        for (var j = Pawn.sarr[i].arr.length-1; -1<j; j--)
        {
            Pawn.sarr[i].arr[j].draw();
        }
    }
    
    if (drawBoundingBoxs)
    {
        for (let i = 0; i<BoundingBox.sarr.length; i++)
        {
            BoundingBox.sarr[i].draw();
        }
    }
    if (drawPos) {
        for (let i = Pawn.sarr.length-1; -1<i; i--)
        {
            for (var j = Pawn.sarr[i].arr.length-1; -1<j; j--)
            {
                var newPos = Pawn.sarr[i].arr[j].pos;
                ctx.resetScale();
                ctx.beginPath();
                ctx.rect(newPos.x, newPos.y, 4, 4);
                ctx.fillStyle = "#f0f";
                ctx.fill();
            }
        } 
    }
}






function loadImages(arr)
{
    if(arr.length>0)
    {
        var temp = arr.pop()
        temp[0].onload = loadImages(arr);
        temp[0].src = temp[1];
    }
    else
    {
        launch();
    }
}



















