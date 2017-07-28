'use strict'

class Manajer {


  * handle (request, response, next) {
    if (request.currentUser.is_admin !== 2) {
        response.redirect('/');
    }
    yield next
  }

}

module.exports = Manajer
