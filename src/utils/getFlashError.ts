export function getErrorMessage(req: any) {
	let errorMessage = req.flash('error');
	console.log(errorMessage);
	if (errorMessage.length > 0) {
		return errorMessage[0];
	} else {
		return null;
	}
}
