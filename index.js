require('dotenv').config()

const mongoose = require('mongoose')
const express = require('express')

const userController = require('./controllers/auth/usersController')
const loginController = require('./controllers/loginController')
const tasksController = require('./controllers/tasksController')
const server = express()

const port = process.env.PORT
const DATABASE_NAME = process.env.DATABASE_NAME
const DATABASE_USER = process.env.DATABASE_USER
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD

const DATABASE_URL = `mongodb+srv://${DATABASE_USER}:${DATABASE_PASSWORD}@cluster-teste.7iupnvi.mongodb.net/${DATABASE_NAME}?retryWrites=true&w=majority&appName=Cluster-teste`

server.use(express.json())
server.use("/users", userController)
server.use("/login", loginController)
server.put("/users", userController)
server.get("/users", userController) 
server.put("/users/:nome", userController)
server.post("/users/new", userController)
server.delete("/users/:email", userController)
server.use("/tasks", tasksController) 


mongoose.connect(DATABASE_URL)
.then( () => {
    console.log("Database connected with success")

    server.listen(port, () => {
        console.log(`Server listening on ${port}`)
    })
})
.catch(err => {
    console.log(`Error while connecting to database: ${err}`)
})



