
//Declaramos las librerias necesarias
// y creamos el servidor

const express = require ('express');
const app = express ();
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'super_clave_mega_segura'; //En realidad, esta contraseña no va aqui, va en un archivo oculto. Pero lo hago asi por ser una ismulacion

function autenticarToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Esperamos el "Bearer TOKEN"

    if (!token) return res.status(401).json({ error: 'Token no proporcionado' }); //Mandamos un codigo de error si no existiese el token
    
    jwt.verify(token, SECRET_KEY, (err, usuario) => {
        if (err) return res.status(403).json({ error: 'Token inválido o expirado' }); //Si devolviese un error lo mostramos por pantalla

        req.usuario = usuario; // lo agregamos al request para su uso posterior
        next(); // continúa a la ruta protegida
    });
}

app.use(express.json()); // Lo necesitariamos para poder recibir datos en formato JSON desde el body



//Creamos la lista de tareas en memoria, inicialmente vacia. 

let tasks = [];
let contadorDeId = 1; // Inicializamos el contador de id en 1


// Hacemos un login para poder simular el envio del token
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Autenticamos con un usuario y clave fijos
    if (username === 'admin' && password === '1234') {
        // Creamos un token JWT con duración de 1 hora
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ token });
    } else {
        res.status(401).json({ error: 'Credenciales inválidas' });
    }
});




app.get('/tasks',autenticarToken, (req, res) => {
    // Obtenemos page y limit desde query params y los convertimos a número
    let page = parseInt(req.query.page) || 1; // por defecto, página 1
    let limit = parseInt(req.query.limit) || 10; // por defecto, 10 tareas por página

    // Calculamos el índice de inicio y fin
    const startIndex = (page - 1) * limit; //Hacemos dos calculos para poder indicar los indexes donde trabajaremos
    const endIndex = startIndex + limit;

    // Extraemos la "página" de tareas
    const paginatedTasks = tasks.slice(startIndex, endIndex); //Recuperamos los task que buscamos y los agregamos a una variable

    // Enviamos los datos junto con informacion util, pagina, limites, cantidad de tasks, paginas y los task referidos
    res.json({
        page,
        limit,
        totalTasks: tasks.length,
        totalPages: Math.ceil(tasks.length / limit),
        tasks: paginatedTasks
    });
});



//Obtengamos las tareas por su id

app.get('/tasks/:id', (req, res) => {
    // Obtenemos el id de la tarea desde los parámetros de la URL
    const taskId = parseInt(req.params.id); // Convertimos el id a un número entero
    // Buscamos la tarea en la lista por su id
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        // Si la tarea existe, la enviamos al cliente
        res.json(task);
    } else {
        // Si no existe, enviamos un error 404
        res.status(404).json({ error: 'No logre encontrar la tarea indicada.' });
    }
});


//Creamos la tarea

app.post('/tasks', (req, res) => {
    // Obtenemos los datos de la tarea desde el cuerpo de la solicitud
    const {title} = req.body;
    // Verificamos si el título está presente
    if (!title) {
        // Si no está presente, enviamos un error 400 (Bad Request)
        return res.status(400).json({ error: 'El título es obligatorio.' });
    }
    // Creamos un nuevo objeto de tarea con un id único
    const newTask = { id: contadorDeId++, title, completed: false };
    // Agregamos la nueva tarea a la lista de tareas
    tasks.push(newTask);
    // Enviamos la nueva tarea al cliente con un código de estado 201 (Creado)
    res.status(201).json(newTask);
});


//Actualizamos una tarea existente por su id 

app.put('/tasks/:id', (req, res) => {
    // Obtenemos el id de la tarea desde los parámetros de la URL
    const taskId = parseInt(req.params.id); // Convertimos el id a un número entero
    // Buscamos la tarea en la lista por su id
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
        // Si no existe, enviamos un error 404
        return res.status(404).json({ error: 'No logre encontrar la tarea indicada.' });
    }
    // Actualizamos los datos de la tarea con los nuevos datos del cuerpo de la solicitud
    const { title, completed } = req.body;
    // if (title !== undefined) task.title = title; // Actualizamos el título si se proporciona. Pensando en la posibilidad de que no se proporcione. // OBSOLETO. REQUERIDO TITULO EN PUNTO 3
    if (!title) {
        // Si no está presente, enviamos un error 400 (Bad Request)
        return res.status(400).json({ error: 'El título es obligatorio.' });
    }
    if (completed !== undefined) task.completed = completed; // Actualizamos el estado si se proporciona
    // Enviamos la tarea actualizada al cliente
    res.json(task);
});


//Eliminamos una tarea existente por su id

app.delete('/tasks/:id', (req, res) => {
    // Obtenemos el id de la tarea desde los parámetros de la URL
    const taskId = parseInt(req.params.id); // Convertimos el id a un número entero
    // Buscamos el índice de la tarea en la lista por su id
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) { //Por que -1? porque findIndex devuelve -1 si no encuentra el elemento
        // Si no existe, enviamos un error 404
        return res.status(404).json({ error: 'No logre encontrar la tarea indicada.' });
    }
    // Eliminamos la tarea de la lista
    tasks.splice(taskIndex, 1); // Elimina 1 elemento en la posición taskIndex
    // Enviamos una respuesta vacía con un código de estado 204 (Sin contenido)
    res.status(204).send();
});
//b

// Iniciar servidor
app.listen(3000, () => {
    console.log('API de To-Do List escuchando en http://localhost:3000');
  });