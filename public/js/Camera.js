export let pos = {
	x:0, y:0
}
const maxSpeed = 0.4
let speed = {
	left:0, right:0,
	up:0, down:0
}

export function initCamera() {
	window.addEventListener('keydown', handleKeyDown)
	window.addEventListener('keyup', handleKeyUp)
}

/** @param {KeyboardEvent} e */
function handleKeyDown(e) {
	let code = e.keyCode
	// Up
	if(code === 38) {
		speed.up = -1
	}
	// Down
	if(code === 40) {
		speed.down = 1
	}
	// Left
	if(code === 37) {
		speed.left = 1
	}
	// Right
	if(code === 39) {
		speed.right = -1
	}
}

/** @param {KeyboardEvent} e */
function handleKeyUp(e) {
	console.log("Hello from handleKeyUp in Camera.js")
	let code = e.keyCode
	// Up
	if(code === 38) {
		speed.up = 0
	}
	// Down
	if(code === 40) {
		speed.down = 0
	}
	// Left
	if(code === 37) {
		speed.left = 0
	}
	// Right
	if(code === 39) {
		speed.right = 0
	}
}

export function updateCamera(deltaTime) {
	// Update the camera's position
	pos.x = pos.x + (speed.left + speed.right) * maxSpeed * deltaTime
	pos.y = pos.y + (speed.up + speed.down) * maxSpeed * deltaTime
}

