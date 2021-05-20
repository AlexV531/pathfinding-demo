import Tile from './Tile.js'

// This map currently only works for square layouts for testing
export default class TileMap {
    
    constructor(size, tileWidth) {
        this.size = size
        this.tileWidth = tileWidth
        this.tileList = [...Array(size)].map(e => Array(size))
        for(var i = 0; i < size; i++) {
            for(var j = 0; j < size; j++) {
                this.#tileList[i][j] = new Tile(i, j, false)
            }
            
        }
    }

    getTileWidth() {
        return this.tileWidth
    }

    getMapSize() {
        return this.size
    }

    getTileList() {
        return this.tileList
    }

    render(context) {
        context.fillStyle = '#FFFFFF'
        for(let y = 0; y < this.size; y++) {
			for(let x = 0; x < this.size; x++) {
                context.fillRect(x*this.tileWidth, y*this.tileWidth, this.tileWidth, this.tileWidth, 0)
            }
        }
    }
}
