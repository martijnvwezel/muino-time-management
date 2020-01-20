'use strict';

function exist_role(user, check_role) {
    if (!(user && user.roles)) return false;
    // console.log(user.roles);
    for (let role of user.roles) {
        if (role === check_role) {
            return true;
        }
    }
    return false;
}
module.exports =  exist_role ;