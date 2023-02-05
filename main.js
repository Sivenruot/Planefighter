
var drawBoundingBoxs = true,
    drawPos = false;

var delayLaunch = 0; //en milisecondes

var TICK_FREEZE_WHEN_HIT = 5;


function Update()
{   
    for (var i = 0; i<Pawn.pawnsToSpawnLater.length; i++)
    {
        if (time > Pawn.pawnsToSpawnLater[i].timeToSpawn){
            Pawn.pawnsToSpawnLater[i].func();
            Pawn.pawnsToSpawnLater.splice(i, 1);
            i--;
        }
    }
   
    //add wind à l'arrache
    for (let i = 0; i<Pawn.sarr.length; i++)
    {
        for (var j = 0; j<Pawn.sarr[i].arr.length; j++)
        {
            if (Pawn.sarr[i].arr[j].isAffectedByWind)
                Pawn.sarr[i].arr[j].a = Pawn.sarr[i].arr[j].a.add(new Vect2(0, 0.08*m.cos(tick/20)));
        }
    }
    
    
    for (let i = 0; i<Player.sarr.length; i++)
    {
        
        Player.sarr[i].update();
    }
    
    for (let i = 0; i<Pawn.sarr.length; i++)
    {
        //sortByYValues(Pawn.sarr[i].arr);
        for (var j = 0; j<Pawn.sarr[i].arr.length; j++)
        {
            Pawn.sarr[i].arr[j].updateSpecial();
        }
    }
    for (let i = 0; i<Pawn.sarr.length; i++)
    {
        sortByYValues(Pawn.sarr[i].arr);
        for (var j = 0; j<Pawn.sarr[i].arr.length; j++)
        {
            Pawn.sarr[i].arr[j].updatePos();
        }
    }
    for (let i = 0; i<Pawn.sarr.length; i++)
    {
        sortByYValues(Pawn.sarr[i].arr);
        for (var j = 0; j<Pawn.sarr[i].arr.length; j++)
        {
            Pawn.sarr[i].arr[j].collidedThisFrame = [];
        }
    }
    
    Pawn.clearArrayOfIDToRemove();
    BoundingBox.UpdateBoundingBoxs();
    Player.removePlayersWithErasedPawns()
}


//il faut gérer l'apparition/disparition de joueurs (notament lorsque leurs Pawn disparait)
//et l'IA va être aglère à coder


function launch ()
{
    console.log(" =======================          =========================");
    console.log(" ======================= launch ! =========================");
    console.log(" =======================          =========================");
    
    spawnSreenWalls();
    spawnBackground(fondJour)
    
    new Player(new Biplane(new Vect2(100, 300)), new KeyboardController("wasd"));
    
    //spawnClouds(nb, imageColl, layer, ymin, ymax, vMin, vMax = vMin)
    spawnClouds(12, cumulusColl, 5, 0.7, 0.95, new Vect2(-wCanvas*0.0010, 0), new Vect2(-wCanvas*0.0015, 0))
    

    setTimeout(() => {  animate(); }, delayLaunch);
}


function animate()
{
    if (tickToGo < tick) {
    
        time += deltaT;
        
        Update();
        Draw();
    }
    
    if(Player.sarr.length <5) {
        var ennemyBlimpExemple = new EnnemyBlimp(new Vect2(wCanvas*1.2, randomFloatFromInterval(hCanvas*0.2, hCanvas*0.8)))
        new Player(ennemyBlimpExemple, new BasicEnnemyAI(ennemyBlimpExemple))
    
    }
    
    tick++;
    requestAnimationFrame(animate);
}


loadImages(imagesToLoad);