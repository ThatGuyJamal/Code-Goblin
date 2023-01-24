import type { QueueItem } from '../typings/utils/types';

export class Queue<T> {
	private items: QueueItem<T>[] = [];
	public isProcessing: boolean = false;

	/**
	 * Adds an item to the queue
	 * @param id The id of the item
	 * @param item The item to add
	 */
	public add(id: string, item: T): this {
		this.items.push({
			id: id,
			data: item
		});

		return this;
	}

	/**
	 * Removes an item from the queue
	 */
	public remove(): void {
		if (!this.isEmpty()) this.items.shift();
	}

	/**
	 * Processes the first item in the queue
	 * @param id The id of the item
	 * @returns The first item in the queue
	 */
	public async process(): Promise<T | null> {
		if (this.isEmpty() || this.isProcessing) return null;

		this.isProcessing = true;
		while (!this.isEmpty()) {
			const item = this.items[0].data;
			let result;
			if (typeof item === 'function') {
				result = await item();
			} else {
				result = item;
			}
			this.remove();
			return result;
		}
		this.isProcessing = false;
		return null;
	}

	/**
	 * Checks if the queue is empty
	 * @returns {boolean} Whether the queue is empty
	 */
	public isEmpty(): boolean {
		return this.items.length === 0;
	}

	/**
	 * Checks if the queue contains an item
	 * @param id
	 * @returns
	 */
	public idInQueue(id: string): boolean {
		return this.items.some((item) => item.id === id);
	}
}
