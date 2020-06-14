const deleteProduct = (btn: HTMLButtonElement) => {
	console.log('clicked')

	const prodId = (btn.parentNode.querySelector(
		'[name=productId]'
	) as HTMLInputElement).value

	const csrf = (btn.parentNode.querySelector(
		'[name=_csrf]'
	) as HTMLInputElement).value
}
