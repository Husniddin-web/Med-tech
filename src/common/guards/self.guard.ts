import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class SelfGuard implements CanActivate {
	constructor(
		private readonly jwtService: JwtService,
		private readonly reflector: Reflector,
	) {}

	canActivate(context: ExecutionContext): boolean {
		const req = context.switchToHttp().getRequest();

		if (!req.user) {
			throw new UnauthorizedException("Authentication required.");
		}

		const userId = Number(req.user.id);
		const paramId = Number(req.params.id);

		console.log("User ID from JWT:", userId);
		console.log("Requested ID:", paramId);

		if (userId !== paramId) {
			throw new ForbiddenException("You do not have permission to access this resource.");
		}

		return true;
	}
}
