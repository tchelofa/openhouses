import { FastifyReply, FastifyRequest } from "fastify"
import prisma from '../lib/prismaConfig';

export async function uploadPropertyImages(propertyId: string, imgName:string, reply: FastifyReply){

    const newUrl = `/properties/images/${imgName}`

    try {
        const images = await prisma.propertyImgs.create({
            data:{
                url:newUrl,
                propertyId
            }
        })
        return images.url
    } catch (error) {
        if(error instanceof Error){
            reply.send({
                message: "Error"
            }).status(400)
        }
    }
}