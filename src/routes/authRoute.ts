import { FastifyInstance } from "fastify"
import { recovery, resetPassword, signIn, validateToken, validatedRecovery } from "../controllers/authController"

export default async function userRoutes(app: FastifyInstance) {
    app.post('/signin', (request, reply) => {
        return signIn(request, reply)
    })

    app.get('/recovery/:email', (request, reply) => {
        const { email } = request.params as { email: string }
        return recovery(request, reply, email)
    })

    app.get('/validatedRecoveryPassword/:token', (request, reply) => {
        const { token } = request.params as { token: string }
        return validatedRecovery(request, reply, token)
    })
    
    app.post('/token-validate', (request, reply) => {
        return validateToken(request, reply)
    })

    app.post('/reset-password', (request, reply) => {
        return resetPassword(request, reply);
    });
}
