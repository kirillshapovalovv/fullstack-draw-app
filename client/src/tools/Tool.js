export default class Tool {
    constructor(canvas, socket, id) {
        // ссылка на canvas
        this.canvas = canvas;
        this.socket = socket;
        this.id = id;
        // контекст - объект, позволяющий производить различные манипуляции на canvas
        this.ctx = canvas.getContext("2d");
        this.destroyEvents();
    }

    destroyEvents() {
        this.canvas.onmousemove = null
        this.canvas.onmousedown = null
        this.canvas.onmouseup = null
    }

    set lineWidth(width) {
        this.ctx.lineWidth = width;
    }

    set fillColor(color) {
        this.ctx.fillStyle = color;
    }

    set strokeColor(color) {
        this.ctx.strokeStyle = color;
    }
}