"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailService = void 0;
// import * as nodemailer from 'nodemailer';
const mail_1 = __importDefault(require("@sendgrid/mail"));
const credentials_1 = require("./credentials");
class MailService {
    static sendMail(msg) {
        mail_1.default.setApiKey(credentials_1.API_KEY);
        return mail_1.default.send(msg);
    }
}
exports.MailService = MailService;
//# sourceMappingURL=MailService.js.map