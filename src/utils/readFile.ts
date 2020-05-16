import fs from 'fs';

export function readFile<T>(path: string, cb: Function) {
	return new Promise<T>((res, rej) => {
		fs.readFile(path, (err, data) => {
			res(cb(err, data));
		});
	});
}
