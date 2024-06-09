const express = require('express')
const TaskModel = require('../models/tasks')
const UserModel = require('../models/user')
const auth = require('../middlewares/auth')
const tasksController = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt= require('bcryptjs')

//rota para criar uma tarefa 
tasksController.post("/new", auth, async (req, res) => {
    const { tarefa, stts, objetivo } = req.body
    try {
        const user = await UserModel.findById(req.user.id); 
        const newTask = await TaskModel.create({
            tarefa: tarefa,
            stts: stts,
            objetivo: objetivo,
            userId: user._id // Associa a tarefa ao usuário autenticado
        })

        return res.status(201).json(newTask)
    } catch (err) {
        return res.status(500).json({ error: "Erro ao criar tarefa, tente novamente!" })
    }
})

//rota para listar as tarefas do usuario
tasksController.get("/user/:userId", auth, async (req, res) => {
    const userId = req.params.userId;
    try {
        const tasks = await TaskModel.find({ userId: userId });
        return res.status(200).json(tasks);
    } catch (err) {
        return res.status(500).json({ error: "Erro ao listar tarefas do usuário!" });
    }
})

//rota para atualizar a tarefa
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


//rota para deletar a tarefa
tasksController.delete("/:tarefa", auth, async (req, res) => {
    const tarefa = req.params.tarefa;
    try {
        const task = await TaskModel.findOneAndDelete({ tarefa: tarefa });
        if (!task) {
            return res.status(404).json({ mensagem: "Tarefa não encontrada!" });
        }
        return res.status(200).json({ mensagem: "Tarefa excluída com sucesso!" });
    } catch (err) {
        return res.status(500).json({ mensagem: "Erro ao excluir tarefa!" });
    }
});

//atribuir um usuário a tarefa 
tasksController.put("/atribuir/:taskId/:userId", auth, async (req, res) => {
    const { taskId, userId } = req.params;
    try {
        const task = await TaskModel.findById(taskId);
        if (!task) {
            return res.status(404).json({ mensagem: "Tarefa não encontrada!" });
        }
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ mensagem: "Usuário não encontrado!" });
        }
        task.userId = user._id;
        await task.save();
        return res.status(200).json({ mensagem: "Usuário atribuído a tarefa com sucesso!", task });
    } catch (err) {
        return res.status(500).json({ error: "Não foi possível atribuir o usuário à tarefa!" });
    }
});

//retorna tarefas que não foram atribuídas a nenhum usuário
tasksController.get("/unassigned", auth, async (req, res) => {
    try {
        const tasks = await TaskModel.find({ userId: null });
        return res.status(200).json(tasks);
    } catch (err) {
        return res.status(500).json({ error: "Erro ao listar tarefas sem usuário!" });
    }
});



module.exports = tasksController;