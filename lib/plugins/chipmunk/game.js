ig.module( 
	'plugins.chipmunk.game'
)
.requires(
	'plugins.chipmunk.cp',
	'impact.game'
)
.defines(function(){

ig.CPGame = ig.Game.extend({

	collisionLayerFriction: 1,
	collisionLayerElasticity: 0,
	cpTimestep: 1 / 60,
	
	// Much of this code is copied with modifications from the box2d plugin
	
	loadLevel: function( data ) {
		
		// Find the collision layer and create the box2d world from it
		for( var i = 0; i < data.layer.length; i++ ) {
			var ld = data.layer[i];
			if( ld.name == 'collision' ) {
				ig.world = ig.space = this.createWorldFromMap( ld.data, ld.width, ld.height, ld.tilesize );
				break;
			}
		}
		
		this.parent( data );
	},


	createWorldFromMap: function( origData, width, height, tilesize ) {	

		var space = new cp.Space();
		space.gravity = cp.v( 0, this.gravity );

		// We need to delete those tiles that we already processed. The original
		// map data is copied, so we don't destroy the original.
		var data = ig.copy( origData );
		
		// Get all the Collision Rects from the map
		this.collisionRects = [];
		for( var y = 0; y < height; y++ ) {
			for( var x = 0; x < width; x++ ) {
				// If this tile is solid, find the rect of solid tiles starting
				// with this one
				if( data[y][x] ) {
					var r = this._extractRectFromMap( data, width, height, x, y );
					this.collisionRects.push( r );
				}
			}
		}
		
		// Go through all rects we gathered and create Box2D objects from them
		for( var i = 0; i < this.collisionRects.length; i++ ) {
			var  rect = this.collisionRects[i]

				// chipmunk uses +y going up, and requires polys to be clockwise and concave
				,verts = [ 
					 rect.x * tilesize
					,rect.y * tilesize

					,rect.x * tilesize
					,rect.y * tilesize + rect.height * tilesize

					,rect.x * tilesize + rect.width * tilesize
					,rect.y * tilesize + rect.height * tilesize

					,rect.x * tilesize + rect.width * tilesize
					,rect.y * tilesize ]
				,shape = new cp.PolyShape( space.staticBody, verts, cp.vzero )

			shape.setFriction( this.collisionLayerFriction );
			shape.setElasticity( this.collisionLayerElasticity );

			space.addStaticShape(shape);

			/*var bodyDef = new b2.BodyDef();
			bodyDef.position.Set(
				rect.x * tilesize * b2.SCALE + rect.width * tilesize / 2 * b2.SCALE,
				rect.y * tilesize * b2.SCALE + rect.height * tilesize / 2 * b2.SCALE
			);
			
			var body = world.CreateBody( bodyDef );
			var shape = new b2.PolygonDef();
			shape.SetAsBox(
				rect.width * tilesize / 2 * b2.SCALE,
				rect.height * tilesize / 2 * b2.SCALE
			);
			body.CreateShape( shape );
			*/
		}
		
		return space;
	},
	
	
	_extractRectFromMap: function( data, width, height, x, y ) {
		var rect = {x: x, y: y, width: 1, height: 1};
		
		// Find the width of this rect
		for(var wx = x + 1; wx < width && data[y][wx]; wx++ ) {
			rect.width++;
			data[y][wx] = 0; // unset tile
		}
		
		// Check if the next row with the same width is also completely solid
		for( var wy = y + 1; wy < height; wy++ ) {
			var rowWidth = 0;
			for( wx = x; wx < x + rect.width && data[wy][wx]; wx++ ) {
				rowWidth++;
			}
			
			// Same width as the rect? -> All tiles are solid; increase height
			// of this rect
			if( rowWidth == rect.width ) {
				rect.height++;
				
				// Unset tile row from the map
				for( wx = x; wx < x + rect.width; wx++ ) {
					data[wy][wx] = 0;
				}
			}
			else {
				return rect;
			}
		}
		return rect;
	},
	
	
	update: function() {
		ig.world.step( this.cpTimestep );
		this.parent();
	},
	
	
	draw: function() {
		this.parent();
		
		if( ig.cp._igDrawCollisionRects ){
			// Draw outlines of all collision rects
			var ts = this.collisionMap.tilesize;

			ig.system.context.save();
			ig.system.context.strokeStyle = '#00ff00';

			for( var i = 0; i < this.collisionRects.length; i++ ) {
				var rect = this.collisionRects[i];
				ig.system.context.strokeRect(
					ig.system.getDrawPos( rect.x * ts - this.screen.x ),
					ig.system.getDrawPos( rect.y * ts - this.screen.y ),
					ig.system.getDrawPos( rect.width * ts ),
					ig.system.getDrawPos( rect.height * ts )
				);
			}

			ig.system.context.restore();
		}

		if( ig.cp._igDrawShapes ){
			ig.system.context.save();

			ig.space.eachShape(function(shape){
				ig.system.context.fillStyle = shape.style();
				shape.draw( ig.system.context );
				//shape.body.isStatic() && console.log( shape )
			})

			ig.system.context.restore();
		}
	}
});

});
