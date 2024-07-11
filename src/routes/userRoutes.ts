import { FastifyInstance } from "fastify";
import { UserController } from "../controllers/userController";


const userController = new UserController();


export default async function userRoutes(app: FastifyInstance){
    app.get('/', userController.getAllUsers.bind(userController))
    app.get('/:id', userController.getUserById.bind(userController))
    app.post('/new', userController.createUser.bind(userController));
    app.put('/update/:id', userController.updateUser.bind(userController))
    app.delete('/delete/:id', userController.deleteUser.bind(userController))
    app.put('/activateAccount/:userId/:token', userController.activateAccount.bind(userController))
}