const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Usamos un Middleware para parsear JSON
app.use(express.json());


// hacemos las referencias a los archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));



app.post('/api/tasks', (req, res) => {
    // Supongamos que la tarea viene en el body con un campo "title"
    const newTask = {
      id: Date.now(),  // Le creamos un id único basado en el timestamp
      title: req.body.title
    };
  
      // Emitimos el evento 'newTask' a todos los clientes conectados
    io.emit('newTask', newTask);
  
    // Devolvemos  la tarea creada
    res.status(201).json(newTask);
  });


// Configura Socket.IO para escuchar conexiones
io.on('connection', (socket) => {
  console.log('Nuevo usuario conectado:', socket.id); // Conexión de un nuevo cliente
  // Envía un mensaje de bienvenida al nuevo usuario


// Emitiremos la hora actual cada 10 segundos
setInterval(() => {
    const now = new Date().toLocaleTimeString();
    io.emit('time', now);
    console.log('Hora emitida:', now);
  }, 10000);


  // Escucha mensajes del usuario
  socket.on('chat message', (msg) => {
    console.log('Mensaje recibido:', msg);
    // Envía el mensaje a todos los clientes conectados
    io.emit('chat message', msg);
  });

  //  Configuramos el evento de desconexión
  // para eliminar el usuario de la lista de usuarios conectados
  socket.on('disconnect', () => {
    console.log('Usuario desconectado:', socket.id);
  });
});

// Inicia el servidor
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});