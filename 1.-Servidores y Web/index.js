// Primero hacemos el init por PowerShell, luego instalamos express via NPM install

//Importamos express
const express = require('express');
// Importamos el módulo fs para trabajar con el sistema de archivos
const fs = require('fs');

// Creamos una aplicación express
const app = express();


// Middleware que registra la fecha y hora de cada solicitud en un archivo de texto
app.use((req, res, next) => {
    const now = new Date().toISOString();


    //Recuperamos la fecha y hora actual en formato ISO, el metodo y la URL de la solicitud y
    //los guardamos en un string para luego escribirlo en el archivo de texto
    const log = `[${now}] ${req.method} ${req.url}\n`;
  
    fs.appendFile('logs.txt', log, (err) => {
      if (err) {
        console.error('Error al guardar log:', err);
      }
    });
  
    next();
  });

// Importamos el módulo path para trabajar con rutas de archivos
app.use(express.static('public'));


// Definimos la ruta GET en la raíz "/"
app.get('/', (req, res) => {
  res.send('Hola Mundo');
});
app.get('/about', (req, res) => {
    res.send('GET /about: Recuperamos información de Acerca de');
  });
  
  app.post('/about', (req, res) => {
    res.send('POST /about: Creacion de sección Acerca de');
  });
  
  app.put('/about', (req, res) => {
    res.send('PUT /about: Actualizamos la seccion Acerca de');
  });
  
  app.delete('/about', (req, res) => {
    res.send('DELETE /about: Eliminariamos la  sección Acerca de');
  });
  
  // Rutas /contact con diferentes métodos
  app.get('/contact', (req, res) => {
    res.send('GET /contact: Recuperamos información de contacto');
  });
  
  app.post('/contact', (req, res) => {
    res.send('POST /contact: Enviamos un  formulario de contacto');
  });
  
  app.put('/contact', (req, res) => {
    res.send('PUT /contact: Actualizariamos datos de contacto');
  });
  
  app.delete('/contact', (req, res) => {
    res.send('DELETE /contact: Borrariamos la información de contacto');
  });



  //Recuperamos el nombre del user y lo mostramos en la ruta /user/:name
  app.get('/user/:name', (req, res) => {
  const name = req.params.name;
  res.send(`Hola ${name}, bienvenido a la sección de usuario.`);
  });



// Abrimos el listen en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor escuchando en http://localhost:3000');
});