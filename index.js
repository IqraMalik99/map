import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http'
import { Server } from 'socket.io';
import { Socket } from 'dgram';
import { log } from 'console';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res, next) => {
    res.render("index.ejs");
})

io.on("connection", (socket) => {
    console.log("user connected with id", socket.id);
    socket.on('client-message', (data) => {
        io.emit('server-message',{ id : socket.id , ...data});
    })
    socket.emit("user-disconnection",socket.id)
})

server.listen(3000, () => {
    console.log(`Server is running on port 3000 `);

})