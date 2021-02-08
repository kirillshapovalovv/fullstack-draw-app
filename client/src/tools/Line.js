import Tool from './Tool'

export default class Line extends Tool {
    constructor(canvas, socket, id) {
        // вызов конструктора родительского класса
        super(canvas, socket, id);
        this.listen();
    }

    // добавление слушателей события на canvas
    listen() {
        this.canvas.onmousemove = this.mouseMoveHandler.bind(this)
        this.canvas.onmousedown = this.mouseDownHandler.bind(this)
        this.canvas.onmouseup = this.mouseUpHandler.bind(this)
    }


    // отпускание мышки
    mouseUpHandler(e) {
        this.mouseDown = false;
        this.socket.send(JSON.stringify({
            method: 'draw',
            id: this.id,
            figure: {
                type: 'line',
                x: this.x,
                y: this.y,
                currentX: this.currentX,
                currentY: this.currentY,
                color: this.ctx.fillStyle,
                lWidth: this.ctx.lineWidth,
                strokeColor: this.ctx.strokeStyle,
            }
        }))
    }

    // нажатие на мышку
    mouseDownHandler(e) {
        this.mouseDown = true;
        this.currentX = e.pageX - e.target.offsetLeft;
        this.currentY = e.pageY - e.target.offsetTop;
        // начало рисования новой линии
        this.ctx.beginPath();
        this.ctx.moveTo(this.currentX, this.currentY)
        // сохранение нарисованной фигуры с канваса
        this.saved = this.canvas.toDataURL()
    }

    // движение мышки
    mouseMoveHandler(e) {
        // если мышка нажата
        if(this.mouseDown) {
            this.x = e.pageX - e.target.offsetLeft;
            this.y = e.pageY - e.target.offsetTop;
            this.draw(this.x, this.y);
        }
    }

    draw(x, y) {
        const img = new Image();
        img.src = this.saved
        // при загрузке изображения
        img.onload = async () => {
            // очищение квадрата
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            // возвращение старого рисунка
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath();
            this.ctx.moveTo(this.currentX, this.currentY)
            // рисование линии по полученным координатам
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        }
    }

    static staticDraw(ctx, x, y, currentX, currentY, color, lWidth, strokeColor) {
        ctx.strokeStyle = strokeColor;
        ctx.fillStyle = color;
        ctx.lineWidth = lWidth;
        ctx.beginPath();
        ctx.moveTo(currentX, currentY)
        // рисование линии по полученным координатам
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}