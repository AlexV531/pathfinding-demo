import { loadAssets } from './assets.js'
import SpriteComponent from './components/SpriteComponent.js'
import TestComponent from './components/TestComponent.js'
import MoveComponent from './components/MoveComponent.js'
import GameObject from './GameObject.js'
import { findPath } from './world/Pathfinding.js'
import TileMap from './world/TileMap.js'
import { pos, initCamera, updateCamera,  } from './Camera.js'

/** @type {HTMLCanvasElement} */
const canvas = document.querySelector('canvas.main-canvas')
/** Drawing Context */
const context = canvas.getContext('2d')
/** Size of our drawing area */
const viewport = {
	width: 320, height: 240 // These will be determined later..
}

let prevT = Date.now()

/** Scene scaling */
const SCALE = 10.0
/** Background */
const BG_COLOR = '#000000'
/** Tile Map */
let tileMap
/** Pathfinding testers */
let startTest = {
	x:null, y:null
}
let targetTest = {
	x:null, y:null
}
/** Mouse position */
let mouse = {
	x:0, y:0
}
let mouseTile = {
	x:0, y:0
}//** Obstruction variables */
let placeObstruction = false
let removeObstruction = false

let testObject
let testOnce = true

//let count = 0

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
	let code = e.keyCode 
	if (code === 90) {
		placeObstruction = true
	}
	if (code === 88) {
		removeObstruction = true
	}
} 

/** @param {KeyboardEvent} e */
function handleKeyUp(e) {
	let code = e.keyCode 
	if (code === 90) {
		placeObstruction = false
	}
	if (code === 88) {
		removeObstruction = false
	}
} 

/** @param {MouseEvent} e */
function handleMouseMove(e) {
	mouse = {
		x:(e.clientX - pos.x) / (viewport.width / SCALE),
		y:-(e.clientY + pos.y - viewport.height) / (viewport.width / SCALE)
	}
	mouseTile = {
		x:Math.floor(mouse.x / tileMap.getTileWidth()),
		y:Math.floor(mouse.y / tileMap.getTileWidth())
	}
}

/** @param {MouseEvent} e */
function handleClick(e) {
	if(!(mouseTile.x < 0 || mouseTile.y < 0 || mouseTile.x > tileMap.getMapSizeX() || mouseTile.y > tileMap.getMapSizeY())) {
		// Move player
		if(e.shiftKey) {
			testObject.getComponent(MoveComponent).move(mouseTile.x, mouseTile.y)
			return
		}
		// Pathfinding tester
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

	initCamera()

	const assets = await loadAssets()
	tileMap = new TileMap(20, 0.4, assets[0])
	let testComponent = new TestComponent()
	let spriteComponent = new SpriteComponent(assets[1])
	let moveComponent = new MoveComponent(tileMap)
	testObject = new GameObject("test", 2, 2, [testComponent, spriteComponent, moveComponent])
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
	context.translate(pos.x, viewport.height - pos.y)
	//console.log(viewport.height)
	context.scale(viewport.width / SCALE, -viewport.width / SCALE)
	context.getTransform()

	// Draw the tile map
	tileMap.render(context)

	//console.log(mouse.x + " | " + mouse.y)
	testObject.render(context)

	context.restore()
}

//start animation loop
function update() {
	const curT = Date.now()
	const deltaT = curT - prevT
	const fT = deltaT/1000

	updateCamera(deltaT)
	
	if(placeObstruction) {
		console.log("hello")
		tileMap.getTileAt(mouseTile.x, mouseTile.y).obstructed = true
	}
	else if(removeObstruction) {
		tileMap.getTileAt(mouseTile.x, mouseTile.y).obstructed = false
	}

	testObject.update(deltaT)

	if(testOnce) {
		testOnce = false
	}

	prevT = curT
	render()
	requestAnimationFrame(update)
}

initApp().then(() => {
	resize()
	console.log('Starting animation loop')
	requestAnimationFrame(update)
})
