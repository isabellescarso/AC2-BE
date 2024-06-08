const mongoose = require('mongoose')

const TaskSchema = new mongoose.Schema({
    tarefa: String,
    stts: String,
    objetivo: String,
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
})

const TaskModel = mongoose.model('tasks', TaskSchema)

module.exports = TaskModel;