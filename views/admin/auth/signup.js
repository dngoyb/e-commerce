const layout = require('../layouts');

module.exports = ({ req }) => {
	return layout({
		content: `
        <div>
        Your Id is: ${req.session.userId}
            <form method="POST">
                <input type="text" name="email" placeholder="Email"/>
                <input type="text" name="password" placeholder="Password"/>
                <input type="text" name="confirmPassword" placeholder="Confirm password"/>
                <button>Sign Up</button>
            </form>
        </div>
    `,
	});
};
