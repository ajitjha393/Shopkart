const deleteProduct = async (btn: HTMLButtonElement) => {
	console.log('clicked')

	const prodId = (btn.parentNode.querySelector(
		'[name=productId]'
	) as HTMLInputElement).value

	const csrf = (btn.parentNode.querySelector(
		'[name=_csrf]'
	) as HTMLInputElement).value

	try {
		const res = await fetch(`/admin/product/${prodId}`, {
			method: 'DELETE',
			headers: {
				'csrf-token': csrf,
			},
		})

		console.log(res)
	} catch (err) {
		console.log(err)
	}
}
