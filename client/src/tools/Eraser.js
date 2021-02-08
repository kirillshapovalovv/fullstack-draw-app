import {Brush} from './'

export default class Eraser extends Brush {
    constructor(canvas, socket, id) {
        // вызов конструктора родительского класса
        super(canvas, socket, id);
        this.listen();
    }
    

    static draw(ctx, x, y) {
        // цвет линии
        ctx.strokeStyle = "white";
        // рисование линии по полученным координатам
        ctx.lineTo(x, y);
        ctx.stroke();
    }
}