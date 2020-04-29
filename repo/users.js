const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

const scrypt = util.promisify(crypto.scrypt);
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
		attributes.id = this.randomId();
		const salt = crypto.randomBytes(8).toString('hex');
		const buf = await scrypt(attributes.password, salt, 64);

		const records = await this.getAll();

		const hashedRecord = {
			...attributes,
			password: `${buf.toString('hex')}.${salt}`,
		};

		records.push(hashedRecord);

		await this.writeAll(records);

		return hashedRecord;
	}
	async writeAll(records) {
		await fs.promises.writeFile(
			this.filename,
			JSON.stringify(records, null, 2),
		);
	}
	randomId() {
		return crypto.randomBytes(4).toString('hex');
	}

	async getOne(id) {
		const records = await this.getAll();
		return records.find((record) => record.id === id);
	}

	async delete(id) {
		const records = await this.getAll();
		const filtered = records.filter((record) => record.id !== id);
		await this.writeAll(filtered);
	}

	async update(id, attributes) {
		const records = await this.getAll();
		const filtered = records.find((record) => record.id === id);
		if (!filtered) {
			throw new Error(`No records with id of ${id}`);
		}
		Object.assign(filtered, attributes);
		await this.writeAll(records);
	}
	async getOneBy(filtered) {
		const records = await this.getAll();
		console.log(records);
		for (const record of records) {
			let found = true;

			for (const key in filtered) {
				if (filtered[key] !== record[key]) {
					found = false;
				}
			}
			if (found) {
				return record;
			}
		}
	}

	async comparePasswords(saved, supplied) {
		const [hashed, salt] = saved.split('.');
		const hashedSupplied = await scrypt(supplied, salt, 64);

		return hashed === hashedSupplied.toString('hex');
	}
}

module.exports = new UsersRepo('users.json');

// const test = async () => {
// 	const repo = new UsersRepo('users.json');
// 	await repo.create({ email: 'test@test.com', password: 'password' });
// 	let user = await repo.getAll();
// 	// await repo.update('d652d80b', { password: 'Ngoy' });
// 	// user = await repo.getOneBy({ password: 'Ngoy', email: 'test@test.com' });

// 	// const user = await repo.getAll();

// 	console.log(user);
// };

// test();
