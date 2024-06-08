const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    tarefa: String,
    stts: String,
    objetivo: String,
})

const TaskModel = mongoose.model('tasks', TaskSchema)

module.exports = TaskModel;