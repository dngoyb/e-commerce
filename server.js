const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const usersRepo = require('./repo/users');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	cookieSession({
		keys: ['ngoy Banza'],
	}),
);

app.get('/signup', (req, res) => {
	res.send(`
		<div>
		Your Id is: ${req.session.userId}
			<form method="POST">
				<input type="text" name="email" placeholder="Email"/>
				<input type="text" name="password" placeholder="Password"/>
				<input type="text" name="confirmPassword" placeholder="Confirm password"/>
				<button>Sign Up</button>
			</form>
		</div>
	`);
});

app.post('/signup', async (req, res) => {
	const { email, password, confirmPassword } = req.body;
	const existEmail = await usersRepo.getOneBy({ email });
	if (existEmail) {
		return res.send('Email already exist');
	}
	if (password !== confirmPassword) {
		return res.send('Password not match');
	}
	const user = await usersRepo.create({ email, password });
	req.session.userId = user.Id;
	res.send('Account created!!!');
});

app.get('/signout', (req, res) => {
	req.session = null;
	res.send('You have signed out');
});

app.get('/signin', (req, res) => {
	res.send(`
		<div>
			<form method="POST">
				<input type="text" name="email" placeholder="Email"/>
				<input type="text" name="password" placeholder="Password"/>
				<button>Sign in</button>
			</form>
		</div>
	`);
});

app.post('/signin', async (req, res) => {
	const { email, password } = req.body;
	const user = await usersRepo.getOneBy({ email });

	if (!user) {
		return res.send(`User doesn't exist`);
	}
	const validPassword = await usersRepo.comparePasswords(
		user.password,
		password,
	);
	if (!validPassword) {
		return res.send(`Invalid Password`);
	}
	req.session.userId = user.id;
	res.send(`You are signed in`);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
