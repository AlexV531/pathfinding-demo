import Heap from '../util/Heap.js'

// Finds a path from the designated start position to the target position
// Returns a list of tiles representing the shortest path from the start to the target
export function findPath(tileMap, startX, startY, targetX, targetY) {

	// Open and closed sets of tiles
	let open = new Heap()
	let closed = []

	// Finds the start and target tiles
	let startTile = tileMap.getTileAt(Math.floor(startX), Math.floor(startY))
	let targetTile = tileMap.getTileAt(targetX, targetY)

	let startTiles = []

	// If the starting position is not directly alligned to a tile
	if(startX % 1 != 0 || startY % 1 != 0) {
		// Attempt to add each of the four surrounding tiles to the open heap
		for(let i = 0; i < 4; i++) {
			let tileX = Math.floor(startX) + Math.floor(i/2)
			let tileY = Math.floor(startY) + i % 2
			let currentTile = tileMap.getTileAt(tileX, tileY)
			// If the tile is out of bounds or obstructed, don't add it
			if(tileX > tileMap.getMapSizeX() - 1 || tileY > tileMap.getMapSizeX() - 1) {
				continue
			} else if(!currentTile.isObstructed()) {
				// Find the g and h cost of the currentTile
				currentTile.gCost = Math.sqrt((tileX - startX) ** 2 + (tileY - startY) ** 2) * 10
				currentTile.hCost = tileMap.getDistance(currentTile, targetTile)
				// Add it to the open heap and startTiles list
				open.add(currentTile, currentTile.getFCost())
				startTiles.push(currentTile)
			}
		}
	// Otherwise, just add the starting tile to the open heap
	} else {
		open.add(startTile, 0)
		startTiles.push(startTile)
	}

	// Loops until a path has been found, or every tile has been checked
	while(open.size() > 0) {

		// Sets the current tile to the best option in the open heap
		let currentTile = open.remove()
		closed.push(currentTile)

		// If the tile is the target, return the path
		if(currentTile === targetTile) {
			return retracePath(startTiles, targetTile, tileMap)
		}

		// Finds all the neighboring tiles directly ajacent or diagonal to the tile
		let neighbors = getNeigbors(tileMap, currentTile)
		// Checks if the neighbor is obstruected or has been checked already
		for(let i = 0; i < neighbors.length; i++) {
			if(neighbors[i].isObstructed() || closed.includes(neighbors[i])) {
				continue
			}
			// Finds the movement cost to the neighbor (g cost) that is currently being checked
			let newMovementCostToNeighbor = currentTile.gCost + tileMap.getDistance(currentTile, neighbors[i])
			// If this g cost is cheaper than the existing g cost or the neighbor is not in the open heap, 
			// update the g cost and h cost and make the current tile the parent of the neighbor
			if(newMovementCostToNeighbor < neighbors[i].gCost || !open.includes(neighbors[i])) {
				neighbors[i].gCost = newMovementCostToNeighbor
				neighbors[i].hCost = tileMap.getDistance(neighbors[i], targetTile);
				neighbors[i].parent = currentTile

				// If the open heap doesn't include the neighbor, add it
				if(!open.includes(neighbors[i])) {
					open.add(neighbors[i], neighbors[i].getFCost())
				}
			}
		}
	}
	// Pathfinding failed, no way to access target tile (checked every tile)
	return null
}

// This will need to be changed if a map contains negative coordinates
// Adds each node around the current node to a list of neighbors
function getNeigbors(tileMap, tile) {
	let neighbors = []
	for(let x = -1; x <= 1; x++) {
		for(let y = -1; y <= 1; y++) {
			if(x == 0 && y == 0) {
				continue;
			}
			let checkX = tile.getX() + x;
			let checkY = tile.getY() + y;

			// Checks if the neighbor is out of bounds
			if(checkX >= 0 && checkX < tileMap.getMapSizeX() && checkY >= 0 && checkY < tileMap.getMapSizeY()) {
				// If the neighbor is diagonal from the tile, check if there are obstacles blocking the diagonal movement
				if(x != 0 && y != 0) {
					if(!tileMap.getTileAt(tile.getX(), checkY).isObstructed() && !tileMap.getTileAt(checkX, tile.getY()).isObstructed()) {
						neighbors.push(tileMap.getTileAt(checkX, checkY));
					}
				} else {
					neighbors.push(tileMap.getTileAt(checkX, checkY));
				}
			}
		}
	}
	return neighbors;
}

// Returns the path as a list of tiles going from the start tile to the target tile
function retracePath(startTiles, endTile, tileMap) {
	let path = []
	let currentTile = endTile
	while(!startTiles.includes(currentTile)) {
		path.unshift(currentTile)
		currentTile = currentTile.parent
	}
	path.unshift(currentTile)
	// For visualization purposes
	//tileMap.testPath = path
	return path
}