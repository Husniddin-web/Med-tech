import { BadRequestException, createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentLanguage = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest();
	const lang = Number(request.headers["lang"] as number);
	if (!lang) {
		throw new BadRequestException("lang is not provided on header");
	}
	return lang;
});
