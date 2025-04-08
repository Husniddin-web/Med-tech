import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, map } from "rxjs";

@Injectable()
export class ResponseFormatInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		if (context.getType() !== "http") {
			return next.handle();
		}
		const ctx = context.switchToHttp();
		const request = ctx.getRequest();
		const response = ctx.getResponse();
		return next.handle().pipe(
			map((data) => {
				const formattedResponse = {
					statusCode: response.statusCode,
					success: true,
					data: data || {},
				};

				return formattedResponse;
			}),
		);
	}
}
