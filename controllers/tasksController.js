const express = require('express')
const TaskModel = require('../models/tasks')
const UserModel = require('../models/user')
const auth = require('../middlewares/auth')
const tasksController = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt= require('bcryptjs')

//rota para criar uma tarefa - funcionando! 
tasksController.post("/new", async (req, res) => {

    const { tarefa, stts, objetivo } = req.body
    try {

        const newTask = await TaskModel.create({
            tarefa: tarefa,
            stts: stts,
            objetivo: objetivo,
        })

        return res.status(201).json(newTask)
    } catch (err) {
        return res.status(500).json({ error: "Erro ao criar tarefa, tente novamente!" })
    }
})

//atualizar tarefa
tasksController.put("/update/:id", auth, async (req, res) => {
    const taskId = req.params.id;
    const { tarefa, stts } = req.body;
    try {
        const task = await TaskModel.findById(taskId);
        if (!task) {
            return res.status(404).json({ mensagem: "Tarefa não encontrada!" });
        }


        if (tarefa) {
            task.tarefa = tarefa;
        }
        if (stts) {
            task.stts = stts;
        }
        await task.save();

        return res.status(200).json(task);
    } catch (err) {
        console.error("Erro ao atualizar tarefa:", err);
        return res.status(500).json({ error: "Erro ao atualizar tarefa!" });
    }
});


//deletar tarefa
tasksController.delete("/:tarefa", auth, async (req, res) => {
    const tarefa = req.params.tarefa;
    try {
        const task = await TaskModel.findOneAndDelete({ tarefa: tarefa });
        if (!task) {
            return res.status(404).json({ mensagem: "Tarefa não encontrada!" });
        }
        return res.status(200).json({ mensagem: "Tarefa excluída com sucesso!" });
    } catch (err) {
        console.error("Erro ao excluir tarefa:", err);
        return res.status(500).json({ mensagem: "Erro ao excluir tarefa!" });
    }
});


module.exports = tasksController;