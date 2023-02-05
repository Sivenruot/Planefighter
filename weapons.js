class WeaponPackage
{
    constructor(posOfShooting, vOfPawn, vMaxPawn)
    {
        this.posOfShooting = posOfShooting;
        this.vOfPawn = vOfPawn;
        this.vMaxPawn = vMaxPawn;
    }
}

class Weapon
{
    constructor(shootingToTheRigth, cooldown, reloadTime, magazineSize)
    {
        this.lastShot = -Infinity;
        this.id = generateID();

        this.isShootingToTheRigth = shootingToTheRigth;
        this.mult = shootingToTheRigth ? 1 : -1;

        //=======================
        this.cooldown = cooldown;
        this.reloadTime = reloadTime;
        this.magazineSize = magazineSize;
        this.bulletDamageMult = 1;
        //=======================

        this.pointerMagazine = 0;
        this.magazine = new Array(this.magazineSize);
        this.reload();
    }
    canShoot()
    {
        if (this.lastShot + this.reloadTime < time)
            this.reload();

        if (this.pointerMagazine < this.magazineSize && this.magazine[this.pointerMagazine] + this.cooldown < time)
        {
            this.pointerMagazine++;

            this.lastShot = time;
            this.magazine[this.pointerMagazine] = time;

            return true;
        }
        else
        {
            return false;
        }

    }
    reload()
    {
        this.pointerMagazine = 0;
        this.magazine.fill(-Infinity);
    }
    shoot() //renvoie un Vect2 avec le recoil
    {
        console.log("Shot avec la classe mère !!");
    }
}
class Bullet extends Pawn
{
    constructor(ownerid, isFromGoodGuys, damage, damageMult, pos, defaultSpeed, knockback, drawFile, rot = 0, vToAdd = new Vect2(0, 0), drawLayer = 60)
    {
        super(pos, false, drawLayer);
        this.name = "Bullet";
        this.ownerid = ownerid;

        this.drawFile = drawFile;
        this.drawRot = rot;

        this.damage = damage * damageMult;
        this.defaultSpeed = defaultSpeed;
        this.knockback = knockback //*damageMult;

        this.v = this.defaultSpeed.rotate(rot).add(vToAdd);

        var type = isFromGoodGuys ? 10 : 20;
        new BoundingBox(this, ownerid, new Vect2(0, 0), this.drawFile.tswidth, this.drawFile.tsheight, false, false, type, [1, 50]);
    }
    updateSpecial()
    {
        super.updateSpecial();

        if (this.isOutOfScreen())
            Pawn.removeWithID(this.id);
    }
}


//=============================================================================================================================================
class Shotgun extends Weapon
{
    constructor(idPawn, shootingToTheRigth)
    {
        //====================================
        var cooldown = 20,
            reloadTime = 50,
            magazineSize = 2;
        super(shootingToTheRigth, cooldown, reloadTime, magazineSize);

        this.recoil = 3.5;
        this.bulletsMaxAngle = (25) * m.PI / 180;
        this.nbBullets = 5;
        this.bulletDamageMult = 1;

        this.nbSmoke = 10;
        this.smokeCollectionUsed = planeSmokeGrayParticleCollection;
        this.speedSmoke = new Vect2(-this.mult * wCanvas * 0.002, 0);
        this.smokeMaxAngleSpeed = (45) * m.PI / 180;
        this.smokeDispersionRadius = 20;
        //====================================

        this.ownerid = idPawn;
    }
    shoot(weaponPackage)
    {
        var returnrecoil = new Vect2(0, 0);
        while (this.canShoot())
        {
            var shootPos = weaponPackage.posOfShooting;

            new ShotgunBlastParticle(shootPos, weaponPackage.vOfPawn, !this.isShootingToTheRigth);

            for (var i = randomRoundFromFloat(this.nbSmoke)-1; i>=0; i--)
            {
                var newPos = shootPos.add(randomVect2Disk().scale(this.smokeDispersionRadius)),
                    newSpeed = this.speedSmoke.rotate(random1m1() * this.smokeMaxAngleSpeed).scale(m.random() * 0.5 + 0.5) //.scale(this.mult);

                new PlaneSmokeParticle(newPos, this.smokeCollectionUsed, newSpeed);
            }
            for (var i = 0; i < this.nbBullets; i++)
            {
                var newPos = shootPos;
                var angle = (this.isShootingToTheRigth ? 0 : m.PI) + this.mult * this.bulletsMaxAngle * (1 - 2 * (i / (this.nbBullets - 1)));

                //ajouter la vitesse du joueur ?
                new ShotgunBullet(this.ownerid, this.isShootingToTheRigth, this.bulletDamageMult, newPos, angle, weaponPackage.vOfPawn);
            }

            returnrecoil = returnrecoil.add(new Vect2(-this.mult * weaponPackage.vMaxPawn * this.recoil, 0));
        }
        return returnrecoil;

    }
}
class ShotgunBullet extends Bullet
{
    constructor(idPawn, isFromGoodGuys, damageMult, pos, rot = 0, vToAdd = new Vect2(0, 0), drawLayer = 60)
    {
        //==================================
        var defaultSpeed = new Vect2(wCanvas * 0.02, 0),
            knockback = 2.5,
            deceleration = 50, //en combien de temps la balle s'arrête
            damage = 100;


        //=================================
        //constructor (ownerid, isFromGoodGuys, damage, damageMult, pos, defaultSpeed, knockback, drawFile, rot = 0, vToAdd = new Vect2(0, 0), drawLayer = 60)
        super(idPawn, isFromGoodGuys, damage, damageMult, pos, defaultSpeed, knockback, bulletShotgunImage, rot, vToAdd, drawLayer);
        this.name = "Shotgun Bullet";

        this.deceleration = deceleration;

        this.aconst = this.v.scale(-1 / this.deceleration);
        this.timeOfDeath = time + this.deceleration * 0.9;
    }
    updateSpecial()
    {
        super.updateSpecial();

        if (time > this.timeOfDeath)
            Pawn.removeWithID(this.id);


        //une éventuelle particule de fumée derrière la balle
    }
    updatePos()
    {
        this.a = this.a.add(this.aconst);

        super.updatePos();
    }
}
class EnnemyShotgun extends Shotgun
{
    constructor(idPawn, shootingToTheRigth)
    {
        super(idPawn, shootingToTheRigth);

        //=============================
        this.magazineSize = 1;
        this.reloadTime = 100;

        //=============================
    }
}



//==============================================================================================================================================
class Machinegun extends Weapon
{
    constructor(idPawn, shootingToTheRigth)
    {
        //====================================
        var cooldown = 0.2,
            reloadTime = 0,
            magazineSize = 150;
        super(shootingToTheRigth, cooldown, reloadTime, magazineSize);

        this.recoil = 0.04;
        this.bulletsMaxAngle = (3.5) * m.PI / 180;
        this.bulletDamageMult = 1;
        //====================================

        this.ownerid = idPawn;
    }
    shoot(weaponPackage)
    {
        var returnrecoil = new Vect2(0, 0);
        while (this.canShoot())
        {
            var shootPos = weaponPackage.posOfShooting;

            //new ShotgunBlastParticle(shootPos, weaponPackage.vOfPawn, !this.isShootingToTheRigth);            

            new BulletPlaneDouille(shootPos.add(randomVect2Disk(2, 2)));

            var newPos = shootPos;
            var angle = (this.isShootingToTheRigth ? 0 : m.PI) + this.mult * this.bulletsMaxAngle * (1 - 2 * (m.random()));

            //on ajoute la vitesse du joueur
            new MachinegunBullet(this.ownerid, this.isShootingToTheRigth, this.bulletDamageMult, newPos, angle, weaponPackage.vOfPawn);

            returnrecoil = returnrecoil.add(new Vect2(-this.mult * weaponPackage.vMaxPawn * this.recoil, 0));
        }
        return returnrecoil;
    }
}
class MachinegunBullet extends Bullet
{
    constructor(idPawn, isFromGoodGuys, damageMult, pos, rot = 0, vToAdd = new Vect2(0, 0), drawLayer = 60)
    {
        //============================================
        var defaultSpeed = new Vect2(wCanvas * 0.02, 0),
            knockback = 1,
            damage = 10;

        //============================================

        //constructor (ownerid, isFromGoodGuys, damage, damageMult, pos, defaultSpeed, knockback, drawFile, rot = 0, vToAdd = new Vect2(0, 0), drawLayer = 60)
        super(idPawn, isFromGoodGuys, damage, damageMult, pos, defaultSpeed, knockback, bulletPlaneImage, rot, vToAdd, drawLayer)
        this.name = "Biplane Bullet";

    }
}