import * as nodemailer from 'nodemailer';
import { username, password } from '../utils/credentials';

export class GMailService {
	private _transporter: nodemailer.Transporter;
	constructor() {
		this._transporter = nodemailer.createTransport({
			service: 'gmail',
			auth: {
				user: username,
				pass: password,
			},
		});
	}
	sendMail(to: string, subject: string, content: string): Promise<void> {
		let options = {
			from: 'nodeshop393@gmail.com',
			to: to,
			subject: subject,
			html: content,
		};

		return new Promise<void>(
			(resolve: (msg: any) => void, reject: (err: Error) => void) => {
				this._transporter.sendMail(options, (error, info) => {
					if (error) {
						console.log(`error: ${error}`);
						reject(error);
					} else {
						console.log(`Message Sent 
                      ${info.response}`);
						resolve(`Message Sent  
                      ${info.response}`);
					}
				});
			}
		);
	}
}
