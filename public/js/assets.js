
const tileHighlightList = [
	"img/selected-tile-grey.png",
	"img/selected-tile-red.png",
	"img/selected-tile-green.png",
	"img/selected-tile-blue.png"
]
const tileHighlights = []

const testSpriteImg = "img/test-sprite.png"

export async function loadAssets() {
	for(let i = 0; i < tileHighlightList.length; i++) {
		tileHighlights.push(await loadImage(tileHighlightList[i]))
	}
	let testSprite = await loadImage(testSpriteImg)
	return [tileHighlights, testSprite]
}

/** @returns {Promise<HTMLImageElement>} */
function loadImage(url) {
	return new Promise((resolve) => {
		const image = new Image()
		image.onload = () =>{
			resolve(image)
		}
		image.src = url
	})
}
