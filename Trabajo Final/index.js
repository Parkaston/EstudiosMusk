// Importamos express y mongoose, para crear el servidor y tener un buen control de la base de datos
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');

// Importamos las rutas que definimos para tareas desde el archivo routes/tasks.js
const tasksRoutes = require('./routes/tasks');

// Creamos la instancia de la aplicación Express
const app = express();

// Definimos el puerto en el que va a correr nuestro servidor
const PORT = 3000;

// Middleware que necesitamos para poder parsear JSON en el body de las peticiones
app.use(express.json());

// Conectamos a la base de datos MongoDB que corre en local en el puerto 27017
// La base de datos se llamará 'tareas'. Si no existe, MongoDB la crea automáticamente, lo que nos ahorra tener que crearla manualmente desde MongoDB Compass
mongoose.connect('mongodb://localhost:27017/tareas', {
    useNewUrlParser: true,       
    useUnifiedTopology: true      
  })
  // Si nos conectamos satisfactoriamente, mostramos un mensaje en la consola
  .then(() => console.log('Conectado a MongoDB'))
  
  // Si ocurre un error al conectar, lo mostramos en consola, para poder depurarlo y solucionarlo
  .catch(err => console.error('Error conectando a MongoDB', err));


  // Middleware que aplica las rutas que están en tasksRoutes a cualquier ruta que empiece por /tasks
app.use('/tasks', tasksRoutes);
app.use('/auth', authRoutes);


// Iniciamos el servidor en el puerto definido y mostramos un mensaje indicando que está funcionando
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });