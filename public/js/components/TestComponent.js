import Component from "../Component.js"

export default class TestComponent extends Component {

	constructor() {
		super()
		console.log("Test Component created")
	}

	update(deltaTime) {
		//console.log(this.parent.x, " | ", this.parent.y)
	}
}