'use strict'

class Direktur {

  * handle (request, response, next) {
    if (request.currentUser.is_admin !== 4) {
        response.redirect('/');
    }
    yield next
  }

}

module.exports = Direktur
