import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { extractTokenFromRequest } from '../../utils';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = extractTokenFromRequest(request);
    const payload = await this.authService.validateToken(token);
    if (payload) {
      request['user'] = payload.user;
      return true;
    }
    throw new UnauthorizedException('Unauthorized User');
  }
}
