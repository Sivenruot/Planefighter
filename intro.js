//Fate 0

"use strict";

var m = Math;

var deltaT = 1,
    tick = 0,
    time = 0,
    tickToGo = 0;


function boolToSign(bool)
{
    if (bool) 
        return 1;
    else
        return -1;
}
function random1m1() {
    return 2*(0.5-m.random())
}
function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}
function randomFloatFromInterval(min, max) { // min and max included 
    return Math.random() * (max - min + 1) + min
}
function randomRoundFromFloat(x) {
    return x + (m.random() < x % 1 ? 0 : -1)        
}
function randomVect2(v1, v2) {
    return v1.add(v2.subtract(v1).scale(m.random())); //a +(b-a)*t
}
function randomVect2Circle(rX=1, rY =1) {
    var theta = 2*m.PI*m.random();
    return new Vect2(rX*m.cos(theta), rY*m.sin(theta))
}
function randomVect2Disk(rX=1, rY =1) {
    var r = m.sqrt(m.random())
    return randomVect2Circle(rX, rY).scale(r);
}
var lastID = 0;
function generateID() {
    return lastID++;
}
function sortByYValues(arr)
{
    arr.sort(function(a, b) {
      var keyA = a.pos.y,
        keyB = b.pos.y;
      // Compare the 2 dates
      if (keyA > keyB) return -1;
      if (keyA < keyB) return 1;
      return 0;
    });
}

var wCanvas = window.innerWidth,             
    hCanvas = window.innerHeight,           
    canvas  = document.getElementById("mainCanvas"),
    ctx = canvas.getContext("2d");

var globalMultFactor = 1/devicePixelRatio;

canvas.width  = wCanvas;
canvas.height = hCanvas;
canvas.style.width  = wCanvas + "px";
canvas.style.height = hCanvas + "px";

ctx.imageSmoothingEnabled = false;


console.log("wCanvas:", wCanvas, "hCanvas:", hCanvas)




























/**
 * @class Vect2
 * @classdesc
 * Constructs a new vector with given x, y components.
 * Code adapted from {@link https://gist.github.com/Dalimil/3daf2a0c531d7d030deb37a7bfeff454}
 * @see {@link https://gist.github.com/Dalimil/3daf2a0c531d7d030deb37a7bfeff454}
 * @see {@link https://docs.unity3d.com/ScriptReference/Vect2.html}
 * 
 * @param {number} x - the x value
 * @param {number} y - the x value
 * 
 * @example new Vect2(56, 78);
 * @example Vect2.zero();
 * 
 * @constructor
 */
class Vect2 {
	constructor(x, y) {
        
        if (x === undefined || y === undefined)
            console.error("Vect2 avec une coordonnée undefined")
        
		this.x = Number(x);
		this.y = Number(y);
	}

	/**
	 * Set x and y components of an existing Vect2.
	 * 
	 * @example new Vect2(1, 2).set(3, 4); // (3, 4)
	 * 
	 * @param {number} x - the new X value
	 * @param {number} y - the new Y value
	 * @memberof Vect2
	 */
	set(x = 0, y = x) {
		this.x = x;
		this.y = y;
	}

	/**
	 * Update this vector based on the given one
	 * 
	 * @example new Vect2(1, 2).set(new Vect2(3, 4)); // (3, 4)
	 * @example 
	 * const myVector = new Vect2(1, 2);
	 * myVector.setVector(myVector.add(new Vect2(5))); // (6, 7)
	 * 
	 * @param {Vect2} vector - the vector to update this one
	 * @memberof Vect2
	 */
	setVector(vector) {
		this.x = vector.x;
		this.y = vector.y;
	}

	/**
	 * Return a copy of this vector.
	 * 
	 * @example new Vect2(1, 2).clone() // (1, 2)
	 * 
	 * @returns {Vector}
	 * @memberof Vect2
	 */
	clone() { return new Vect2(this.x, this.y); }

	/**
	 * Returns a new vector with the sum of this vector and the given one.
	 * 
	 * @param {Vect2} vector - the vector to add
	 * @returns {Vect2}
	 * @memberof Vect2
	 */
	add(vector) { return new Vect2(this.x + vector.x, this.y + vector.y); }

	/**
	 * Returns a new vector with the subtraction of this vector and the given one.
	 * 
	 * @param {Vect2} vector - the vector to subtract
	 * @returns {Vect2}
	 * @memberof Vect2
	 */
	subtract(vector) { return new Vect2(this.x - vector.x, this.y - vector.y); }

	/**
	 * Returns a new vector with the multiplication of this vector and the given one.
	 * 
	 * @param {Vect2} vector - the vector to multiply/scale
	 * @returns {Vect2}
	 * @memberof Vect2
	 */
	scale(scalar) { return new Vect2(this.x * scalar, this.y * scalar); }

	/**
	 * Dot Product of two vectors.
	 * 
	 * @param {Vect2} vector 
	 * @returns {number}
	 * @memberof Vect2
	 */
	dot(vector) { return (this.x * vector.x + this.y + vector.y); }

	/**
	 * Linearly interpolates between vectors A and B by t. t = 0 returns A, t = 1 returns B
	 * 
	 * @param {Vect2} vector - the vector to interpolate
	 * @param {number} t - time
	 * @returns {number}
	 * @memberof Vect2
	 */
	moveTowards(vector, t) {
		t = Math.min(t, 1); // still allow negative t
		const diff = vector.subtract(this);
		return this.add(diff.scale(t));
	}

	/**
	 * Returns the length of this vector (Read Only).
	 * @returns {number}
	 * @memberof Vect2
	 */
	magnitude() { return Math.sqrt(this.magnitudeSqr()); }

	/**
	 * Returns the squared length of this vector (Read Only).
	 * 
	 * @returns {number}
	 * @memberof Vect2
	 */
	magnitudeSqr() { return (this.x * this.x + this.y * this.y); }

	/**
	 * Returns the distance between this vector and a given vector.
	 * 
	 * @param {Vect2} vector - the vector to compare
	 * @returns {number}
	 * @memberof Vect2
	 */
	distance(vector) { return Math.sqrt(this.distanceSqr(vector)); }

	/**
	 * Returns the squared distance between this vector and a given vector.
	 * 
	 * @param {Vect2} vector - the vector to compare
	 * @returns {number}
	 * @memberof Vect2
	 */
	distanceSqr(vector) {
		const deltaX = this.x - vector.x;
		const deltaY = this.y - vector.y;
		return (deltaX * deltaX + deltaY * deltaY);
	}

	/**
	 * Returns this vector with a magnitude of 1 (Read Only).
	 * 
	 * @returns {Vect2}
	 * @memberof Vect2
	 */
	normalize() {
		const mag = this.magnitude();
		const vector = this.clone();
		if (Math.abs(mag) < 1e-9) {
			vector.x = 0;
			vector.y = 0;
		} else {
			vector.x /= mag;
			vector.y /= mag;
		}
		return vector;
	}

	/**
	 * Gets the unsigned angle in degrees between from and to.
	 * 
	 * @returns {number}
	 * @memberof Vect2
	 */
	angle() { return Math.atan2(this.y, this.x); }

	/**
	 * Return a new vector rotated
	 * 
	 * @param {number} alpha 
	 * @returns {Vect2}
	 */
	rotate(alpha) {
		const cos = Math.cos(alpha);
		const sin = Math.sin(alpha);
		return new Vect2(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
	}

	/**
	 * Fix the precision to the given decimal places
	 * 
	 * @example new Vect2(1.234, 5.123456).toPrecision(2) // (1.23, 5.12)
	 * 
	 * @param {number} precision - the number of decimal places
	 * @returns {Vect2}
	 * @memberof Vect2
	 */
	toPrecision(precision) {
		const vector = this.clone();
		vector.x = Number(vector.x.toFixed(precision));
		vector.y = Number(vector.y.toFixed(precision));
		return vector;
	}

	/**
	 * Returns true if the given vector is exactly equal to this vector.
	 * 
	 * @param {Vect2} vector - the vector to compare
	 * @returns {boolean}
	 * @memberof Vect2
	 */
	equals(vector) { return this.x === vector.x && this.y === vector.y }

	/**
	 * Returns a formatted string for this vector.
	 * 
	 * @returns {string}
	 * @memberof Vect2
	 */
	toString() {
		const vector = this.toPrecision(1);
		return ("[" + vector.x + "; " + vector.y + "]");
	}

	/**
	 * Return a new vector with absolute values
	 * 
	 * @example new Vect2(-1, 5).invert() // (1, 5)
	 * 
	 * @see {@link https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/Math/abs}
	 * @returns {Vect2}
	 * @memberof Vect2
	 */
	absolute() { return new Vect2(Math.abs(this.x), Math.abs(this.y)); }

	/**
	 * Return a new vector with the X and Y values inverted
	 * 
	 * @example new Vect2(-1, 5).invert() // (5, -1)
	 * 
	 * @returns {Vect2}
	 * @memberof Vect2
	 */
	invert() { return new Vect2(this.y, this.x); }

	/**
	 * Shorthand for writing Vect2(0, 0).
	 * @returns {Vect2}
	 * @memberof Vect2
	 */
	static zero() { return new Vect2(0); }

	/**
	 * Shorthand for writing Vect2(1, 1).
	 * @returns {Vect2}
	 * @memberof Vect2
	 */
	static one() { return new Vect2(1); }

	/**
		* Shorthand for writing Vect2(Infinity, Infinity).
		* @returns {Vect2}
		* @memberof Vect2
		*/
	static positiveInfinity() { return new Vect2(Infinity); }

	/**
		* Shorthand for writing Vect2(-Infinity, -Infinity).
		* @returns {Vect2}
		* @memberof Vect2
		*/
	static negativeInfinity() { return new Vect2(-Infinity); }

	/**
		* Shorthand for writing Vect2(0, 1).
		* @returns {Vect2}
		* @memberof Vect2
		*/
	static up(x) { return new Vect2(0, x); }

	/**
		* Shorthand for writing Vect2(0, -1).
		* @returns {Vect2}
		* @memberof Vect2
		*/
	static down(x) { return new Vect2(0, -x); }

	/**
		* Shorthand for writing Vect2(-1, 0).
		* @returns {Vect2}
		* @memberof Vect2
		*/
	static left(x) { return new Vect2(-x, 0); }

	/**
		* Shorthand for writing Vect2(1, 0).
		* @returns {Vect2}
		* @memberof Vect2
		*/
	static right(x) { return new Vect2(x, 0); }

	/**
	 * Creates a random vector with random normalized values
	 * 
	 * @returns {Vect2}
	 */
	static random() { return new Vect2(Math.random(), Math.random()); }
}
