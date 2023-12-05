import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
@Serialize(UserDto)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({
    summary: 'Find all users',
    description: 'Returns the list of all users or by using queries',
  })
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }
  @Get('/:id')
  @ApiOperation({
    summary: 'Find one user',
    description: "Finds a user by id",
  })
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  @Post('/signup')
  @ApiOperation({
    summary: 'Sign up a new user',
    description: 'Signs up a new user by giving a new email and password',
  })
  createUser(@Body() body: CreateUserDto) {
    this.usersService.create(body.email, body.password);
  }

  @Patch('/:id')
  @ApiOperation({
    summary: 'Update an existing user',
    description: "Updates an existing user's information by id",
  })
  UpdateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(+id, body);
  }
  @Delete('/:id')
  @ApiOperation({
    summary: 'Delete an existing user',
    description: 'Deletes an existing user by id',
  })
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
