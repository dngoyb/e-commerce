const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.send(`
		<div>
			<form method="POST">
				<input type="text" name="email" placeholder="Email"/>
				<input type="password" name="password" placeholder="Password"/>
				<input type="password" name="confirmPassword" placeholder="Confirm password"/>
				<button>Sign Up</button>
			</form>
		</div>
	`);
});

app.post('/', (req, res) => {
	console.log(req.body);
	res.send('Account created!!!');
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
