ig.module(
	'game.entities.player'
)
.requires(
	'plugins.chipmunk.entity'
)
.defines(function(){

EntityPlayer = ig.CPEntity.extend({
	size: {x: 8, y:14},
	offset: {x: 4, y: 2},
	
	type: ig.Entity.TYPE.A,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NEVER, // Collision is already handled by Box2D!
	
	animSheet: new ig.AnimationSheet( 'media/player.png', 16, 24 ),	
	
	flip: false,

	coefriction: 0.99,
	elasticity: 0,
	mass: 5,
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		// Add the animations
		this.addAnim( 'idle', 1, [0] );
		this.addAnim( 'jump', 0.07, [1,2] );
	},
	
	
	update: function() {
		
		// move left or right
		if( ig.input.state('left') ) {
			this.body.applyImpulse( cp.v(-20,0), cp.vzero );
			this.flip = true;
		}
		else if( ig.input.state('right') ) {
			this.body.applyImpulse( cp.v(20,0), cp.vzero );
			this.flip = false;
		}
		
		// jetpack
		if( ig.input.state('jump') ) {
			this.body.applyImpulse( cp.v(0,-30), cp.vzero );
			this.currentAnim = this.anims.jump;
		}
		else {
			this.currentAnim = this.anims.idle;
		}
		
		// shoot
		if( ig.input.pressed('shoot') ) {
			var x = this.pos.x + (this.flip ? -6 : 6 );
			var y = this.pos.y + 6;
			ig.game.spawnEntity( EntityProjectile, x, y, {flip:this.flip} );
		}
		
		this.currentAnim.flip.x = this.flip;
		
		
		// This sets the position and angle. We use the position the object
		// currently has, but always set the angle to 0 so it does not rotate
		this.body.setAngle(0);
		this.body.setAngularVelocity(0);
		
		// move!
		this.parent();
	}
});


EntityProjectile = ig.CPEntity.extend({
	size: {x: 8, y: 4},
	
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.B, 
	collides: ig.Entity.COLLIDES.NEVER, // Collision is already handled by Box2D!
		
	animSheet: new ig.AnimationSheet( 'media/projectile.png', 8, 4 ),	
	
	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		
		this.addAnim( 'idle', 1, [0] );
		this.currentAnim.flip.x = settings.flip;
		
		var velocity = (settings.flip ? -300 : 300);
		this.body.applyImpulse( cp.v(velocity,0), cp.vzero );
	}	
});

});