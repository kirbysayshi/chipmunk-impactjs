ig.module( 
	'plugins.chipmunk.debug'
)
.requires(
	'plugins.chipmunk.cp',
	'impact.debug.menu'
)
.defines(function(){


CPDebugPanel = ig.DebugPanel.extend({

	init: function( name, label ){
		this.parent( name, label );
	}

	,ready: function(){

	}

	,beforeRun: function(){

	}

	,afterRun: function(){

	}

});

ig.cp._igDrawBodies = false;
ig.cp._igDrawShapes = false;
ig.cp._igDrawCollisionRects = false;

ig.debug.addPanel({
	 type: CPDebugPanel
	,name: 'chipmunk'
	,label: 'Chipmunk'

	,options: [{ 
		 name: 'Draw Bodies'
		,object: ig.cp
		,property: '_igDrawBodies'
	},{ 
		 name: 'Draw Shapes'
		,object: ig.cp
		,property: '_igDrawShapes'
	},{ 
		 name: 'Draw Collision Rects (Impact Map)'
		,object: ig.cp
		,property: '_igDrawCollisionRects'
	}]
});

///////////////////////////////////////////////////////////////////////////////
// BEGIN DRAW METHODS FROM CHIPMUNK DEMOS
// https://github.com/josephg/Chipmunk-js/blob/master/demo/demo.js

var point2canvas = function(point){
	// copy these points because we're mutating, and don't want to 
	// explode the simulation!

	return cp.v( 
		 ig.system.getDrawPos( point.x - ig.game.screen.x )
		,ig.system.getDrawPos( point.y - ig.game.screen.y )
	)
}

var drawCircle = function(ctx, c, radius) {
	var c = point2canvas(c);
	ctx.beginPath();
	ctx.arc(c.x, c.y, radius, 0, 2*Math.PI, false);
	ctx.fill();
	ctx.stroke();
};

var drawLine = function(ctx, a, b) {
	a = point2canvas(a); b = point2canvas(b);

	ctx.beginPath();
	ctx.moveTo(a.x, a.y);
	ctx.lineTo(b.x, b.y);
	ctx.stroke();
};

var springPoints = [
	cp.v(0.00, 0.0),
	cp.v(0.20, 0.0),
	cp.v(0.25, 3.0),
	cp.v(0.30,-6.0),
	cp.v(0.35, 6.0),
	cp.v(0.40,-6.0),
	cp.v(0.45, 6.0),
	cp.v(0.50,-6.0),
	cp.v(0.55, 6.0),
	cp.v(0.60,-6.0),
	cp.v(0.65, 6.0),
	cp.v(0.70,-3.0),
	cp.v(0.75, 6.0),
	cp.v(0.80, 0.0),
	cp.v(1.00, 0.0)
];

var drawSpring = function(ctx,  a, b) {
	a = point2canvas(a); b = point2canvas(b);
	
	ctx.beginPath();
	ctx.moveTo(a.x, a.y);

	var delta = v.sub(b, a);
	var len = v.len(delta);
	var rot = v.mult(delta, 1/len);

	for(var i = 1; i < springPoints.length; i++) {

		var p = v.add(a, v.rotate(cp.v(springPoints[i].x * len, springPoints[i].y), rot));

		//var p = v.add(a, v.rotate(springPoints[i], delta));
		
		ctx.lineTo(p.x, p.y);
	}

	ctx.stroke();
};


// **** Draw methods for Shapes

cp.PolyShape.prototype.draw = function(ctx)
{
	ctx.beginPath();

	var verts = this.tVerts;
	var len = verts.length;
	var lastPoint =  point2canvas(new cp.Vect(verts[len - 2], verts[len - 1]));
	ctx.moveTo(lastPoint.x, lastPoint.y);

	for(var i = 0; i < len; i+=2){
		var p = point2canvas(new cp.Vect(verts[i], verts[i+1]));
		ctx.lineTo(p.x, p.y);
	}
	ctx.fill();
	ctx.stroke();
};

cp.SegmentShape.prototype.draw = function(ctx) {
	ctx.save();
	ctx.lineWidth = Math.max(1, this.r * ig.system.scale * 2);
	drawLine(ctx,  this.ta, this.tb);
	ctx.restore();
};

cp.CircleShape.prototype.draw = function(ctx) {
	drawCircle(ctx, this.tc, this.r);

	// And draw a little radian so you can see the circle roll.
	drawLine(ctx, this.tc, cp.v.mult(this.body.rot, this.r).add(this.tc));
};


// Draw methods for constraints

cp.PinJoint.prototype.draw = function(ctx) {
	var a = this.a.local2World(this.anchr1);
	var b = this.b.local2World(this.anchr2);
	
	ctx.lineWidth = 2;
	ctx.strokeStyle = "grey";
	drawLine(ctx,  a, b);
};

cp.SlideJoint.prototype.draw = function(ctx) {
	var a = this.a.local2World(this.anchr1);
	var b = this.b.local2World(this.anchr2);
	var midpoint = v.add(a, v.clamp(v.sub(b, a), this.min));

	ctx.lineWidth = 2;
	ctx.strokeStyle = "grey";
	drawLine(ctx, a, b);
	ctx.strokeStyle = "red";
	drawLine(ctx, a, midpoint);
};

cp.PivotJoint.prototype.draw = function(ctx) {
	var a = this.a.local2World(this.anchr1);
	var b = this.b.local2World(this.anchr2);
	ctx.strokeStyle = "grey";
	ctx.fillStyle = "grey";
	drawCircle(ctx, a, 2);
	drawCircle(ctx, b, 2);
};

cp.GrooveJoint.prototype.draw = function(ctx) {
	var a = this.a.local2World(this.grv_a);
	var b = this.a.local2World(this.grv_b);
	var c = this.b.local2World(this.anchr2);
	
	ctx.strokeStyle = "grey";
	drawLine(ctx,  a, b);
	drawCircle(ctx, c, 3);
};

cp.DampedSpring.prototype.draw = function(ctx) {
	var a = this.a.local2World(this.anchr1);
	var b = this.b.local2World(this.anchr2);

	ctx.strokeStyle = "grey";
	drawSpring(ctx, a, b);
};

var randColor = function() {
	return Math.floor(Math.random() * 256);
};

var styles = [];
for (var i = 0; i < 100; i++) {
	styles.push("rgb(" + randColor() + ", " + randColor() + ", " + randColor() + ")");
}

//styles = ['rgba(255,0,0,0.5)', 'rgba(0,255,0,0.5)', 'rgba(0,0,255,0.5)'];

cp.Shape.prototype.style = function() {
	var body;
	if (this.sensor) {
		return "rgba(255,255,255,0)";
	} else {
		body = this.body;
		if (body.isSleeping()) {
			return "rgb(50,50,50)";
		} else if (body.nodeIdleTime > this.space.sleepTimeThreshold) {
			return "rgb(170,170,170)";
		} else {
			return styles[this.hashid % styles.length];
		}
	}
};

// END DRAW METHODS FROM CHIPMUNK DEMOS
// https://github.com/josephg/Chipmunk-js/blob/master/demo/demo.js
///////////////////////////////////////////////////////////////////////////////

});