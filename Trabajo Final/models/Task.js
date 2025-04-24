//Declaramos mongoose y lo agregamos a una constante
const mongoose = require('mongoose');


//Creamos el esquema de la base de datos

const taskSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    dateCreated: {type: Date, default: Date.now},
    deadLine : Date,
    status: {type:Boolean, default: false }});

module.exports = mongoose.model('Task', taskSchema);
//Exportamos el modelo de la base de datos para poder usarlo en otras partes del proyecto


