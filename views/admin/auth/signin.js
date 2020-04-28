const layout = require('../layouts');

module.exports = () => {
	return layout({
		content: `
        <div>
            <form method="POST">
                <input type="text" name="email" placeholder="Email"/>
                <input type="text" name="password" placeholder="Password"/>
                <button>Sign in</button>
            </form>
        </div>
        `,
	});
};
