const layout = require('../layouts');
const { getError } = require('../../helpers');

module.exports = ({ req, errors }) => {
	return layout({
		content: `
      <div>
        Your id is: ${req.session.userId}
        <form method="POST">
          <input name="email" placeholder="email" />
          ${getError(errors, 'email')}
          <input name="password" placeholder="password" />
          ${getError(errors, 'password')}
          <input name="confirmPassword" placeholder="password confirmation" />
          ${getError(errors, 'confirmPassword')}
          <button>Sign Up</button>
        </form>
      </div>
    `,
	});
};
