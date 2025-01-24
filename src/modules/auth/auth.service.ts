import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async auth(loginDto: LoginDto) {
    try {
      const user = await this.userService.findOneByEmail(loginDto.email);
      const comparedPassword = await bcrypt.compare(
        loginDto.password,
        user.password,
      );

      if (comparedPassword) {
        const payload = {
          user: {
            name: user.name,
            email: user.email,
            type: user.type,
            id: user.id,
          },
        };
        const token = await this.jwtService.signAsync(payload, {
          secret: process.env.SECRET_KEY,
          expiresIn: process.env.EXPIRESIN,
        });
        return { token: token, message: 'success' };
      } else {
        throw new UnauthorizedException('email ou senha incorretos');
      }

      //arrumar esse try catch
    } catch (e) {
      console.log(e.message);
      throw new UnauthorizedException('email ou senha incorretos');
    }
  }
}
