const fs = require('fs');
class UsersRepo {
	constructor(filename) {
		if (!filename) {
			throw new Error('No file name');
		}
		this.filename = filename;

		try {
			fs.accessSync(this.filename);
		} catch (error) {
			fs.writeFileSync(this.filename, '[]');
		}
	}

	async getAll() {
		return JSON.parse(
			await fs.promises.readFile(this.filename, {
				encoding: 'utf8',
			}),
		);
	}
	async create(attributes) {
		const records = await this.getAll();
		records.push(attributes);

		await fs.promises.writeFile(
			this.filename,
			JSON.stringify(records, null, 2),
		);
	}
}

const test = async () => {
	const repo = new UsersRepo('users.json');
	await repo.create({ email: 'test@test.com', password: 'password' });
	const user = await repo.getAll();

	console.log(user);
};

test();
