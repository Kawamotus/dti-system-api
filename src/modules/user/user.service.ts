import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { IUser } from 'src/interfaces/user';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  throwNotFoundError() {
    throw new NotFoundException('User not found');
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const saltOrRounds = 10;
      const hash = await bcrypt.hash(createUserDto.password, saltOrRounds);

      const userData = {
        name: createUserDto.name,
        password: hash,
        email: createUserDto.email,
        type: createUserDto.type,
      };

      const createdUser = await this.userRepository.create(userData);
      return await this.userRepository.save(createdUser);
    } catch (e) {
      if (e.code == 23505) {
        throw new ConflictException('O e-mail já está cadastrado');
      }
      throw e;
    }
  }

  async findAll(user: IUser) {
    if (user.user.type !== 'dti') {
      throw new ForbiddenException('Permission denied');
    }
    //parametros podem ser passados ou nao para o find
    const allUsers = await this.userRepository.find();

    return allUsers;
  }

  async findOneById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) {
      this.throwNotFoundError();
    }

    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      this.throwNotFoundError();
    }

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto, user: IUser) {
    if (user.user.id !== id) {
      throw new ForbiddenException('Permission denied');
    }

    const userData = {
      name: updateUserDto?.name,
      password: updateUserDto.password
        ? await bcrypt.hash(updateUserDto.password, 10)
        : updateUserDto?.password,
    };

    const findUser = await this.userRepository.preload({ id, ...userData });
    if (!findUser) {
      this.throwNotFoundError();
    }

    return await this.userRepository.save(findUser);
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
