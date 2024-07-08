import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import prisma from '../lib/prismaConfig';

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
          accountStatus: data.accountStatus,
          accountType: data.accountType,
          acceptMarketing: data.acceptMarketing,
          lastLoginAt: data.lastLoginAt ?? null,
          passwordUpdatedAt: data.passwordUpdatedAt ?? null,
        },
      });
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

  async updateUser(id: number, data: any) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: number) {
    await prisma.user.delete({ where: { id } });
  }
}
