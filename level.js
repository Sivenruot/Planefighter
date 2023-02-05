/*

class Level
{
    constructor ()
    {
        
        
        this.clouds = []
    }
    
    addBackGroundObject (pos1, pos2, image, v0, aconst, sideCollision, delay)
    {
        
    }
    
    addCloud (pos1, pos2, type, v0, nb)
    {
        for (var i =0; i<nb, i++)
        {
            this.addBackGroundObject(pos1, pos2, "...",new Vect2(-v0, 0), new Vect2(0, 0), 104, m.random()*(wCanvas/v0))   
        }
    }
    
    createScreenWalls()
    {
        //(pawn, pos5rel, w, h, solidBox, isImmovible, type, collidingTypes)
        new BoundingBox(null, new Vect2(wCanvas/2, -hCanvas/2), wCanvas, hCanvas, true, true, 101, []);
        new BoundingBox(null, new Vect2(3*wCanvas/2, hCanvas/2), wCanvas, hCanvas, true, true, 102, []);
        new BoundingBox(null, new Vect2(wCanvas/2, 3*hCanvas/2), wCanvas, hCanvas, true, true, 103, []);
        new BoundingBox(null, new Vect2(-wCanvas/2, hCanvas/2), wCanvas, hCanvas, true, true, 104, []);
    }
}*/

function spawnClouds(nb, imageColl, layer, ymin, ymax, vMin, vMax = vMin)
{
    for (var i = 0; i<nb; i++)
    {
        //new RepawnableBackgroundObject (pos, posMin, posMax, imageColl, drawLayer, vMin, vMax, aconst, sideCollision, delayMin, delayMax)
        new RespawnableBackgroundObject(
            new Vect2(wCanvas*m.random(), (ymin+(ymax-ymin)*m.random())*hCanvas),
            new Vect2(wCanvas, hCanvas*ymin),
            new Vect2(wCanvas, hCanvas*ymax), 
            imageColl, layer, vMin, vMax, new Vect2(0, 0), {up:false, down:false, right:false, left:true}, 0, 60);
    }
}
function spawnSreenWalls ()
{
    new BoundingBox(new Pawn(new Vect2(wCanvas/2, -hCanvas/2), true), -1, new Vect2(0, 0), 2*wCanvas, hCanvas, true, true, 101, []);
    new BoundingBox(new Pawn(new Vect2(3*wCanvas/2, hCanvas/2), true), -1, new Vect2(0, 0), wCanvas, 2*hCanvas, true, true, 102, []);
    new BoundingBox(new Pawn(new Vect2(wCanvas/2, 3*hCanvas/2), true), -1, new Vect2(0, 0), 2*wCanvas, hCanvas, true, true, 103, []);
    new BoundingBox(new Pawn(new Vect2(-wCanvas/2, hCanvas/2), true), -1, new Vect2(0, 0), wCanvas, 2*hCanvas, true, true, 104, []);
}
function spawnBackground(image0, v0 = new Vect2(-wCanvas*0.0005, 0))
{
    new RespawnableBackgroundObject (
        new Vect2(0.5*wCanvas, 0.5*hCanvas), 
        new Vect2(wCanvas, 0.5*hCanvas), 
        new Vect2(wCanvas, 0.5*hCanvas), 
        [image0], 1, v0, v0, new Vect2(0, 0), {up: false, down:false, left:true, right:false}, 0, 0)
    new RespawnableBackgroundObject (
        new Vect2(1.55*wCanvas, 0.5*hCanvas), 
        new Vect2(wCanvas, 0.5*hCanvas), 
        new Vect2(wCanvas, 0.5*hCanvas), 
        [image0], 1, v0, v0, new Vect2(0, 0), {up: false, down:false, left:true, right:false}, 0, 0)
}


































