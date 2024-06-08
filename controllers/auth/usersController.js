const bcrypt = require('bcryptjs')
const express = require('express')
const UserModel = require('../../models/user')
const userController = express.Router()
const auth = require('../../middlewares/auth')

// Rota para obter um usuário pelo email
userController.get("/:email", auth, async(req, res) => {
    const email = req.params.email
    const user = await UserModel.findOne({email: email})
    if(!user){
        return res.status(404).json({mensagem: "Usuário não encontrado!"})
    }
    return res.status(200).json(user)
})

// Rota para criar um novo usuário
userController.post("/new", async (req, res) => {
    const { nome, email, senha, funcao } = req.body
    try {
        // Verificar se o usuário já existe com o mesmo email
        const existingUser = await UserModel.findOne({ email: email })
        if (existingUser) {
            return res.status(400).json({ mensagem: "Este email já está sendo utilizado por outro usuário!" })
        }

        // Criptografar a senha antes de salvar no banco de dados
        const senhaEncrypt = await bcrypt.hash(senha, 10)

        // Criar o novo usuário
        const newUser = await UserModel.create({
            nome: nome,
            email: email,
            senha: senhaEncrypt,
            funcao: funcao
        })

        return res.status(201).json(newUser)
    } catch (err) {
        return res.status(500).json({ error: "Erro ao criar um novo usuário!" })
    }
})

// Rota para editar um usuário específico
userController.put("/update/:email", auth, async (req, res) => {
    const email = req.params.email
    const { nome, senha } = req.body
    try {
        const user = await UserModel.findOne({ email: email })
        if (!user) {
            return res.status(404).json({ mensagem: "Usuário não encontrado!" })
        }

        user.nome = nome || user.nome
        if (senha) {
            user.senha = await bcrypt.hash(senha, 10)
        }

        await user.save()
        return res.status(200).json(user)
    } catch (err) {
        return res.status(500).json({ error: "Erro ao atualizar usuário!" })
    }
})

// Rota para listar todos os usuários cadastrados, sem autenticação JWT
userController.get("/", auth, async (req, res) => {
    try {
        const users = await UserModel.find({})
        if (!users || users.length === 0) {
            return res.status(404).json({ mensagem: "Nenhum usuário cadastrado encontrado!" })
        }
        return res.status(200).json(users)
    } catch (err) {
        return res.status(500).json({ error: "Erro ao buscar usuários cadastrados!" })
    }
})


userController.delete("/:email", auth, async (req, res) => {
    const email = req.params.email;
    try {
        const user = await UserModel.findOneAndDelete({ email: email });
        if (!user) {
            return res.status(404).json({ mensagem: "Usuário não encontrado!" });
        }
        return res.status(200).json({ mensagem: "Usuário excluído com sucesso!" });
    } catch (err) {
        return res.status(500).json({ mensagem: "Erro ao excluir usuário!" });
    }
});


module.exports = userController
