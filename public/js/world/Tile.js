export default class Tile {

    constructor(x, y, obstructed) {
        this.x = x
        this.y = y
        // gCost and hCost will be set during the pathfinding algorithm and do not need to be set on creation
        this.gCost = 0
        this.hCost = 0
        this.obstructed = obstructed
    }

    getX = function() {
        return this.x
    }

    getY = function() {
        return this.y
    }

    isObstructed = function() {
        return this.obstructed
    }

    getFCost = function() {
        return this.gCost + this.hCost
    }
}