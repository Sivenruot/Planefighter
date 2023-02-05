


class Player 
{
    constructor (pawn, controller)
    {
        if (pawn === undefined || controller === undefined)
            throw Error("Player sans pawn ou controller");
        if (!(pawn instanceof ControlablePawn))
            console.error("Le Pawn à controller n'est pas prévu pour");
        
        this.pawn = pawn;
        
        this.controller = controller;
        
        Player.sarr.push(this);
    }
    update ()
    {
        this.controller.update();
        this.updateKeys();
    }
    
    updateKeys ()
    {
        if (this.pawn.isDed) {
            this.pawn.isDying();
        } else {
            var d = this.controller.detected;
        
            if (this.controller.up > d)
                this.pawn.goUp(this.controller.up);
            if (this.controller.down > d)
                this.pawn.goDown(this.controller.down);
            if (this.controller.left > d)
                this.pawn.goLeft(this.controller.left);
            if (this.controller.right > d)
                this.pawn.goRight(this.controller.right);

            if (this.controller.up<d && this.controller.down<d && this.controller.left<d && this.controller.right<d)
                this.pawn.noDirPressed();

            
            if (this.controller.shoot) 
                this.pawn.shoot()
            if (this.controller.tab) {
                this.pawn.changeWeapons();
                this.controller.tab = false;
            }
        }
        
        if (this.controller.debug) {
            this.pawn.loseHP();
            this.controller.debug = false;
        }
           
    }
    static removePlayersWithErasedPawns()
    {
        Player.sarr = Player.sarr.filter(
            function(e) {
                return !e.pawn.isErasedFromExistence;
            });
    }
    static sarr = [];
    
}
class Controller 
{
    constructor ()
    {
        this.detected = 0.3; //à partir de quelle intensité on considère que l'on bouge (n'a de sens que pour les manettes)
        
        this.up = 0;
        this.down = 0;
        this.left = 0;
        this.right = 0; 
        this.shoot = false;
        this.debug = false;
        
    }
    update()
    {
        
    }
}
class BasicEnnemyAI extends Controller
{
    constructor (pawn, targetedPawn = null)
    {
        super();
        
        this.pawn = pawn;
        
        this.targetedPawn = targetedPawn;
        
        //==============
        //variables de fonctionnement
        //this.hasShot
    }
    update ()
    {
        if(this.pawn.pos.x > wCanvas*0.5)
            this.left = 1;
        else {
            this.left = 0;
            
        }
	this.shoot = true;
    }
    
}

class KeyboardController extends Controller
{
    constructor (type)
    {
        super();
        
        this.type = type;
        
        this.detected = 0.3; //à partir de quelle intensité on considère que l'on bouge (n'a de sens que pour les manettes)
        
        this.up = 0;
        this.down = 0;
        this.left = 0;
        this.right = 0; 
        this.shoot = false;
        this.debug = false;
        this.tab = false;
        
        this.type = type;
        
        var self = this;
    
        switch (type)
        {
            case "wasd":
                document.addEventListener("keydown", (function (e) {
                    switch (e.keyCode)
                    {
                        case 87:
                            self.up = 1;
                            break;

                        case 65:
                            self.left = 1;
                            break;

                        case 83:
                            self.down = 1;
                            break;

                        case 68:
                            self.right = 1;
                            break;
                            
                        case 32:
                            self.shoot = true;
                            break;
                            
                        case 188:
                            self.debug = true;
                            break;
                            
                        case 72:
                            self.tab = true;
                            break;
                    }
                }));
                document.addEventListener("keyup", (function (e) {
                    switch (e.keyCode)
                    {
                        case 87:
                            self.up = 0;
                            break;

                        case 65:
                            self.left = 0;
                            break;

                        case 83:
                            self.down = 0;
                            break;

                        case 68:
                            self.right = 0;
                            break;
                            
                        case 32:
                            self.shoot = false;
                            break;
                            
                        case 188:
                            self.debug = false;
                            break;
                            
                        case 72:
                            self.tab = false;
                            break;
                    }
                }));
		case "zqsd":
                document.addEventListener("keydown", (function (e) {
                    switch (e.keyCode)
                    {
                        case 90:
                            self.up = 1;
                            break;

                        case 81:
                            self.left = 1;
                            break;

                        case 83:
                            self.down = 1;
                            break;

                        case 68:
                            self.right = 1;
                            break;
                            
                        case 32:
                            self.shoot = true;
                            break;
                            
                        case 188:
                            self.debug = true;
                            break;
                            
                        case 72:
                            self.tab = true;
                            break;
                    }
                }));
                document.addEventListener("keyup", (function (e) {
                    switch (e.keyCode)
                    {
                        case 90:
                            self.up = 0;
                            break;

                        case 81:
                            self.left = 0;
                            break;

                        case 83:
                            self.down = 0;
                            break;

                        case 68:
                            self.right = 0;
                            break;
                         
                        case 32:
                            self.shoot = false;
                            break;
                        
                        case 188:
                            self.debug = false;
                            break;
                            
                        case 72:
                            self.tab = false;
                            break;
                    }
                }));
                break;
                
            case "arrows":
                document.addEventListener("keydown", (function (e) {
                    switch (e.keyCode)
                    {
                        case 38:
                            self.up = 1;
                            break;

                        case 37:
                            self.left = 1;
                            break;

                        case 40:
                            self.down = 1;
                            break;

                        case 39:
                            self.right = 1;
                            break;
                            
                        case 90:
                            self.shoot = true;
                            break;
                            
                        case 190:
                            self.debug = true;
                            break;
                            
                        case 67:
                            self.tab = true;
                            break;
                    }
                }));
                document.addEventListener("keyup", (function (e) {
                    switch (e.keyCode)
                    {
                        case 38:
                            self.up = 0;
                            break;

                        case 37:
                            self.left = 0;
                            break;

                        case 40:
                            self.down = 0;
                            break;

                        case 39:
                            self.right = 0;
                            break;
                        
                        case 90:
                            self.shoot = false;
                            break;
                            
                        case 190:
                            self.debug = false;
                            break;
                            
                        case 67:
                            self.tab = false;
                            break;
                    }
                }));
                break;
                
        }
    }
}
