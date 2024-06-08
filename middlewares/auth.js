///middleware de autenticação utilizado para barrar as áreas logadas das deslogadas das aplicações. 

const jwt = require('jsonwebtoken')
const auth = async(request, response, next) => {
    const authHeader = request.headers.authorization;
    if(!authHeader){
        return response.status(401).json({ mensagem: "Token é obrigatório!"})
    }

    const [,token] = authHeader.split(" ")

    try {
        const senha = process.env.JWT_SECRET
        await jwt.verify(token, senha) ///é necessário utilizar await pq o verify demora um tempo
        next()
    }catch(err){
        return response.status(401).json({mensagem: "Token é inválido!"})
    }
}

module.exports = auth