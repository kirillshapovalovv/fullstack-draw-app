import Tool from './Tool'

export default class Rect extends Tool {
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
                type: 'rect',
                x: this.startX,
                y: this.startY,
                width: this.width,
                height: this.height,
                color: this.ctx.fillStyle,
                lWidth: this.ctx.lineWidth,
                strokeColor: this.ctx.strokeStyle,
            }
        }))
    }

    // нажатие на мышку
    mouseDownHandler(e) {
        this.mouseDown = true;
        // начало рисования новой линии
        this.ctx.beginPath();
        this.startX = e.pageX - e.target.offsetLeft;
        this.startY = e.pageY - e.target.offsetTop;
        // сохранение нарисованной фигуры с канваса
        this.saved = this.canvas.toDataURL()
    }

    // движение мышки
    mouseMoveHandler(e) {
        // если мышка нажата
        if(this.mouseDown) {
            let currentX = e.pageX - e.target.offsetLeft;
            let currentY = e.pageY - e.target.offsetTop;
            this.width = currentX - this.startX;
            this.height = currentY - this.startY;

            this.draw(this.startX, this.startY, this.width, this.height);
        }
    }

    draw(x, y, width, height) {
        const img = new Image();
        img.src = this.saved
        // при загрузке изображения
        img.onload = () => {
            // очищение квадрата
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            // возвращение старого рисунка
            this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            this.ctx.beginPath();
            // рисование прямоугольника
            this.ctx.rect(x, y, width, height)
            // заливка цветом
            this.ctx.fill()
            // обводка
            this.ctx.stroke()
        }
    }

    static staticDraw(ctx, x, y, width, height, color, lWidth, strokeColor) {
        ctx.fillStyle = color;
        ctx.lineWidth = lWidth;
        ctx.strokeStyle = strokeColor;
        ctx.beginPath();
        // рисование прямоугольника
        ctx.rect(x, y, width, height)
        // заливка цветом
        ctx.fill()
        // обводка
        ctx.stroke()
    }
}