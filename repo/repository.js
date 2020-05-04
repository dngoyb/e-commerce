const fs = require('fs');
const crypto = require('crypto');

module.exports = class repository {
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

	async writeAll(records) {
		await fs.promises.writeFile(
			this.filename,
			JSON.stringify(records, null, 2),
		);
	}
	randomId() {
		return crypto.randomBytes(4).toString('hex');
	}

	async create(attributes) {
		attributes.id = this.randomId();

		const records = await this.getAll();
		records.push(attributes);

		await this.writeAll(records);

		return records;
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
};
