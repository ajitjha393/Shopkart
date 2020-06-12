import fs from 'fs'

export function readFile<T>(path: string, cb: Function) {
	return new Promise<T>((res, rej) => {
		fs.readFile(path, (err, data) => {
			res(cb(err, data))
		})
	})
}

export function writeFile<T>(p: string, products: T) {
	fs.writeFile(p, JSON.stringify(products), (err) =>
		err ? console.log(err) : null
	)
}

export const deleteFile = (filePath: string) => {
	fs.unlink(filePath, (err) => {
		if (err) {
			throw err
		}
	})
}
