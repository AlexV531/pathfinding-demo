
export default class MinHeap {
	
	constructor() {
		// Remember that the number of elements in the heap is always this.heap.length - 1
		this.heap = [null]
	}

	add(value, priority) {
		const newNode = new Node(value, priority)
		this.heap.push(newNode)
		newNode.heapIndex = this.heap.length - 1
		this.sortUp(newNode)
	}

	remove() {
		if (this.heap.length < 3) {
			const toReturn = this.heap.pop().value;
			this.heap[0] = null;
			return toReturn;
		}
		const toReturn = this.heap[1].value
		this.heap[1] = this.heap[this.heap.length - 1]
		this.heap[1].heapIndex = 1
		this.sortDown(this.heap[1])
		this.heap.pop()
		return toReturn
	}

	sortUp(newNode) {
		let parentIndex = Math.floor(newNode.heapIndex / 2)

		while(true) {
			let parentNode = this.heap[parentIndex]
			if(parentNode != null && newNode.priority < parentNode.priority) {
				this.swap(newNode, parentNode)
			} else {
				break
			}
			parentIndex = Math.floor(newNode.heapIndex / 2)
		}
	}

	sortDown(node) {
		while(true) {
			let childIndexLeft = node.heapIndex * 2
			let childIndexRight = node.heapIndex * 2 + 1
			let swapIndex = 0

			if(childIndexLeft < this.heap.length) {
				swapIndex = childIndexLeft
				//console.log("Reached first if")
				if(childIndexRight < this.heap.length) {
					//console.log("Reached second if")
					if(this.heap[childIndexLeft].priority > this.heap[childIndexRight].priority) {
						//console.log("Reached thrid if")
						swapIndex = childIndexRight
					}
				}
				if(node.priority > this.heap[swapIndex].priority) {
					//console.log("Reached forth if")
					this.swap(node, this.heap[swapIndex])
				} else {
					return
				}
			} else {
				return
			}
		}
	}

	swap(nodeA, nodeB) {
		this.heap[nodeA.heapIndex] = nodeB
		this.heap[nodeB.heapIndex] = nodeA
		let nodeAIndex = nodeA.heapIndex
		nodeA.heapIndex = nodeB.heapIndex
		nodeB.heapIndex = nodeAIndex
	}

	includes(value) {
		for(let i = 1; i < this.heap.length; i++) {
			if(value === this.heap[i].value) {
				return true
			}
		}
		return false
	}

	size() {
		return this.heap.length - 1
	}
}

class Node {
	constructor(val, priority) {
		this.value = val
		this.priority = priority
		this.heapIndex = 0
	}
}