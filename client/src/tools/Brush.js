import Tool from './Tool'

export default class Brush extends Tool {
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
                type: 'finish'
            }
        }))
    }

    // нажатие на мышку
    mouseDownHandler(e) {
        this.mouseDown = true;
        // начало рисования новой линии
        this.ctx.beginPath();
        // перемещение курсора
        this.ctx.moveTo(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
    }

    // движение мышки
    mouseMoveHandler(e) {
        // если мышка нажата
        if(this.mouseDown) {
            // this.draw(e.pageX - e.target.offsetLeft, e.pageY - e.target.offsetTop)
            this.socket.send(JSON.stringify({
                method: 'draw',
                id: this.id,
                figure: {
                    type: 'brush',
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                    color: this.ctx.fillStyle,
                    lWidth: this.ctx.lineWidth,
                    strokeColor: this.ctx.strokeStyle,
                }
            }))
            this.socket.send(JSON.stringify({
                method: 'draw',
                id: this.id,
                figure: {
                    type: 'eraser',
                    x: e.pageX - e.target.offsetLeft,
                    y: e.pageY - e.target.offsetTop,
                }
            }))
        }
    }

    static draw(ctx, x, y, color, lWidth, strokeColor) {
        ctx.fillStyle = color;
        ctx.lineWidth = lWidth;
        ctx.strokeStyle = strokeColor;
        // рисование линии по полученным координатам
        ctx.lineTo(x, y);
        // цвет линии
        ctx.stroke();
    }
}