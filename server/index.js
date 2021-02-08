const express = require('express');
const app = express()
const WSServer = require('express-ws')(app)
const aWss = WSServer.getWss()
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;

// middleware
app.use(cors())
// парсинг json формата
app.use(express.json())

app.ws('/', (ws, req) => {
    console.log('ПОДКЛЮЧЕНИЕ установлено');
    ws.send('Ты успешно подключился')
    ws.on('message', (msg) => {
        msg = JSON.parse(msg)
        switch(msg.method) {
            case 'connection' :
                connectionHandler(ws, msg)
                break;
            case 'draw' :
                broadcastConnection(ws, msg)
                break;
        }
    })
})


// сохранение изображения на сервере
app.post('/image', (req, res) => {
    try {
        const data = req.body.img.replace('data:image/png;base64,', '')
        // TODO переделать в ф-ии mouseUpHandler
        // сохраниение рисунка в папку files в формате base64
        fs.writeFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`), data, 'base64')
        return res.status(200).json({message: 'Загружено'})
    } catch(e) {
        console.log(e);
        return res.status(500).json()
    }
})
// отдача изображения 
app.get('/image', (req, res) => {
    try {
        const file = fs.readFileSync(path.resolve(__dirname, 'files', `${req.query.id}.jpg`))
        const data = `data:image/png;base64,` + file.toString('base64')
        res.json(data)
    } catch (e) {
        console.log(e)
        return res.status(500).json('error')
    }
})


app.listen(PORT, () => console.log(`server runned on port ${5000}`))

const connectionHandler = (ws, msg) => {
    // id сессии, в которой пользователь находится
    ws.id = msg.id;
    // уведомление всех остальных пользователей о подключении нового пользователя
    broadcastConnection(ws, msg);
}

const broadcastConnection = (ws, msg) => {
    aWss.clients.forEach(client => {
        if (client.id === msg.id) {
            client.send(JSON.stringify(msg))
        }
    })
}

