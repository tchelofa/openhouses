import { FastifyReply, FastifyRequest } from "fastify"
import { z } from "zod"
import prisma from '../lib/prismaConfig';
import bcrypt, { hash } from 'bcrypt'
// import { recoveryEmail } from '../helpers/emails/emails'
import { v4 as uuidv4 } from 'uuid';
// import sendEmail from "../helpers/emails/config"

const signInSchema = z.object({
    email: z.string(),
    emailV:z.string(),
    password: z.string()
})

const logSchema = z.object({
    type: z.enum(['LOGIN', 'RECOVERY', 'CHANGEPASSWORD']).default("LOGIN"),
    originIp: z.string(),
    status: z.enum(['SUCCESS', 'DENY']).default("SUCCESS"),
    userId: z.string()
})

export async function signin(request: FastifyRequest, reply: FastifyReply) {

    const { email, password } = signInSchema.parse(request.body)
    const emailV = email.toLowerCase()
    try {

        const user = await prisma.user.findFirst({
            where: {
                email:emailV
            }
        })

        

        if (user) {

            const hashPassword = await bcrypt.compare(password, user.password)

            if (hashPassword) {
                if(user?.accountStatus == "Inactivated"){
                    return reply.status(401).send({ message: "You need verify your account first." })
                }

                const token = await reply.jwtSign({
                    id: user.publicId
                })

                const log = await prisma.logsLogin.create({
                    data: {
                        ipAddress: '000000',
                        loginStatus: 'Accept',
                        userId: user.id

                    }

                })

                const data = {
                    token: token,
                    id: user.publicId
                }
                return data
            } else {
                const log = await prisma.logsLogin.create({
                    data: {
                        ipAddress: '000000',
                        loginStatus: 'Deny',
                        userId: user.id

                    }
                })

                return reply.status(401).send({ message: "Email or password invalid!" })
            }

        } else {

            return reply.status(401).send({ message: "Email or password invalid!" })
        }

    } catch (error) {
        if (error instanceof Error) {
            return reply.status(400).send({ message: error.message })
        }
    }

}

export async function recoveryPassword(request: FastifyRequest, reply: FastifyReply, email: string) {

    const token = uuidv4()
    const data = new Date()
    data.setHours(data.getHours() + 2)

    try {

        const user = await prisma.user.findFirst({
            where: {
                email
            }
        })

        if (!user) {
            return reply.status(404).send({ message: 'User Not Found' })
        }

        const req = await prisma.verifyToken.create({
            data: {
                token,
                type: 'RESET',
                userId: user.id,
                expiration: data,
            }
        })

        // const html = recoveryEmail(token)

        // sendEmail('Wedo Assist', 'no-reply@wedoassist.com.br', user?.email, 'Password Recovery', html, html)

        // const log = await prisma.logsLogin.create({
        //     data: {
        //         originIp: '0000000',
        //         status: "SUCCESS",
        //         type: "RECOVERY",
        //         userId: user.id
        //     }
        // })

        return reply.status(200).send({ message: 'Check your email.' })
    } catch (error) {
        if (error instanceof Error) {
            return reply.status(400).send({ message: error.message })
        }
    }
}

export async function validateRecoveryToken(request: FastifyRequest, reply: FastifyReply, token: string) {
    try {
        const req = await prisma.verifyToken.findFirst({
            where: {
                token
            }
        })

        if (!req) {
            return reply.status(404).send({ message: 'Invalid Token' })
        }else{
            if(req.isUsed == true){
                return reply.status(400).send({ message: 'Invalid Token' })
            }
        }
        const validated = {
            "id": req.userId,
            "token": token
        }

        const updateToken = await prisma.verifyToken.update({
            where:{
                token
            },
            data:{
                isUsed: true
            }
        })

        return reply.status(200).send(validated)

    } catch (error) {
        if (error instanceof Error) {
            return reply.status(400).send({ message: error.message })
        }
    }
}
