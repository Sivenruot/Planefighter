


class Pawn
{
    //quand on modifie cette ligne, on actualise toutes les autres constructeurs des classes fille
    constructor (pos, immovible = false, drawLayer = 100) 
    {
        if (pos === undefined)
            throw Error("new Pawn sans pos !");
        
        this.name = "Pawn";
        this.timeWhenBorn= time;
        
        //ne sont utiles que pour les Players
        this.isDed = false;
        this.isErasedFromExistence = false;
        
        this.id = generateID();
        this.immovible = immovible;
        this.isAffectedByWind = false;
        
        this.pos = pos;
        this.v = new Vect2(0, 0);
        
        this.a = new Vect2(0, 0);               //accélération dûe à l'environement (elle est toujours appliquée)
        
        this.drawFile = null;
        this.drawRot = 0;
        this.drawFileInverted = false;
        
        this.drawLayer = drawLayer;
        this.collidedThisFrame = [];
        
        Pawn.pushSarr(this, this.drawLayer);
    }    
    
    updatePos ()
    {
        this.v = this.v.add(this.a.scale(deltaT*(this.immovible?0:1))); //v += deltaT*a
        
        this.pos = this.pos.add(this.v.scale(deltaT*(this.immovible?0:1)));
        
        this.a = new Vect2(0, 0);
    }
    updateSpecial()
    {
        
    }
    
    isOutOfScreen (sideCollision = {up:true, down:true, left:true, right:true})
    {
        if(sideCollision.up && this.pos.y+this.drawFile.tsheight/2 < 0) // up
            return true;
        if(sideCollision.down && this.pos.y-this.drawFile.tsheight/2 > hCanvas) //down
            return true;
        if(sideCollision.left && this.pos.x+this.drawFile.tswidth/2 < 0) //left
            return true;
        if(sideCollision.right && this.pos.x-this.drawFile.tswidth/2 > wCanvas) //right
            return true;
        return false;
    }
    
    collidedWith(pawn, type) //à implémenter dans l'update
    {
        this.collidedThisFrame.push({pawn: pawn, type: type});
    }
    
    draw ()
    {
        if (this.drawFile === undefined) { console.log("Drawing an undefined drawFile") }
        else if (this.drawFile !== null)  {
            if (this.drawFile instanceof Animation) {
                var indexToDraw = m.floor((time-this.timeWhenBorn)/this.drawFile.delay)%this.drawFile.nbframes;
                ctx.drawImageScaleRot(this.drawFile.images[indexToDraw], this.pos.x, this.pos.y, this.drawFile.scale, this.drawRot, this.drawFileInverted);
            } else {
                ctx.drawImageScaleRot(this.drawFile, this.pos.x, this.pos.y, this.drawFile.scale, this.drawRot, this.drawFileInverted);   
            }
        }
    }
    //spawnWithDelay(3, (function (){new ExplosionRocheLimit(...)}))
    static spawnWithDelay(delay, func)
    {
        Pawn.pawnsToSpawnLater.push({timeToSpawn:time+delay, func: func});
    }
    static pawnsToSpawnLater = [];
    
    static pushSarr (item, prio)
    {
        var i = 0;

        for (; i<Pawn.sarr.length; i++)
        {
            if (Pawn.sarr[i].prio == prio) {
                Pawn.sarr[i].arr.push(item);
                return ; //on a trouvé le bon, on se casse
            } else if (Pawn.sarr[i].prio < prio) { //On a dépassé la prio visée
                break;
            }
        }
        
        Pawn.sarr.splice(i, 0, {arr: [item], prio: prio}) //on rajoute une file de priorité
    }


    static clearArrayOfIDToRemove ()
    {
        for (var k = 0; k<Pawn.arrayOfIDToRemove.length ; k++)
        {
            var id = Pawn.arrayOfIDToRemove[k].id,
                prio = Pawn.arrayOfIDToRemove[k].prio;
            
            BoundingBox.removeBoundingBoxWithPawnID(id);
        
            var done = false;
            if (prio === null)
            {
                for (var i = 0; i<Pawn.sarr.length && !done; i++)
                {
                    Pawn.sarr[i].arr = Pawn.sarr[i].arr.filter(function(e) {
                        if (!done) { 
                            done = e.id === id; 
                            if (done)
                                e.isErasedFromExistence = true;
                        }
                        return e.id !== id;
                    });
                }
            } else {
                for (var i = 0; i<Pawn.sarr.length && !done; i++)
                {
                    if (Pawn.sarr[i].prio === prio)
                    {
                        Pawn.sarr[i].arr = Pawn.sarr[i].arr.filter(function(e) {
                        if (e.id === id) { 
                            e.isErasedFromExistence = true;
                        }
                        return e.id !== id;
                    });  
                        done = true;
                    }
                }
            }
            
        }
        Pawn.arrayOfIDToRemove = [];
    }
    static removeWithID(id, prio = null)
    {
        Pawn.arrayOfIDToRemove.push({id: id, prio: prio});
    }
    static printSarr ()
    {
        for (var i = 0; i<Pawn.sarr.length; i++)
        {
            var str = "layer "+Pawn.sarr[i].prio+ " : "
            for (var j = 0; j<Pawn.sarr[i].arr.length; j++)
            {
                str += Pawn.sarr[i].arr[j].name + ", x: " + Pawn.sarr[i].arr[j].pos.x + ", y: " + Pawn.sarr[i].arr[j].pos.y + " | "
            }
            console.log(str);
        }
    }
    static arrayOfIDToRemove = [];
    static sarr = [];
    
}

class ControlablePawn extends Pawn
{
    constructor(pos, maxSpeed, drawLayer = 100, isAffectedByWind = true, idleControlsCoeff = 0.3, frottementFluide = 0.9, maxAccAxis = maxSpeed/5, maxAcc = maxAccAxis*6/5)
    {
        super(pos, false, drawLayer);
        this.name = "Controlable Pawn"; 
        
        this.isAffectedByWind = isAffectedByWind;
        this.idleControlsCoeff = idleControlsCoeff;
        this.frottementFluide = frottementFluide;
        
        this.maxSpeed = maxSpeed;
        this.maxAccAxis = maxAccAxis;
        this.maxAcc = maxAcc;
        
        this.aControls = new Vect2(0, 0);     //accélération dûe au joueur/IA (elle peut être limitée/on peut réduire artificiellement sa norme)
        this.vControls = new Vect2(0, 0);     //de même
        
        
    }
    
    updatePos()
    {
        //on reccourcit l'aControl, on update la vitesse Control
        var magAcc = this.aControls.magnitude();
        if (magAcc > this.maxAcc)
            this.aControls = this.aControls.scale(this.maxAcc/magAcc);
        
        this.vControls = this.vControls.add(this.aControls.scale(deltaT));
        
        var magVit = this.vControls.magnitude();
        if (magVit > this.maxSpeed)
            this.vControls = this.vControls.scale(this.maxSpeed/magVit);
        
        super.updatePos(); //on applique l'acc de l'environnment
       
        this.pos = this.pos.add(this.vControls.scale(deltaT)); //on applique l'acc des contrôles
        
        this.aControls = new Vect2(0, 0);
        //on a fini avec l'aControl
        
        //on applique les frottements fluides à l'avion
        this.v = this.v.scale(this.frottementFluide);
    }
    createWeaponPackage ()
    {
        //PackageWeapon(posOfShooting, vOfPawn, vMaxPawn)
        console.error("Il vaut mieux faire un WeaponPackage Personalisé pour chaque Controlable Pawn");
        return null;
        /*
        return new WeaponPackage(
            this.pos.add(new Vect2(this.drawFile.tswidth*0.8, 0)),
            this.vControls,
            this.maxSpeed
        )
        */
    }
    
    goUp (x)
    {
        this.aControls = this.aControls.add(Vect2.down(this.maxAccAxis*x));
    }
    goDown (x)
    {
        this.aControls = this.aControls.add(Vect2.up(this.maxAccAxis*x));
    }
    goLeft(x)
    {
        this.aControls = this.aControls.add(Vect2.left(this.maxAccAxis*x));
    }
    goRight(x)
    {
        this.aControls = this.aControls.add(Vect2.right(this.maxAccAxis*x));
    }
    shoot()
    {
        this.a = this.a.add(this.weapon.shoot(this.createWeaponPackage()));
	return
    }
    noDirPressed ()
    {
        var vTot = this.vControls.add(this.v)
        //var vTot = this.vControls;
        this.aControls = vTot.normalize().scale(-1 * this.idleControlsCoeff * m.min(vTot.magnitude()/deltaT, this.maxAcc));
    }
    shoot()
    {
        console.log("Pas de Weapon assigné !!");
    }
    dieNow()
    {
        console.log("Alors alors, on a pas encore implémenté l'explosion lors de la mort ??");
        //this.ded_frottementFluide !!
    }
    isDying ()
    {
        console.log("Alors alors, on a pas encore implémenté l'animation de mort ??");
    }
}

class Biplane extends ControlablePawn
{
    constructor (pos)
    {
        //=================================
        var maxSpeed = 12,
            idleControlsCoeff = 0.3,
            frottementFluide = 0.9;
        
        //================================
        
        //ControlablePawn(pos, maxSpeed, drawLayer, isAffectedByWind, idleControlsCoeff, frottementFluide, maxAccAxis, maxAcc)
        super(pos, maxSpeed, 100, true, idleControlsCoeff, frottementFluide, maxSpeed/5, maxSpeed*6/25);
        this.name = "Biplane";
        
        this.drawFile = biplaneAnimation;
        
        this.timeNextSmoke = 0;
        
        this.hp = 4;
        
        //==========================================
        this.maxRot = ( 20 )*(m.PI/180); //en rad
        this.minSpeedForRot = 1;
        
        this.timeBetweenSmoke = 20;
        
        this.weapon1 = new Machinegun(this.id, true);
        this.weapon2 = new Shotgun(this.id, true);
        this.weapon = this.weapon1;
        //==========================================
        //------------------------------------------
        this.ded_aconst = new Vect2(0.4, 0.7);
        this.ded_v0 = new Vect2(1, 0);
        this.ded_frottementFluide = 0.98;
        this.ded_nbExplosions = 2;
        this.ded_maxDelay = 0;			//delay between death and the explosions
        
        this.ded_smokeCollection = planeSmokeNoBuenoParticleCollection;
        this.ded_timeBetweenSmoke = 1;
        //------------------------------------------
        
        
        new BoundingBox(this, this.id, new Vect2(0, 0), this.drawFile.tswidth, this.drawFile.tsheight, true, false, 1, [1, 20, 101, 102, 103, 104]);
    }
    updateSpecial()
    {
        super.updateSpecial();
        
        switch (this.hp)
        {
            case 4:
                this.timeBetweenSmoke = 20;
                this.bulletParticleCollection = planeSmokeWhiteParticleCollection;
                break;
            
            case 3:
                this.timeBetweenSmoke = 8;
                this.bulletParticleCollection = planeSmokeParticleCollection;
                break;
                
            case 2:
                this.timeBetweenSmoke = 4;
                this.bulletParticleCollection = planeSmokeGrayParticleCollection;
                break;
                
            case 1:
                this.timeBetweenSmoke = 1;
                this.bulletParticleCollection = planeSmokeFireParticleCollection;
                break; 
        }
        
        if(this.hp <= 0 && !this.isDed)
            this.dieNow();
        
        if (this.timeNextSmoke < time)
        {
            var newPos = this.pos.add(new Vect2(this.drawFile.tswidth/2*0.8, 0));
            new PlaneSmokeParticle(newPos, this.bulletParticleCollection);
            
            this.timeNextSmoke = time + this.timeBetweenSmoke + (0.5-m.random())*this.timeBetweenSmoke*0.8;
        }
        
        for (var i = 0; i<this.collidedThisFrame.length; i++)
        {
            var temp = this.collidedThisFrame[i];
            switch (this.collidedThisFrame[i].type)
            {
                case 10:
                case 20:
                    if (temp.pawn instanceof Bullet) {
                        this.v = this.a.add(temp.pawn.v.normalize().scale(this.maxSpeed*temp.pawn.knockback))
                        Pawn.removeWithID(temp.pawn.id);
                        this.loseHP ()
                    }
            }
        }
    }
    
    updatePos ()
    {   
        super.updatePos();
        
        var vTot = this.v.add(this.vControls);
        this.drawRot = m.sign(vTot.y)*this.maxRot*(m.max(m.abs(vTot.y)-this.minSpeedForRot, 0)/this.maxSpeed);  
            
    }
    createWeaponPackage ()
    {
        //PackageWeapon(posOfShooting, vOfPawn, vMaxPawn)
        return new WeaponPackage(
            this.pos.add(new Vect2(this.drawFile.tswidth*0.8/2, 0)),
            this.vControls,
            this.maxSpeed
        )
    }
    
    //================================================
    shoot()
    {
        this.a = this.a.add(this.weapon.shoot(this.createWeaponPackage()));
    }
    loseHP (amountLost = 1)
    {
        this.hp -= amountLost;
        tickToGo = tick + TICK_FREEZE_WHEN_HIT;
    }
    changeWeapons()
    {
        if (this.weapon.id == this.weapon1.id)
            this.weapon = this.weapon2;
        else
            this.weapon = this.weapon1;
    }
    dieNow()
    {
        this.isDed = true;
        BoundingBox.removeBoundingBoxWithPawnID(this.id);
        
        this.v = this.v.add(this.ded_v0);
        this.frottementFluide = this.ded_frottementFluide;
        
        this.timeBetweenSmoke = this.ded_timeBetweenSmoke;
        this.bulletParticleCollection = this.ded_smokeCollection;
        
        var newPos = this.pos;
        for (var i = 0; i<this.ded_nbExplosions; i++)
        {
            Pawn.spawnWithDelay(this.ded_maxDelay*m.random(), (function (){new ExplosionRocheLimit(newPos);}))
        }
    }
    isDying ()
    {
        this.a = this.a.add(this.ded_aconst);
        
        if(this.isOutOfScreen())
            Pawn.removeWithID(this.id);
    }
}



class RespawnableBackgroundObject extends Pawn
{
    //pos = position de l'objet spawné, posMin/posMax = l'objet respawnera entre ces deux pos, ...,delay=tempsMax entre chaque respawn (randomisé)
    //sideCollision = {up: true, down: true, left: false, right: true}
    constructor (pos, posMin, posMax, imageColl, drawLayer, vMin, vMax, aconst, sideCollision, delayMin, delayMax, drawFileInverted = false)
    {
        super(pos, /*immovible = */false, drawLayer);
        this.name = "Repawnable Background Object";
        
        this.posMin = posMin;
        this.posMax = posMax;
        this.delayMin = delayMin;
        this.delayMax = delayMax;
        
        this.sideCollision = sideCollision;
        
        this.aconst = aconst;
        this.vMin = vMin;
        this.vMax = vMax;
        this.v = randomVect2(vMin, vMax);
        
        this.imageCollection = imageColl;
        
        this.drawFile = this.imageCollection[Math.floor(Math.random()*this.imageCollection.length)];
        
    }
    choseNewDrawFile ()
    {
        this.drawFile = this.imageCollection[Math.floor(Math.random()*this.imageCollection.length)]
    }
    updateSpecial ()
    {
        super.updateSpecial();
        
        if (this.isOutOfScreen(this.sideCollision))
            this.respawn();
    }
    updatePos ()
    {
        this.a = this.aconst;
        
        super.updatePos();
    }
    respawn()
    {
        //il faudra implémenter la prise en compte de l'acc constante, mais flemme et inutile pour l'instant
        this.choseNewDrawFile();
        this.v = this.vMin.add( this.vMax.subtract(this.vMin).scale(m.random()));
        
        var newPos = this.posMin.add( this.posMax.subtract(this.posMin).scale((m.random()))), //a + t(b - a)
            distToPushImage = 0; //est-ce qu'on doit pousser selon la hauteur où la largeur de l'image ?
        
        //which side I should respawn ?
        //"1ere bissectrice" : f(x) = hCanvas/wCanvas*x
        //2eme diago du screen : g(x) = -hCanvas/wCanvas*x + hCanvas
        
        var fx = hCanvas/wCanvas*newPos.x,
            gx = -hCanvas/wCanvas*newPos.x + hCanvas;
        
        var dirToPush = null; //dans quelle direction on doit pousser l'objet
            
        if (newPos.y < fx && newPos.y < gx) { //vers le haut
            dirToPush = new Vect2(0, -1);
            distToPushImage = this.drawFile.tsheight/2;
        } 
        else if (newPos.y >= fx && newPos.y < gx) {//vers la gauche
            dirToPush = new Vect2(-1, 0);
            distToPushImage = this.drawFile.tswidth/2;
        }
        else if (newPos.y < fx  && newPos.y >= gx) { //vers le droite
            dirToPush = new Vect2(1, 0);
            distToPushImage = this.drawFile.tswidth/2;
        }
        else {  /*if (fx >= newPos.y && gx >= newPos.y)*/ //vers le bas
            dirToPush = new Vect2(0, 1);
            distToPushImage = this.drawFile.tsheight/2;
        }
        
        //pour simuler un délai, on met le Pawn loin
        var vectDelay = this.v.scale( -(this.delayMin + m.random()*(this.delayMax-this.delayMin))); 
        
        var finalPos = newPos.add(dirToPush.scale(distToPushImage)).add(vectDelay);
        
        this.pos = finalPos;
    }
}
//=================================================================================================================

class Particle extends Pawn
{
    //timeToLive === true <=> ne fait qu'une suele animation; timeToLive === false <=> ne meurt jamais (sauf si sort de l'ecran); else, normal;
    constructor (pos, timeToLive, v0, a0, minRot, maxRot, drawFile, drawLayer = 100, drawFileInverted = false)
    {
        super(pos, false, drawLayer);
        this.name = "Particle";
        
        if(timeToLive === true) 
            this.timeToLive = drawFile.delay*drawFile.nbframes;
	else if (timeToLive === false)
	    this.timeToLive = Infinity;
        else 
            this.timeToLive = timeToLive;
        
        
        this.v = v0;
        this.aconst = a0;
        
        this.drawFile = drawFile;
        this.drawRot = ( minRot+(maxRot-minRot)*m.random() )*m.PI/180;
        this.drawFileInverted = drawFileInverted;
    }
    updateSpecial ()
    {
        super.updateSpecial();
        
        if (this.timeWhenBorn + this.timeToLive <= time || this.isOutOfScreen())
            this.destroyItself()

    }
    updatePos()
    {
        this.a = this.a.add(this.aconst);
        
        super.updatePos();
    }
    destroyItself()
    {
        Pawn.removeWithID(this.id, this.drawLayer);
    }
}
class ShotgunBlastParticle extends Particle
{
    constructor(pos, v = new Vect2(0, 0), drawFileInverted = false)
    {
        var drawFileChosed = shotgunBlastAnimation;
        
        var newPos = pos.add(new Vect2(boolToSign(!drawFileInverted)*drawFileChosed.tswidth/2, 0));
    
        super(newPos, true, v, new Vect2(0, 0), 0, 0, drawFileChosed, 150, drawFileInverted);
        this.name = "Shotgun Blast Particle";
    }
}
class PlaneSmokeParticle extends Particle
{
    constructor(pos, collectionUsed = planeSmokeParticleCollection, v = new Vect2(-wCanvas*0.0030, 2*(0.5-m.random())))
    {
        //(pos, timeToLive, v0, a0, drawFile, drawLayer = 100, immovible = false)
        var drawFileChosed = collectionUsed[m.floor(m.random()*collectionUsed.length)]
        
        super(pos, true, 
              v, 
              new Vect2(-wCanvas*0.00005, 0), 0, 359,
              drawFileChosed, 55);
        this.name = "Plane Smoke Particle";
        
        this.imageCollection = collectionUsed;
    }
}
class ExplosionRocheLimit extends Particle
{
    constructor (pos, v = new Vect2(0, 0))
    {
        //Particle(pos, timeToLive, v0, a0, minRot, maxRot, drawFile, drawLayer = 100, drawFileInverted = false)
        super(pos, true, v, new Vect2(0,0), 0, 359, explosionRocheLimitAnimation, 151);
        this.name = "Explosion Roche Limit";
    }
}
class BulletPlaneDouille extends Particle
{
    constructor (pos, v = null, aconst = new Vect2(0, randomFloatFromInterval(0.25, 0.35)))
    {
	if (v === null) 
	{
	    v = randomVect2Disk();
	}

        //Particle(pos, timeToLive, v0, a0, minRot, maxRot, drawFile, drawLayer = 50, drawFileInverted = false)
        super(pos, false, v, aconst, -10, 10, bulletPlaneDouilleImage, 50);
        this.name = "Bullet Plane Douille";

	
    }
}


    
