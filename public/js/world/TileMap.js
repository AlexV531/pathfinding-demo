import Tile from './Tile.js'
import { findPath } from './Pathfinding.js'

// This map currently only works for square layouts for testing
export default class TileMap {
    
	constructor(size, tileWidth, tileHighlights) {
		this.size = size
		this.tileWidth = tileWidth
		this.tileHighlights = tileHighlights
		this.tileList = [...Array(size)].map(e => Array(size))
		for(var i = 0; i < size; i++) {
			for(var j = 0; j < size; j++) {
				this.tileList[i][j] = new Tile(i, j, false)
			}
            
		}
		// This variable is temporary and is just used to test pathfinding
		this.path = []
	}

	getTileWidth() {
		return this.tileWidth
	}

	getMapSizeX() {
		return this.size
	}

	getMapSizeY() {
		return this.size
	}

	getTileList() {
		return this.tileList
	}

	getTileAt(x, y) {
		return this.tileList[x][y]
	}

	render(context) {
		// This render is just to test pathfinding
		context.fillStyle = '#FFFFFF'
		for(let y = 0; y < this.size; y++) {
			for(let x = 0; x < this.size; x++) {
				// if(this.path.includes(this.getTileAt(x, y))) {
				// 	context.drawImage(this.tileHighlights[2], x*this.tileWidth, y*this.tileWidth, this.tileWidth, this.tileWidth)
				// } else {
				// 	context.drawImage(this.tileHighlights[0], x*this.tileWidth, y*this.tileWidth, this.tileWidth, this.tileWidth)
				// }
				context.drawImage(this.tileHighlights[0], x*this.tileWidth, y*this.tileWidth, this.tileWidth, this.tileWidth)
			}
		}
	}

	// Just to test pathfinding
	testPath(startX, startY, targetX, targetY) {
		if(startX === this.pathCoords[0] && startY === this.pathCoords[1] && targetX === this.pathCoords[2] && targetY === this.pathCoords[3]) {
			return
		} else {
			this.path = findPath(this, startX, startY, targetX, targetY)
			this.pathCoords = [
				startX, startY, targetX, targetY
			]
		}
	}

	getDistance(tileA, tileB) {
		let difX = Math.abs(tileA.getX() - tileB.getX());
		let difY = Math.abs(tileA.getY() - tileB.getY());

		if(difX > difY) {
			return 14*difY + 10*(difX - difY);
		}
		else {
			return 14*difX + 10*(difY - difX);
		}
	}
}
