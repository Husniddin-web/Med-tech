import {
	Logger,
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	HttpStatus,
} from "@nestjs/common";
import { Response, Request } from "express";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	private readonly logger = new Logger(AllExceptionsFilter.name);

	catch(exception: unknown, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		let status = HttpStatus.INTERNAL_SERVER_ERROR;
		let message: string | string[] = "Internal server error";

		if (exception instanceof HttpException) {
			const exceptionResponse = exception.getResponse();
			status = exception.getStatus();

			if (typeof exceptionResponse === "object" && exceptionResponse !== null) {
				message = (exceptionResponse as any).message || message;
			} else {
				message = exceptionResponse;
			}
		} else if (typeof exception === "object" && exception !== null) {
			message = (exception as any).message || message;
		} else if (typeof exception === "string") {
			message = exception;
		}

		this.logger.error(`🚨 Status: ${status} Error: ${JSON.stringify(message)}`);

		response.status(status).json({
			statusCode: status,
			message,
			timestamp: new Date().toISOString(),
			path: request.url,
			success: false,
		});
	}
}
