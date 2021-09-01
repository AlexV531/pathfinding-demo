export default class GameObject {

	constructor(name, x, y, components) {
		this.name = name
		this.x = x
		this.y = y
		// This is a list of all the components of the game object
		this.components = components
		for(let i = 0; i < this.components.length; i++) {
			this.components[i].setParent(this)
		}
	}

	update(deltaTime) {
		for(let i = 0; i < this.components.length; i++) {
			this.components[i].update(deltaTime)
		}
	}
    
	// Add a game renderer class at some point
	render(context) {
		for(let i = 0; i < this.components.length; i++) {
			this.components[i].render(context)
		}
	}

	getComponent(type) {
		for(let i = 0; i < this.components.length; i++) {
			if(this.components[i] instanceof type) {
				return this.components[i]
			}
		}
		return null
	}
}