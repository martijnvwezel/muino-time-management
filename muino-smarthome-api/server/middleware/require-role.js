const httpError = require('http-errors');

const requireRole = function (role) {
    return function (req, res, next) {
        if (req.user && req.user.roles.indexOf(role) > -1)
            return next();
        const err = new httpError(401);
        return next(err);
    }
}

module.exports = requireRole;
