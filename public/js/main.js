import { loadAssets } from './assets.js'
import { findPath } from './world/Pathfinding.js'
import TileMap from './world/TileMap.js'

/** @type {HTMLCanvasElement} */
const canvas = document.querySelector('canvas.main-canvas')
/** Drawing Context */
const context = canvas.getContext('2d')
/** Size of our drawing area */
const viewport = {
	width: 320, height: 240 // These will be determined later..
}

/** Scene scaling */
const SCALE = 10.0
/** Background */
const BG_COLOR = '#000000'
/** Radius of circle */
const CIRCLE_RADIUS = 0.2
const SPEED = 2 
const position = {
	x:0, y:0
}
const velocity = {
	x:0, y:0
}
let prevT = Date.now()
/** Tile Map */
let tileMap
/** Pathfinding testers */
let startTest = {
	x:null, y:null
}
let targetTest = {
	x:null, y:null
}
let mouse = {
	x:0, y:0
}
let mouseTile = {
	x:0, y:0
}

/** Handles initial canvas sizing, and all resizing thereafter */
function resize() {
	// Whenever the window is resized we need to update
	// the canvas resolution.
	const rc = canvas.getBoundingClientRect()
	canvas.width = viewport.width = rc.width
	canvas.height = viewport.height = rc.height
	render()
}

/** @param {KeyboardEvent} e */
function handleKeyDown(e) {
	const code = e.keyCode 
	if(code === 87) {
		velocity.y = SPEED
	}
	if (code === 83) {
		velocity.y = -SPEED
	} 
	if (code === 65) {
		velocity.x = -SPEED
	} 
	if (code === 68) {
		velocity.x = SPEED
	}
} 

/** @param {KeyboardEvent} e */
function handleKeyUp(e) {
	const code = e.keyCode 
	if(code === 87) {
		velocity.y = 0
	} 
	if (code === 83) {
		velocity.y = 0
	} 
	if (code === 65) {
		velocity.x = 0
	} 
	if (code === 68) {
		velocity.x = 0
	}
} 

/** @param {MouseEvent} e */
function handleMouseMove(e) {
	mouse = {
		x:(e.clientX - viewport.width / 2) / SCALE,
		y:-(e.clientY - viewport.height / 2) / SCALE
	}
	mouseTile = {
		x:Math.floor(mouse.x * tileMap.getTileWidth() / 2),
		y:Math.floor(mouse.y * tileMap.getTileWidth() / 2)
	}
	if(e.shiftKey) {
		tileMap.getTileAt(mouseTile.x, mouseTile.y).obstructed = true
	} else if(e.ctrlKey) {
		tileMap.getTileAt(mouseTile.x, mouseTile.y).obstructed = false
	}
}

/** @param {MouseEvent} e */
function handleClick(e) {
	if(!(mouseTile.x < 0 || mouseTile.y < 0)) {
		if(startTest.x === null) {
			startTest.x = mouseTile.x
			startTest.y = mouseTile.y
			tileMap.start.x = mouseTile.x
			tileMap.start.y = mouseTile.y
			tileMap.testPath = []
		} else if(targetTest.x === null) {
			targetTest.x = mouseTile.x
			targetTest.y = mouseTile.y
			tileMap.testPath = findPath(tileMap, startTest.x, startTest.y, targetTest.x, targetTest.y)
		} else {
			startTest.x = mouseTile.x
			startTest.y = mouseTile.y
			tileMap.start.x = mouseTile.x
			tileMap.start.y = mouseTile.y
			tileMap.testPath = []
			targetTest.x = null
		}
	}
}

/** Call this once on application startup */
async function initApp() {
	// Listen for window resize events
	window.addEventListener('resize', resize)
	window.addEventListener('keydown', handleKeyDown)
	window.addEventListener('keyup', handleKeyUp)
	window.addEventListener('mousemove', handleMouseMove)
	window.addEventListener('click', handleClick)

	const assets = await loadAssets()
	tileMap = new TileMap(10, 0.4, assets)
	tileMap.testPath = findPath(tileMap, 1, 1, 4, 5)
}

/** Render the scene */
function render() {
	// Clear the screen
	context.beginPath()
	context.fillStyle = BG_COLOR
	context.fillRect(0, 0, viewport.width, viewport.height)

	// Set up a cartesian-style coordinate system with 0,0
	// at the centre of the screen, and Y axis up.
	context.save()
	context.translate(viewport.width / 2, viewport.height / 2)
	context.scale(viewport.width / SCALE, -viewport.width / SCALE)

	// Draw the tile map
	tileMap.render(context)

	// Draw a circle and rectangle
	context.beginPath()
	context.fillStyle = '#FF0000'
	context.arc(position.x, position.y, CIRCLE_RADIUS, 0, Math.PI * 2)
	context.fill()

	context.restore()
}

//start animation loop
function update() {
	const curT = Date.now()
	const deltaT = curT - prevT
	const fT = deltaT/1000
	//position.x = position.x + fT * 1
	//position.x = Math.tan(curT/1000)
	//position.y = Math.sin(curT/1000) + Math.sin(curT/100)
	position.x += velocity.x * fT
	position.y += velocity.y * fT

	prevT = curT
	render()
	requestAnimationFrame(update)
}

initApp().then(() => {
	resize()
	console.log('Starting animation loop')
	requestAnimationFrame(update)
})
