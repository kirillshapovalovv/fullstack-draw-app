import Tool from './Tool'

export default class Circle extends Tool {
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
                type: 'circle',
                x: this.startX,
                y: this.startY,
                r: this.r,
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
            let width = currentX - this.startX;
            let height = currentY - this.startY;
            this.r = Math.sqrt(width**2 + height**2);

            this.draw(this.startX, this.startY, this.r)
        }
    }

    draw(x, y, r) {
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
            this.ctx.arc(x, y, r, 0, 2*Math.PI)
            // заливка цветом
            this.ctx.fill()
            // обводка
            this.ctx.stroke()
        }
    }

    static staticDraw(ctx, x, y, r, color, lWidth, strokeColor) {
        ctx.fillStyle = color;
        ctx.lineWidth = lWidth;
        ctx.strokeStyle = strokeColor;
        ctx.beginPath();
        // рисование прямоугольника
        ctx.arc(x, y, r, 0, 2*Math.PI)
        // заливка цветом
        ctx.fill()
        // обводка
        ctx.stroke()
    }
}