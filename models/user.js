const mongoose = require('mongoose')

const UserModel = mongoose.model('users', {
    nome: String,
    senha: String,
    email: String,
    funcao: String
})

module.exports = UserModel;