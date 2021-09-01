import Component from "../Component.js"

export default class SpriteComponent extends Component {

	constructor(sprite) {
		super()
		this.sprite = sprite
		console.log("Sprite Component created")
		console.log(this.sprite)
	}

	render(context) {
		context.drawImage(this.sprite, this.parent.x, this.parent.y, 0.4, 0.4)
	}
}