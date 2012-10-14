ig.module( 
	'plugins.chipmunk.entity'
)
.requires(
	'impact.entity',	
	'plugins.chipmunk.game'
)
.defines(function(){

ig.CPEntity = ig.Entity.extend({

	elasticity: 0.0,
	coefriction: 0.6,
	mass: 1,
	inertia: null,

	init: function( x, y , settings ) {
		this.parent( x, y, settings );
		
		// Only create a chipmunk body when we are not in Weltmeister
		if( !ig.global.wm ) { 
			this.createBody();
		}
	},

	createBody: function(){
		var  moment = this.inertia || cp.momentForBox(1, this.size.x, this.size.y)
			,body = this.body = new cp.Body( this.mass || 1, moment )
			,shape = this.shape = new cp.BoxShape( body, this.size.x, this.size.y)

		shape.setElasticity( this.elasticity );
		shape.setFriction( this.coefriction );

		body.setPos( cp.v( this.pos.x, this.pos.y ) )

		body.igEntity = this;

		ig.space.addBody( body )
		ig.space.addShape( shape )
	},

	update: function(){

		this.pos.x = this.body.p.x - this.size.x/2;
		this.pos.y = this.body.p.y - this.size.y/2;

		if( this.currentAnim ){
			this.currentAnim.update();
			this.currentAnim.angle = this.body.a;
		}
	},

	kill: function(){
		// not too sure about this, might have to manually track constraints as well
		ig.space.removeBody( this.body );
		ig.space.removeSpace( this.space );
		this.body.removeSpace( this.space );
	}

});

});
