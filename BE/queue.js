class Queue {
  constructor() {
    this.queue = [];
  }

  // Добавление мастера в очередь
  enqueue(master) {
    this.queue.push(master);
  }

  // Удаление мастера из начала очереди
  dequeue() {
    return this.queue.shift();
  }

  // Перемещение мастера в конец очереди
  moveToBack(master) {
    const index = this.queue.indexOf(master);
    if (index !== -1) {
      this.queue.splice(index, 1); // Удаляем мастера из текущей позиции
      this.enqueue(master); // Добавляем его в конец очереди
    }
  }
}

module.exports = Queue;
