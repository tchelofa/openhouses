import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import prisma from '../lib/prismaConfig';
import sendEmail from '../lib/email/config';
import { v4 as uuidv4 } from 'uuid';

import { userActivationEmail, welcomeEmail } from '../lib/email/emails'
import { FastifyReply, FastifyRequest } from 'fastify';

export class UserService {
  async getAllUsers(query: any) {
    const filters: any = {};

    if (query.name) filters.name = { mode: 'insensitive', contains: query.name };
    if (query.email) filters.email = { mode: 'insensitive', contains: query.email };
    if (query.mobile) filters.mobile = { mode: 'insensitive', contains: query.mobile };
    if (query.address) filters.address = { mode: 'insensitive', contains: query.address };
    if (query.neighborhood) filters.neighborhood = { mode: 'insensitive', contains: query.neighborhood };
    if (query.city) filters.city = { mode: 'insensitive', contains: query.city };
    if (query.county) filters.county = { mode: 'insensitive', contains: query.county };
    if (query.country) filters.country = { mode: 'insensitive', contains: query.country };
    if (query.accountStatus) filters.accountStatus = { mode: 'insensitive', contains: query.accountStatus };
    if (query.accountType) filters.accountType = { mode: 'insensitive', contains: query.accountType };
    if (query.acceptMarketing) filters.acceptMarketing = { mode: 'insensitive', contains: query.acceptMarketing };

    const users = await prisma.user.findMany({
      where: filters,
    });

    return users;
  }

  async getUserById(id: string) {
    return prisma.user.findUnique({ where: { publicId: id } });
  }

  async createUser(data: any) {
    const hashPassword = await bcrypt.hash(data.password, 10);

    try {
      const newUser = await prisma.user.create({
        data: {
          name: data.name,
          urlAvatar: data.urlAvatar ?? null,
          description: data.description ?? null,
          mobile: data.mobile,
          address: data.address ?? null,
          neighborhood: data.neighborhood ?? null,
          city: data.city ?? null,
          county: data.county ?? null,
          country: data.country ?? null,
          email: data.email,
          password: hashPassword,
          loginAttempt: data.loginAttempt,
          accountStatus: 'Inactivated',
          accountType: data.accountType,
          acceptMarketing: data.acceptMarketing,
          lastLoginAt: data.lastLoginAt ?? null,
          passwordUpdatedAt: data.passwordUpdatedAt ?? null,
        },
      });

      if (newUser) {
        const token = uuidv4()
        const data = new Date()
        data.setHours(data.getHours() + 2)

        const verify = await prisma.verifyToken.create({
          data: {
            token,
            expiration: data,
            type: "ACTIVATION",
            userId: newUser.publicId,
            isUsed: false
          }
        })

        try {
          const html = welcomeEmail(newUser.name, newUser.publicId, token)
          const email = await sendEmail("OpenHouses", "welcome@openhouses.ie", newUser.email, "Welcome to OpenHouses", html, html)
        } catch (error) {

        }
      }

      return true;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return { success: false, message: 'Email address already in use.' };
        } else if (error.code === 'P2001') {
          return { success: false, message: 'Missing required user data.' };
        }
        return { success: false, message: 'An error occurred while creating the user.' };
      } else {
        console.error('Unexpected error:', error);
        return { success: false, message: 'An unexpected error occurred.' };
      }
    }
  }

  async updateUser(publicId: string, data: any) {
    return prisma.user.update({
      where: { publicId },
      data,
    });
  }

  async deleteUser(publicId: string) {
    await prisma.user.delete({ where: { publicId } });
  }

  async activateAccount(userId: string, token: string, request: FastifyRequest, reply: FastifyReply) {
    try {
      const activate = await prisma.verifyToken.findFirst({
        where: {
          userId,
          token
        }
      })

      if (activate?.isUsed == true) {
        reply.status(403).send({ message: "Invalid Token, please get in touch with tecnical support." })
      } else {
        const verifyUser = await prisma.user.findFirst({
          where: {
            publicId: userId
          }
        })
        if (verifyUser?.accountStatus == 'Activated') {
          reply.status(400).send({ message: "Your account have been activated." })
        } else {
          const updateUser = await prisma.user.update({
            where: {
              publicId: userId
            },
            data: {
              accountStatus: "Activated"
            }
          })


          if (updateUser.accountStatus == "Activated") {
            const updateToken = await prisma.verifyToken.update({
              where: {
                token
              },
              data: {
                isUsed: true
              }
            })
            const html = userActivationEmail(updateUser.name)
            sendEmail("OpenHouses", "welcome@openhouses.ie", updateUser.email, "Your account was activated successfully!", html, html)
            reply.status(200).send({ message: "Account activated with success!" })
          }
        }

      }
    } catch (error) {
      if (error instanceof Error) {
        return ({
          code: 400,
          message: error.message
        })
      }
    }
  }
}
