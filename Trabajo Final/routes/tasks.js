// Agregamos express y el router
const express = require ('express');
const router = express.Router();
const Task = require('../models/Task');
const verifyToken = require('../middleware/auth');


//Get de tasks, donde devolvemos la totalidad de las tareas de la base de datos
router.get('/', async (req,res) => {
const tasks = await Task.find();
res.json (tasks);
});



// Ruta para obtener una tarea por su ID 
router.get('/:id', async (req, res) => {
    try {
      // Buscamos la tarea usando el ID recibido en la URL
      const task = await Task.findById(req.params.id);
  
      // Si no se encuentra, devolvemos un error 404
      if (!task) return res.status(404).json({ message: 'Tarea no encontrada' });
  
      // Si se encuentra, la devolvemos como JSON
      res.json(task);
    } catch (error) {
      // Si ocurriese un error, lo capturamos y devolveos junto a un codigo de error 400
      res.status(400).json({ error: error.message });
    }
  });

  // Ruta para crear una nueva tarea, finalmente le agregue el sistema de verificacion de token para que solo los usuarios logueados puedan crear tareas
router.post('/',verifyToken, async (req, res) => {
    try {
      // Creamos una nueva instancia del modelo Task con los datos del cuerpo recueperados del  request
      const newTask = new Task(req.body);
      // Guardamos la tarea en la base de datos
      const savedTask = await newTask.save();
      // Devolvemos la tarea guardada con un status 201
      res.status(201).json(savedTask);
    } catch (error) {
      // En caso de error, lo devolvemos en un error 400
      res.status(400).json({ error: error.message });
    }
  });
  
  // Ruta para actualizar una tarea via ID 
router.put('/:id', async (req, res) => {
    try {
      // Buscamos la tarea por ID y la actualizamos con los datos del request
      const updatedTask = await Task.findByIdAndUpdate(
        req.params.id,  // ID de la tarea a actualizar
        req.body,       // Nuevos datos (nuevos datos del request)
        { new: true }   // Esta opción hace que se devuelva el nuevo documento actualizado
      );
      // Si no encontramos la tarea, devolvemos error 404 junto a un pequeño mensaje  de "Tarea no encontrada"
      if (!updatedTask) return res.status(404).json({ message: 'Tarea no encontrada' });
      // Devolvemos la tarea actualizada
      res.json(updatedTask);
    } catch (error) {
      // Si ocurre algún error, lo capturamos y enviamos un error 400 junto al mensaje
      res.status(400).json({ error: error.message });
    }
  });

  // Ruta para eliminar una tarea por ID 
router.delete('/:id', async (req, res) => {
    try {
      // Buscamos y eliminamos la tarea por su ID
      const deletedTask = await Task.findByIdAndDelete(req.params.id);
      // Si no se encuentra la tarea, devolvemos error 404
      if (!deletedTask) return res.status(404).json({ message: 'Tarea no encontrada' });
      // Confirmamos que la tarea fue eliminada
      res.json({ message: 'Tarea eliminada' });
    } catch (error) {
      // En caso de error, lo capturamos
      res.status(400).json({ error: error.message });
    }
  });


  module.exports = router;