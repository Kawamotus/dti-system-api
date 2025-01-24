import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TokenValidationMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Token não fornecido.');
    }

    if (!authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token deve ser do tipo Bearer.');
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = this.jwtService.verify(token, {
        secret: process.env.SECRET_KEY,
      });

      req['user'] = decoded;

      next();
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException('Token inválido ou expirado.');
    }
  }
}
