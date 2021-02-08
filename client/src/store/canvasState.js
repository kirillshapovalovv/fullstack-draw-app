import { makeAutoObservable } from 'mobx';

class CanvasState {
    canvas = null;
    undoList = [];
    redoList = [];
    username = "";
    socket = null;
    sessionId = null;

    constructor() {
        makeAutoObservable(this);
    }

    setUsername(username) {
        this.username = username;
    }

    setSessionId(id) {
        this.sessionId = id;
    }

    setSocket(socket) {
        this.socket = socket;
    }

    setCanvas(canvas) {
        this.canvas = canvas;
    }

    pushToUndo(data) {
        this.undoList.push(data)
    }

    pushToRedo(data) {
        this.redoList.push(data)
    }

    // возврат к предыдущему действию 
    undo() {
        let ctx = this.canvas.getContext('2d');
        if(this.undoList.length > 0) {
            // последнее действие (рисунок) пользователя
            let dataUrl = this.undoList.pop();
            // сохранение действие в массив redoList
            this.redoList.push(this.canvas.toDataURL())
            let img = new Image()
            img.src = dataUrl;
            img.onload = () => {
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            };

        } else {
            // очистка контекста и содержимого на рис
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        }
    }

    // переход к следующему действию 
    redo() {
        let ctx = this.canvas.getContext('2d');
        if(this.redoList.length > 0) {
            // последнее действие (рисунок) пользователя
            let dataUrl = this.redoList.pop();
            // сохранение текущего состояния канваса в массив undoList
            this.undoList.push(this.canvas.toDataURL())
            let img = new Image()
            img.src = dataUrl;
            img.onload = () => {
                ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height)
            };
        }
    }
}

export default new CanvasState();