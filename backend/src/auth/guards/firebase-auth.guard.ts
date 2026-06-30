import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { getAuth } from 'firebase-admin/auth';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid token');
    }

    const token = authHeader.split('Bearer ')[1];

    try {
      const decodedToken = await getAuth().verifyIdToken(token);
      request.user = decodedToken;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid Firebase Token');
    }
  }
}
