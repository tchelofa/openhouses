import { Prisma } from '@prisma/client';
import { FastifyReply, FastifyRequest } from 'fastify';
import { PropertySchema, PartialPropertySchema } from '../lib/ZodSchemas';
import prisma from '../lib/prismaConfig';
import { sendSuccess, sendError } from '../utils/response';

// CREATE
export async function newProperty(id: string, request: FastifyRequest, reply: FastifyReply) {
    try {
        const parseResult = PropertySchema.safeParse(request.body);

        if (!parseResult.success) {
            sendError(reply, 400, 'Validation error', parseResult.error);
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

        sendSuccess(reply, 'Property created successfully', newProperty);
    } catch (error) {
        sendError(reply, 500, 'Internal server error', error);
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

        sendSuccess(reply, 'Properties retrieved successfully', properties);
    } catch (error) {
        sendError(reply, 500, 'Internal server error', error);
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

        const properties = await prisma.property.findMany({
            where: filters,
            orderBy: {
                businessType: 'asc', // Ordena pela coluna businessType em ordem ascendente
            },
        });

        sendSuccess(reply, 'Filtered properties retrieved successfully', properties);
    } catch (error) {
        sendError(reply, 500, 'Internal server error', error);
    }
}

export async function updateProperty(id: string, request: FastifyRequest, reply: FastifyReply) {
    try {
        const parseResult = PartialPropertySchema.safeParse(request.body);

        if (!parseResult.success) {
            sendError(reply, 400, 'Validation error', parseResult.error);
            return;
        }

        const data = parseResult.data;
        const updateData = Object.fromEntries(Object.entries(data).filter(([_, v]) => v != null));

        const updatedProperty = await prisma.property.update({
            where: { publicId: id },
            data: updateData,
        });

        sendSuccess(reply, 'Property updated successfully', updatedProperty);
    } catch (error) {
        sendError(reply, 500, 'Internal server error', error);
    }
}

export async function deleteProperty(id: string, request: FastifyRequest, reply: FastifyReply) {
    try {
        await prisma.property.delete({
            where: { publicId: id },
        });

        sendSuccess(reply, 'Property deleted successfully');
    } catch (error) {
        sendError(reply, 500, 'Internal server error', error);
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
            sendSuccess(reply, 'Property deactivated successfully');
        } else {
            await prisma.property.update({
                where: { publicId: id },
                data: {
                    active: true
                }
            })
            sendSuccess(reply, 'Property activated successfully');
        }

    } catch (error) {
        sendError(reply, 500, 'Internal server error', error);
    }
}

export async function toggleFavoriteProperty(id: string, userId:string, request: FastifyRequest, reply: FastifyReply) {

    try {
        const existingFavorite = await prisma.favoriteProperty.findFirst({
            where: {
                propertyId: id,
                userId: userId,
            }
        });

        if (existingFavorite) {
            await prisma.favoriteProperty.delete({
                where: {
                    id: existingFavorite.id,
                }
            });
            reply.send(false);
        } else {
            await prisma.favoriteProperty.create({
                data: {
                    userId: userId,
                    propertyId: id,
                }
            });
            reply.send(true);
        }
    } catch (error) {
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
        sendSuccess(reply, 'Property images retrieved successfully', images);
    } catch (error) {
        sendError(reply, 500, 'Internal server error', error);
    }
}

export async function favoriteProperties(userId: string, request: FastifyRequest, reply: FastifyReply) {

    try {
        const favorites = await prisma.favoriteProperty.findMany({
            where: {
                userId
            }
        })
        sendSuccess(reply, 'Favorite properties retrieved successfully', favorites);
    } catch (error) {
        sendError(reply, 500, 'Internal server error', error);
    }
}

export async function getPropertyDetails(propertyId: string, request: FastifyRequest, reply: FastifyReply) {
    try {
        const property = await prisma.property.findUnique({
            where: {
                publicId: propertyId,
            },
        });
        sendSuccess(reply, 'Property details retrieved successfully', property);
    } catch (error) {
        sendError(reply, 500, 'Internal server error', error);
    }
}

export async function isFavorite(id: string, userId:string, request: FastifyRequest, reply: FastifyReply) {

    try {
        const result = await prisma.favoriteProperty.findFirst({
            where: {
                propertyId: id,
                userId: userId,
            }
        });
        reply.send(Boolean(result));
    } catch (error) {
        reply.status(500).send({
            status: 'error',
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
}
