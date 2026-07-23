import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { NotFoundException } from '@nestjs/common';
import { Prisma } from 'generated/prisma/client';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        name: true,
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    try {
      return await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          `Email ${createUserDto.email} already exits`,
        );
      }
      throw error;
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    const data = {
      ...updateUserDto,
    };

    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    return this.prisma.user.update({
      where: {
        id,
      },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.user.delete({
      where: {
        id,
      },
    });
    return 'user deleted successfully';
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }
}
