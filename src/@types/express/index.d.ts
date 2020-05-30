declare namespace Express {
	interface Request {
		user?: any;
		isLoggedIn?: Boolean;
	}
}
