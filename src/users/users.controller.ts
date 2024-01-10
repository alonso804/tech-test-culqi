import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserNotFoundException } from 'src/errors/user-not-found';

import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':email')
  async findOne(@Param('email') email: string) {
    const user = await this.usersService.findOne({ email });

    if (!user) {
      throw new UserNotFoundException({ email });
    }

    return {
      email: user.email,
      id: user.id,
    };
  }
}
