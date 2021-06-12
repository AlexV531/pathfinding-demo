import Heap from '../util/Heap.js'

// This will need to be changed if a map contains negative coordinates
function getNeigbors(tileMap, tile) {
	let neighbors = []
	//console.log("Reached getNeighbors")
	for(let x = -1; x <= 1; x++) {
		for(let y = -1; y <= 1; y++) {
			if(x == 0 && y == 0) {
				continue;
			}
			let checkX = tile.getX() + x;
			let checkY = tile.getY() + y;

			if(checkX >= 0 && checkX < tileMap.getMapSizeX() && checkY >= 0 && checkY < tileMap.getMapSizeY()) {
				neighbors.push(tileMap.getTileAt(checkX, checkY));
			}
		}
	}
	return neighbors;
}

function retracePath(startTile, endTile) {
	let path = []
	let currentTile = endTile
	//console.log("Reached retracePath")
	while(currentTile != startTile) {
		path.unshift(currentTile)
		currentTile = currentTile.parent
	}
	return path
}

export function findPath(tileMap, startX, startY, targetX, targetY) {
	// let startTiles = []
	// if(startX % 1 != 0 || startY % 1 != 0) {
	// 	startTiles.add(tileMap.getTileAt(Math.floor(startX), Math.floor(startY)))
	// }

	let open = new Heap()
	let closed = []

	let startTile
	let targetTile = tileMap.getTileAt(targetX, targetY)

	if(startX % 1 === 0 || startY % 1 === 0) {
		startTile = tileMap.getTileAt(startX, startY)
		open.add(startTile, 0)
	} else {
		for(let i = 0; i < 4; i++) {
			let tileX = Math.floor(startX) + Math.floor(i/2)
			let tileY = Math.floor(startY) + i % 2
			let currentTile = tileMap.getTileAt(tileX, tileY)
			if(tileX > tileMap.getMapSizeX() - 1 || tileY > tileMap.getMapSizeX() - 1) {
				continue
			} else if(!currentTile.isObstructed()) {
				currentTile.gCost = 10 * Math.sqrt((startX-tileX)**2 + (startY-tileY)**2)
				currentTile.hCost = tileMap.getDistance(currentTile, targetTile)
				open.add(currentTile, currentTile.getFCost())
			}
		}
	}
	
	open.add(startTile, startTile.getFCost())
	//console.log("Reached findPath")

	while(open.size() > 0) {
		//console.log("Reached while")
		let currentTile = open.remove()
		closed.push(currentTile)
		//console.log(closed.includes(tileMap.getTileAt(startX, startY)))

		if(currentTile === targetTile) {
			return retracePath(startTile, targetTile)
		}

		//console.log(currentTile)
		let neighbors = getNeigbors(tileMap, currentTile)
		//console.log(neighbors)
		for(let i = 0; i < neighbors.length; i++) {
			if(neighbors[i].isObstructed() || closed.includes(neighbors[i])) {
				continue
			}
			let newMovementCostToNeighbor = currentTile.gCost + tileMap.getDistance(currentTile, neighbors[i])
			//console.log(open.includes(neighbors[i]))
			if(newMovementCostToNeighbor < neighbors[i].gCost || !open.includes(neighbors[i])) {
				neighbors[i].gCost = newMovementCostToNeighbor
				neighbors[i].hCost = tileMap.getDistance(neighbors[i], targetTile);
				//console.log(neighbors[i].hCost)
				neighbors[i].parent = currentTile

				if(!open.includes(neighbors[i])) {
					open.add(neighbors[i], neighbors[i].getFCost())
				}
			}
		}
	}
	// Pathfinding failed, no way to access target tile
	return null
}