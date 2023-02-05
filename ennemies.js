class EnnemyBlimp extends ControlablePawn
{
    constructor (pos, drawLayer = 80)
    {
        //=================================
        var maxSpeed = 5,
            idleControlsCoeff = 0.3,
            frottementFluide = 0.9;
        
        //================================
        
        //ControlablePawn(pos, maxSpeed, drawLayer, isAffectedByWind, idleControlsCoeff, frottementFluide, maxAccAxis, maxAcc)
        super(pos, maxSpeed, drawLayer, true, idleControlsCoeff, frottementFluide);
        this.name = "Blimp";
        
        this.drawFile = blimpAnimation;
        this.drawFileInverted = true;
        
        this.hp = 300;
        
        this.weapon = new EnnemyShotgun(this.id, !this.drawFileInverted);
        
        //------------------------------
        this.ded_aconst = new Vect2(0.4, 0.7);
        this.ded_v0 = new Vect2(0, 0);
        this.ded_frottementFluide = 0.98;
        
        //-------------------------------
        
        new BoundingBox(this, this.id, new Vect2(0, 0), this.drawFile.tswidth, this.drawFile.tsheight, true, false, 50, [1, 10, 101, 103, 104]);
    }
    updateSpecial()
    {
        super.updateSpecial();
        
        for (var i = 0; i<this.collidedThisFrame.length; i++)
        {
            switch (this.collidedThisFrame[i].type)
            {
                case 10:
                    if (this.collidedThisFrame[i].pawn instanceof Bullet)
                        this.hp -= this.collidedThisFrame[i].pawn.damage;
                    Pawn.removeWithID(this.collidedThisFrame[i].pawn.id);
            }
        }
        if (this.hp <= 0 && !this.isDed)
            this.dieNow();
    }
    createWeaponPackage ()
    {
        //PackageWeapon(posOfShooting, vOfPawn, vMaxPawn)
        return new WeaponPackage(
            this.pos.add(new Vect2(-this.drawFile.tswidth*0.5/2, this.drawFile.tsheight*0.68/2)),
            this.vControls,
            this.maxSpeed
        )
    }
    shoot()
    {
        this.a = this.a.add(this.weapon.shoot(this.createWeaponPackage()));
    }
    loseHP (amountLost = 1)
    {
        this.hp -= amountLost;
    }
    dieNow()
    {
        this.isDed = true;
        BoundingBox.removeBoundingBoxWithPawnID(this.id);
        
        this.v = this.v.add(this.ded_v0);
        this.frottementFluide = this.ded_frottementFluide;
        
        new ExplosionRocheLimit(this.pos);
        
        this.timeBetweenSmoke = 1;
        this.bulletParticleCollection = planeSmokeNoBuenoParticleCollection;
        
    }
    isDying ()
    {
        this.a = this.a.add(this.ded_aconst);

        if(this.isOutOfScreen())
            Pawn.removeWithID(this.id);
    }
    
}