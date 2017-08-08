'use strict'

class Wakil {

  * handle (request, response, next) {

    if (request.currentUser.is_admin !== 3) {
        response.redirect('/');
    }
    yield next

  }

}

module.exports = Wakil
