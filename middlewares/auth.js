///middleware de autenticação utilizado para barrar as áreas logadas das deslogadas das aplicações. 

const jwt = require('jsonwebtoken');

const auth = async (request, response, next) => {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
        return response.status(401).json({ mensagem: "Token é obrigatório!" });
    }

    const [, token] = authHeader.split(" ");

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        request.user = decoded; // Adiciona o payload decodificado ao objeto de solicitação para que ele esteja disponível nas rotas protegidas
        next();
    } catch (err) {
        return response.status(401).json({ mensagem: "Token é inválido!" });
    }
};

module.exports = auth;
