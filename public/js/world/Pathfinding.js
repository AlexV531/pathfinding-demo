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

export async function findPath(tileMap, startX, startY, targetX, targetY) {
	let startTile = tileMap.getTileAt(startX, startY)
	let targetTile = tileMap.getTileAt(targetX, targetY)

	let open = new Heap()
	//let open = []
	let closed = []

	open.add(startTile, startTile.getFCost())
	//open.push(startTile)

	//console.log("Reached findPath")

	while(open.size() > 0) {
		//console.log("Reached while")
		// let currentTile = open[0]
		// let newIndex = 0
		// for(let j = 0; j < open.length; j++) {
		// 	if(open[j].getFCost() < currentTile.getFCost() || (open[j].getFCost() == currentTile.getFCost() && open[j].hCost < currentTile.hCost)) {
		// 		currentTile = open[j]
		// 		newIndex = j
		// 	}
		// }
		// open.splice(newIndex, 1)
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
					//open.push(neighbors[i])
				}
			}
		}
	}
	// Pathfinding failed, no way to access target tile
	return null
}