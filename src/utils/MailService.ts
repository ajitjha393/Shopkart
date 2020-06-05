// import * as nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail'
import { API_KEY } from './credentials'

export class MailService {
	static sendMail(msg: any) {
		sgMail.setApiKey(API_KEY)
		return sgMail.send(msg)
	}
}
