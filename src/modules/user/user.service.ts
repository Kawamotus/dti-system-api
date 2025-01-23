import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

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

  findAll() {
    return `This action returns all user`;
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
