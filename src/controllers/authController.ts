import { FastifyRequest, FastifyReply } from "fastify"
import { recoveryPassword, signin, validateRecoveryToken } from "../models/authModel"
import { UserController } from "../controllers/userController"

export async function signIn(request: FastifyRequest, reply: FastifyReply) {
    return await signin(request, reply)
}

export async function recovery(request: FastifyRequest, reply: FastifyReply, email: string) {
    return await recoveryPassword(request, reply, email)
}

export async function validatedRecovery(request: FastifyRequest, reply: FastifyReply, token: string) {
    return await validateRecoveryToken(request, reply, token)
}

export async function validateToken(request: FastifyRequest, reply: FastifyReply) {
    const userController = new UserController()
    const { token, id } = request.body as { token: string, id: string }
    try {
        await request.jwtVerify()
        return reply.send({ valid: true })
    } catch (err) {
        return reply.status(401).send({ valid: false })
    }
}
