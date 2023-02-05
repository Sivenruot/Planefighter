//le boundingbox se rattache au Pawn au niveau de la pos du Pawn en question. À cette position on rajoute le pos5rel


/*

+-------------------> x
|    1---------2
|    |         |
|    |    5    |
|    |         |
|    3---------4
|
↓ y


!¡!¡!¡ dans cette base !!



Les murs de l'écran
                1
+------------------------------+
|                              |
|                              |
|                              |
| 4                            | 2
|                              |
|                              |
|                              |
+------------------------------+
                3
*/


/*

Bible des Types :

101, 102, 103, 104  - mur
1  - joueur
10 - balleJoueur
20 - balleEnnemie
50 - Ennemi


*/


class BoundingBox 
{
    constructor (pawn, ownerid, pos5rel, w, h, solidBox, isImmovible, type, collidingTypes)
    {
        this.pawn = pawn;
        this.ownerid = ownerid;
        
        this.pos5rel = pos5rel;
        
        this.w = w;
        this.h = h;
        
        this.solidBox = solidBox;
        this.immovible = isImmovible;
        
        this.type = type;
        this.collidingTypes = collidingTypes;
        
        this.updatePos();
        
        this.rayon = (new Vect2(w, h)).magnitude();
        
        BoundingBox.sarr.push(this);
    }
    
    updatePos ()
    {
        if (true)
        {
            this.pos5 = this.pos5rel.add(this.pawn.pos);
        
            /*
            this.pos1 = this.pos5.add(new Vect2(-this.w/2, -this.h/2));
            this.pos2 = this.pos5.add(new Vect2( this.w/2, -this.h/2));
            this.pos3 = this.pos5.add(new Vect2(-this.w/2,  this.h/2));
            this.pos4 = this.pos5.add(new Vect2( this.w/2,  this.h/2));
            */   
        }
    }
    
    
    
    draw ()
    {
        var pos1 = this.pos5.add(new Vect2(-this.w/2, -this.h/2));
        
        ctx.beginPath();
        ctx.rect(pos1.x, pos1.y, this.w, this.h);
        ctx.strokeStyle = "#0f0";
        ctx.stroke();
    }
    

    static checkCollision (box1, box2)
    {
        var dX = box2.pos5.x - box1.pos5.x,
            dY = box2.pos5.y - box1.pos5.y,
            overlapX = box1.w/2+box2.w/2 - m.abs(dX),
            overlapY = box1.h/2+box2.h/2 - m.abs(dY);
                       
        if ((0 < overlapX) && (0 < overlapY)) //if collision...
        {
            //on informe les pawn de la situation
            box1.pawn.collidedWith(box2.pawn, box2.type);
            box2.pawn.collidedWith(box1.pawn, box1.type);
            
            if (box1.solidBox && box2.solidBox)
            {
                if (overlapX < overlapY) {
                    box1.pawn.pos = box1.pawn.pos.add(new Vect2(-m.sign(dX)*overlapX*(box1.immovible ? 0 : 1)/(box2.immovible ? 1 : 2), 0));
                    box2.pawn.pos = box2.pawn.pos.add(new Vect2( m.sign(dX)*overlapX*(box2.immovible ? 0 : 1)/(box1.immovible ? 1 : 2), 0));
                } else {
                    box1.pawn.pos = box1.pawn.pos.add(new Vect2(0, -m.sign(dY)*overlapY*(box1.immovible ? 0 : 1)/(box2.immovible ? 1 : 2)));
                    box2.pawn.pos = box2.pawn.pos.add(new Vect2(0,  m.sign(dY)*overlapY*(box2.immovible ? 0 : 1)/(box1.immovible ? 1 : 2)));
                }
                box1.updatePos();
                box2.updatePos();
            }
        }
    }
    
    static UpdateBoundingBoxs ()
    {
        var arr = BoundingBox.sarr;
        
        for (var i = 0; i<arr.length; i++)
        {
            arr[i].updatePos();
        }
        
        for (var i = 0; i<arr.length; i++)
        {
            for (var j = 0; j<i; j++)
            {
                if (arr[i].ownerid != arr[j].pawn.id && arr[j].ownerid != arr[i].pawn.id)
                {
                    var notDone = true;
                    for (var k = 0; notDone && k<arr[i].collidingTypes.length; k++) {
                        if (arr[i].collidingTypes[k] == arr[j].type) {
                            notDone = false;
                            BoundingBox.checkCollision(arr[i], arr[j]);
                        }
                    }
                    for (var k = 0; notDone && k<arr[j].collidingTypes.length; k++) {
                        if (arr[j].collidingTypes[k] == arr[i].type) {
                            notDone = false;
                            BoundingBox.checkCollision(arr[i], arr[j]);
                        }
                    }
                }
            }
        }
    }
    static removeBoundingBoxWithPawnID(id)
    {
        BoundingBox.sarr = BoundingBox.sarr.filter(e => e.pawn.id !== id);
    }
    
    static sarr = [];
}
































