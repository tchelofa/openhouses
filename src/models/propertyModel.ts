import { Prisma } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { PropertySchema, PartialPropertySchema } from '../lib/ZodSchemas';
import prisma from '../lib/prismaConfig';


// CREATE
export async function newProperty(id: string, request: FastifyRequest, reply: FastifyReply) {
    try {
        const parseResult = PropertySchema.safeParse(request.body);


        if (!parseResult.success) {
            reply.status(400).send({
                status: 'error',
                message: 'Validation error',
                errors: parseResult.error.errors,
            });
            console.log(parseResult.error.errors)
            return;
        }

        const {
            title,
            description,
            address,
            neighborhood,
            city,
            county,
            country,
            postcode,
            price,
            propertyType,
            rooms,
            capacity,
            toilets,
            externalArea,
            electricityFee,
            wifiFee,
            rubbishFee,
            depositFee,
            timeRefundDeposit,
            availableAtInit,
            availableAtEnd,
            businessType
        } = parseResult.data;

        const AjavailableAtInit = new Date(availableAtInit).toISOString();
        const AjavailableAtEnd = new Date(availableAtEnd).toISOString();

        const newProperty = await prisma.property.create({
            data: {
                title,
                description,
                address,
                neighborhood,
                city,
                county,
                country,
                postcode,
                price,
                propertyType,
                rooms,
                capacity,
                toilets,
                externalArea,
                electricityFee,
                wifiFee,
                rubbishFee,
                depositFee,
                timeRefundDeposit,
                availableAtInit: AjavailableAtInit,
                availableAtEnd: AjavailableAtEnd,
                userId: id,
                active: true,
                businessType
            },
        });

        console.log(newProperty)
        return({newProperty})
    } catch (error) {
        return false
    }
}

export async function getProperties(request: FastifyRequest, reply: FastifyReply) {
    try {
        const { userId } = request.query as { userId?: string };

        const filters: Prisma.PropertyWhereInput = {};

        if (userId) {
            filters.userId = userId;
        }

        const properties = await prisma.property.findMany({
            where: filters,
        });

        reply.status(200).send({ properties });
    } catch (error) {
        reply.status(500).send({
            status: 'error',
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}

export async function getPropertiesFilter(request: FastifyRequest, reply: FastifyReply) {
    try {
        const filters: Prisma.PropertyWhereInput = {};

        const { searchTerm, businessType, address, city, county } = request.query as {
            searchTerm?: string;
            businessType?: 'RENT' | 'SELL';
            address?: string;
            city?: string;
            county?: string;
        };

        if (searchTerm && searchTerm.length >= 3) {
            filters.OR = [
                { title: { contains: searchTerm, mode: 'insensitive' } },
                { description: { contains: searchTerm, mode: 'insensitive' } },
                { address: { contains: searchTerm, mode: 'insensitive' } },
                { neighborhood: { contains: searchTerm, mode: 'insensitive' } },
                { city: { contains: searchTerm, mode: 'insensitive' } },
                { county: { contains: searchTerm, mode: 'insensitive' } },
            ];
        }

        if (businessType) {
            filters.businessType = businessType;
        }
        console.log(filters)
        const properties = await prisma.property.findMany({
            where: filters,
            orderBy: {
                businessType: 'asc', // Ordena pela coluna businessType em ordem ascendente
            },
        });

        reply.status(200).send({ properties });
    } catch (error) {
        reply.status(500).send({
            status: 'error',
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}

export async function updateProperty(id: string, request: FastifyRequest, reply: FastifyReply) {
    try {
        const parseResult = PartialPropertySchema.safeParse(request.body);

        if (!parseResult.success) {
            reply.status(400).send({
                status: 'error',
                message: 'Validation error',
                errors: parseResult.error.errors,
            });
            return;
        }

        const data = parseResult.data;
        const updateData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v != null));

        const updatedProperty = await prisma.property.update({
            where: { publicId: id },
            data: updateData,
        });

        reply.status(200).send({
            status: 'success',
            message: 'Property updated successfully',
            data: updatedProperty,
        });
    } catch (error) {
        reply.status(500).send({
            status: 'error',
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}

export async function deleteProperty(id: string, request: FastifyRequest, reply: FastifyReply) {
    try {
        await prisma.property.delete({
            where: { publicId: id },
        });

        reply.status(200).send({
            status: 'success',
            message: 'Property deleted successfully',
        });
    } catch (error) {
        reply.status(500).send({
            status: 'error',
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}

export async function toogleProperty(id: string, request: FastifyRequest, reply: FastifyReply) {
    try {
        const property = await prisma.property.findFirst({
            where: { publicId: id }
        })
        if (property?.active) {
            await prisma.property.update({
                where: { publicId: id },
                data: {
                    active: false
                }
            })
            return property.active
        } else {
            await prisma.property.update({
                where: { publicId: id },
                data: {
                    active: true
                }
            })
            return property?.active
        }

    } catch (error) {
        reply.status(500).send({
            status: 'error',
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}

export async function toggleFavoriteProperty(id: string, userId: string, request: FastifyRequest, reply: FastifyReply) {
    try {
        const verifyProperty = await prisma.property.findFirst({
            where: {
                publicId: id
            }
        })
        if (verifyProperty) {
            const verifyIsFavorite = await prisma.favoriteProperty.findFirst({
                where: {
                    AND: [
                        { propertyId: verifyProperty.publicId },
                        { userId: verifyProperty.userId }
                    ]
                },
            })
            if (verifyIsFavorite) {
                await prisma.favoriteProperty.delete({
                    where: {
                        id: verifyIsFavorite.id
                    }
                })
                reply.send(false)
            }else{
                await prisma.favoriteProperty.create({
                    data:{
                        userId: userId,
                        propertyId:verifyProperty.publicId
                    }
                })
                reply.send(true)
            }
        }
    } catch (error) {
        console.error('Error toggling favorite property:', error);
        reply.status(500).send({
            status: 'error',
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}

export async function getImagesProperty(id: string, request: FastifyRequest, reply: FastifyReply) {
    try {
        const images = await prisma.propertyImgs.findMany({
            where: {
                propertyId: id
            }
        })
        reply.status(200).send({ images });
    } catch (error) {
        reply.status(500).send({
            status: 'error',
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}

export async function favoriteProperties(userId: string, request: FastifyRequest, reply: FastifyReply) {
    console.log(userId)
    try {
        const favorites = await prisma.favoriteProperty.findMany({
            where: {
                userId
            }
        })
        reply.status(200).send({ favorites });
    } catch (error) {
        reply.status(500).send({
            status: 'error',
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}

export async function getPropertyDetails(propertyId: string, request: FastifyRequest, reply: FastifyReply) {
    try {
        const property = await prisma.property.findUnique({
            where: {
                publicId: propertyId,
            },
        });
        reply.status(200).send({ property });
    } catch (error) {
        reply.status(500).send({
            status: 'error',
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}

export async function isFavorite(id: string, userId: string, request: FastifyRequest, reply: FastifyReply){
    try {
        const isfavorite = await prisma.favoriteProperty.findFirst({
            where:{
                AND:[
                    {propertyId:id},
                    {userId}
                ]
            }
        })
        if(isfavorite){
            reply.send(true)
        }else{
            reply.send(false)
        }
    } catch (error) {
        
    }
}