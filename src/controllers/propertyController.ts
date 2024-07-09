import fastify, { FastifyRequest, FastifyReply } from "fastify";
import { deleteProperty, favoriteProperties, getImagesProperty, getProperties, getPropertiesFilter, getPropertyDetails, isFavorite, newProperty, toggleFavoriteProperty, toogleProperty, updateProperty } from "../models/propertyModel";
import { uploadPropertyImages } from "../services/uploadService";
export async function NewProperty(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.body as { userId: string }
    return await newProperty(userId, request, reply)
}

export async function GetPropertiesFilter(request: FastifyRequest, reply: FastifyReply) {
    return await getPropertiesFilter(request, reply);
}

export async function GetProperties(request: FastifyRequest, reply: FastifyReply) {
    return await getProperties(request, reply);
}

export async function UpdateProperty(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string }; // ID from params, not body
    return await updateProperty(id, request, reply);
}

export async function DeleteProperty(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string }; // ID from params, not body
    return await deleteProperty(id, request, reply);
}
export async function ToogleProperty(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string }; // ID from params, not body
    return await toogleProperty(id, request, reply);
}

export async function GetImagesProperty(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string }; // ID from params, not body
    return await getImagesProperty(id, request, reply);
}

export async function ToggleFavoriteProperty(request: FastifyRequest, reply: FastifyReply) {
    const { id, userId } = request.params as { id: string; userId: string }; // ID from params
    console.log("ID " + id)
    console.log("userid " + userId)
    try {
        const result = await toggleFavoriteProperty(id, userId, request, reply);
        reply.send(result);
    } catch (error) {
        reply.status(500).send({
            status: 'error',
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}

export async function FavoriteProperties(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = request.params as {  userId: string }; // ID from params
    console.log(userId)
    try {
        const result = await favoriteProperties(userId, request, reply);
        reply.send(result);
    } catch (error) {
        reply.status(500).send({
            status: 'error',
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}

export async function GetPropertyDetails(request: FastifyRequest, reply: FastifyReply){
    
    const { id } = request.params as {  id: string }; // ID from params
    try {
        const result = await getPropertyDetails(id, request, reply);
        reply.send(result);
    } catch (error) {
        reply.status(500).send({
            status: 'error',
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}

export async function IsFavorite(request: FastifyRequest, reply: FastifyReply){
    const { id, userId } = request.params as { id: string; userId: string };
    try {
        const result = await isFavorite(id,userId, request, reply);
        reply.send(result);
    } catch (error) {
        reply.status(500).send({
            status: 'error',
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}




export async function UploadPropertyImages(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string }; // ID da propriedade
    try {
        const result = await uploadPropertyImages(id, request, reply); // Chama função de serviço para upload
        reply.send(result);
    } catch (error) {
        reply.status(500).send({
            status: 'error',
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}