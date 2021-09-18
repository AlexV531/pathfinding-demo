import Component from "../Component.js";
import { findPath } from "../world/Pathfinding.js";

export default class MoveComponent extends Component {

	// This class could definitly use some optimizations
	// It also should change how it gets the tileMap, maybe through the move command?

	constructor(tileMap) {
		super()
		// See above about tileMap problems
		this.tileMap = tileMap
		this.speed = 0.004
		this.moving = false
		this.tileWidth = this.tileMap.getTileWidth()
		console.log('Move Component Created')	
	}

	move(x, y) {
		// Converts the coords of the object to tileMap x and y coords
		this.curr = {
			x:this.parent.x/this.tileWidth, 
			y:this.parent.y/this.tileWidth
		}

		// Checks if the current position is already at target
		if(x === this.curr.x && y === this.curr.y) {
			return
		}

		// Checks if the path is not null before replacing the original path
		let tempPath = findPath(this.tileMap, this.curr.x, this.curr.y, x, y)
		if(tempPath === null) {
			return
		}
		this.path = tempPath

		this.target = {
			x:x, y:y
		}

		// Finds next node in path
		this.next = {
			x:this.path[0].getX(),
			y:this.path[0].getY()
		}
		this.nextNodeIndex = 0

		// Starts the update command
		this.moving = true
	}

	update(deltaTime) {
		if(this.moving) {
			// Calculates the distance To Travel in one frame
			let distTT = this.speed * deltaTime
			while(true) {
				// Calculates the distance To Next Node from the current position
				let distTNN = {
					x:Math.abs(this.curr.x - this.next.x),
					y:Math.abs(this.curr.y - this.next.y)
				}
				// If the next node is reached, update the next node
				if(this.nodeIsReached(distTT, distTNN)) {
					// Update the current position to the next node
					this.curr.x = this.next.x
					this.curr.y = this.next.y
					// If this position is the target position, stop moving
					if(this.target.x === this.next.x && this.target.y === this.next.y) {
						this.moving = false
						this.updateParentPosition()
						return
					}
					// Update distance to travel to account for the movement to the next node 
					//(Maybe move this sqrt calc somewhere else, like before the nodeIsReached if)
					distTT - Math.sqrt(distTNN.x ** 2, distTNN.y ** 2)
					// Find the next next node
					this.nextNodeIndex++
					this.next.x = this.path[this.nextNodeIndex].getX()
					this.next.y = this.path[this.nextNodeIndex].getY()
				}
				else {
					break
				}
			}
			// The distance to travel is added to the current position
			let theta = Math.atan2(this.next.y - this.curr.y, this.next.x - this.curr.x)
			this.curr.x = this.curr.x + distTT * Math.cos(theta)
			this.curr.y = this.curr.y + distTT * Math.sin(theta)

			// Position is updated
			this.updateParentPosition()
		}
	}

	updateParentPosition() {
		this.parent.x = this.curr.x*this.tileWidth
		this.parent.y = this.curr.y*this.tileWidth
	}

	nodeIsReached(distTT, distTNN) {
		// If the distance to travel is greater or equal to the distance to the next node, return true
		// Or if the current position is equal to the next position
		if(distTT >= Math.sqrt(distTNN.x ** 2 + distTNN.y ** 2) || (this.curr.x === this.next.x && this.curr.y === this.next.y)) {
			return true
		}
		return false
	}

	// OLD MOVEMENT CODE, REALLY MESSY AND JANKY

	/*
	move(x, y) {
		// Converts the coords of the object to tileMap x and y coords
		this.x = this.parent.x/this.tileWidth
		this.y = this.parent.y/this.tileWidth

		if(x === this.x && y === this.y) {
			return
		}

		this.targetX = x
		this.targetY = y
		this.path = findPath(this.tileMap, this.x, this.y, x, y)
		if(this.path === null) {
			return
		}

		this.nextX = this.path[0].getX()
		this.nextY = this.path[0].getY()
		this.nextNodeIndex = 0
		if(this.nextX === this.x && this.nextY === this.y) {
			this.nextX = this.path[1].getX()
			this.nextY = this.path[1].getY()
			this.nextNodeIndex = 1
		}

		this.distX = Math.abs(this.x - this.nextX)
		this.distY = Math.abs(this.y - this.nextY)

		this.diffX = 0
		this.diffY = 0

		this.speedX = 0
		this.speedY = 0

		this.moving = true

		this.determineSpeeds()

	}
	*/

	/*
	update(deltaTime) {
		if(this.moving) {
			// Updates the distance to the next node from the current position (for nodeIsReached)
			this.distX = Math.abs(this.x - this.nextX)
			this.distY = Math.abs(this.y - this.nextY)
			// Updates the objects position according to it's speed and previously set direction
			this.x = this.x + (this.speedX * deltaTime)
			this.y = this.y + (this.speedY * deltaTime)
			// Updates the real coords, and converts back from tileMap coords
			this.parent.x = this.x*this.tileWidth
			this.parent.y = this.y*this.tileWidth

			if(this.nodeIsReached(deltaTime)) {

				// Finds the distance the object would have gone past the next node
				this.diffX = Math.abs(this.x - this.nextX)
				this.diffY = Math.abs(this.y - this.nextY)
				// Rounds the object's coords to the appropriate grid space
				this.x = this.nextX
				this.y = this.nextY

				// Checks to see if the object is at the target
				if(this.targetX === this.x && this.targetY === this.y) {
					this.moving = false
					return
				}
				// Increments the next node in the list
				this.nextNodeIndex++
				this.nextX = this.path[this.nextNodeIndex].getX()
				this.nextY = this.path[this.nextNodeIndex].getY()
				// Finds the distance to the next node (I think this is useless)
				this.distX = Math.abs(this.x - this.nextX)
				this.distY = Math.abs(this.y - this.nextY)
				// Finds the direction of the next node
				this.determineSpeeds()

				// Adds the difference back onto the position, this time in the direction of the new node
				this.x = this.x + this.diffX
				this.y = this.y + this.diffY
				// Converts the coords back from tileMap coords, and updates the real values
				this.parent.x = this.x*this.tileWidth
				this.parent.y = this.y*this.tileWidth
			}
		}
	}
	*/

	/*
	nodeIsReached(deltaTime) {
		if(this.speed * deltaTime >= Math.sqrt(this.distX ** 2, this.distY ** 2)) {
			return true
		}
	}
	*/

	/*
	determineSpeeds() {
		// Finds the angle to the next node
		let angle = Math.atan2(this.nextY - this.y, this.nextX - this.x)
		// Determines the x and y speeds based off that angle
		this.speedX = this.speed * Math.cos(angle)
		this.speedY = this.speed * Math.sin(angle)
		// Converts the difference that was cut off based off the angle (the new direction)
		let diffTotal = Math.sqrt(this.diffX ** 2, this.diffY ** 2)
		this.diffX = diffTotal * Math.cos(angle)
		this.diffY = diffTotal * Math.sin(angle)
	}
	*/
}