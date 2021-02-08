import React, { useEffect, useRef, useState } from 'react' 
import  {Modal, Button} from "react-bootstrap";
import { observer } from 'mobx-react-lite';
import{useParams} from 'react-router-dom'
import axios from 'axios'

import { canvasState, toolState } from '../store/'
import {Brush, Rect, Circle, Eraser, Line} from '../tools/'

import '../styles/canvas.scss'



const Canvas = observer(() => {

    const canvasRef = useRef()
    const usernameRef = useRef()

    const [ modal, setModal ] = useState(true);

    const params = useParams();

    useEffect(() => {
        canvasState.setCanvas(canvasRef.current)
        let ctx = canvasRef.current.getContext('2d')
        axios.get(`http://localhost:5000/image?id=${params.id}`)
            .then(response => {
                const img = new Image()
                img.src = response.data
                img.onload = () => {
                    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
                    ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height)
                }
            })
    }, [])

    // создание сокета каждого пользователя
    useEffect(() => {
        if(canvasState.username) {
            const socket = new WebSocket('ws://localhost:5000/')

            canvasState.setSocket(socket)
            canvasState.setSessionId(params.id)

            // дефолтный инструмент
            toolState.setTool(new Brush(canvasRef.current, socket, params.id))

            socket.onopen = () => {
                console.log('Подлючение установлено');
                socket.send(JSON.stringify({
                    id: params.id,
                    username: canvasState.username,
                    method: 'connection'
                }))
            }

            // при подключении нового пользователя
            socket.onmessage = (e) => {
                let msg = JSON.parse(e.data)
                switch(msg.method) {
                    case 'connection':
                        console.log(`Пользователь ${msg.username} присоединился. Урааа`);
                        break;
                    case 'draw':
                        drawHandler(msg)
                        break;
                }
            }
        }
    }, [canvasState.username])

    const drawHandler = (msg) => {
        const figure = msg.figure;
        const ctx = canvasRef.current.getContext('2d');
        switch(figure.type) {
            case 'brush':
                Brush.staticDraw(ctx, figure.x, figure.y, figure.color, figure.lWidth, figure.strokeColor)
                break
            case 'eraser':
                Eraser.draw(ctx, figure.x, figure.y)
                break
            case 'rect':
                Rect.staticDraw(ctx, figure.x, figure.y, figure.width, figure.height, figure.color, figure.lWidth, figure.strokeColor)
                break
            case 'line':
                Line.staticDraw(ctx, figure.x, figure.y, figure.currentX, figure.currentY, figure.color, figure.lWidth, figure.strokeColor)
                break
            case 'circle':
                Circle.staticDraw(ctx, figure.x, figure.y, figure.r, figure.color, figure.lWidth, figure.strokeColor)
                break
            case 'finish':
                // начало нового пути рисования
                ctx.beginPath()
                break
        }
    }
    

    const onMouseDownHandler = () => {
        canvasState.pushToUndo(canvasRef.current.toDataURL())
        axios.post(`http://localhost:5000/image?id=${params.id}`, {img: canvasRef.current.toDataURL()})
            .then(response => console.log(response.data))
    }

    const connectHandler = () => {
        setModal(prev => !prev)
        canvasState.setUsername(usernameRef.current.value)
    }

    return (
        <div className="canvas">
            <Modal show={modal} onHide={() => {}}>
                <Modal.Header>
                    <Modal.Title>Введите ваше имя</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input type="text" ref={usernameRef} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={connectHandler}>
                        Войти
                    </Button>
                </Modal.Footer>
            </Modal>
            <canvas onMouseDown={onMouseDownHandler} ref={canvasRef} width={600} height={400} />
        </div>  
    )
})

export default Canvas
