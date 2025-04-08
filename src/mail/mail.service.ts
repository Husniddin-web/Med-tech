import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}
  async sendMailToAdmin(user: any) {
    console.log(user);
    await this.mailerService.sendMail({
      to: user.email,
      subject: "Medicine",
      template: "../mail/templates/admin.hbs",
      context: {
        user,
      },
    });
  }
}
