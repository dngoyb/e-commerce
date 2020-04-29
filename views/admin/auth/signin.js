const layout = require('../layouts');
const { getError } = require('../../helpers');

module.exports = ({ req, errors }) => {
	return layout({
		content: `
        <div>
            <form method="POST">
                <input type="text" name="email" placeholder="Email"/>
                ${getError(errors, 'email')}
                <input type="text" name="password" placeholder="Password"/>
                ${getError(errors, 'password')}
                <button>Sign in</button>
            </form>
        </div>
        `,
	});
};
