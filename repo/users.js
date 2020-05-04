const crypto = require('crypto');
const util = require('util');
const repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);
class UsersRepo extends repository {
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

	async comparePasswords(saved, supplied) {
		try {
			const [hashed, salt] = saved.split('.');
			const hashedSupplied = await scrypt(supplied, salt, 64);

			return hashed === hashedSupplied.toString('hex');
		} catch (error) {
			return '';
		}
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
