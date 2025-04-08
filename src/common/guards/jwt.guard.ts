import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Passport } from "passport";

@Injectable()
export class AuthJwt extends AuthGuard("jwt") {
	constructor() {
		super();
	}
}
