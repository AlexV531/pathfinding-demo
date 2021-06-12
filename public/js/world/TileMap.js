import Tile from './Tile.js'

// This map currently only works for square layouts for now
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
		this.testPath = []
		this.start = {
			x:null, y:null
		}
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
		//console.log(this.testPath)
		context.fillStyle = '#FFFFFF'
		let imgIndex
		for(let y = 0; y < this.size; y++) {
			for(let x = 0; x < this.size; x++) {
				if(this.testPath != null && this.testPath.includes(this.getTileAt(x, y))) {
					imgIndex = 2
				} else if(this.start.x === x && this.start.y === y) {
					imgIndex = 3
				} else if(this.getTileAt(x, y).isObstructed()) {
					imgIndex = 1
				} else {
					imgIndex = 0
				}
				context.drawImage(this.tileHighlights[imgIndex], x*this.tileWidth, y*this.tileWidth, this.tileWidth, this.tileWidth)
			}
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