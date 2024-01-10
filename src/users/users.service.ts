import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync, hashSync } from 'bcryptjs';
import { UserDuplicatedException } from 'src/errors/user-duplicated';
import { SALT_ROUNDS } from 'src/helpers/constants';
import { Repository } from 'typeorm';

import type { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const hashedPassword = hashSync(createUserDto.password, SALT_ROUNDS);

    this.logger.log(`Hashed password for ${createUserDto.email}`);

    try {
      const newUser = await this.usersRepository.save({
        email: createUserDto.email,
        password: hashedPassword,
      });

      return newUser;
    } catch (error) {
      this.logger.error(error);

      throw new UserDuplicatedException({ email: createUserDto.email });
    }
  }

  async findOne({ email }: { email: string }) {
    const user = await this.usersRepository.findOneBy({ email });

    if (!user) {
      return null;
    }

    return {
      email: user.email,
      id: user.id,
      password: user.password,
    };
  }

  validatePassword({
    password,
    hashedPassword,
  }: {
    password: string;
    hashedPassword: string;
  }) {
    return compareSync(password, hashedPassword);
  }
}
