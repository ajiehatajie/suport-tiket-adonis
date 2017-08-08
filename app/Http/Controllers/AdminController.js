'use strict'
const User = use('App/Model/User')
const Validator = use('Validator')
const departemens = use('App/Model/Department')
const Category = use('App/Model/Category')

class AdminController {


  * index (request,response) {
    const user = yield User.query().whereNotIn('is_admin',[1] )
    const depart = yield departemens.all()

    yield response.sendView('admin.user.index',{user : user,departemens: depart.toJSON() } )
  }

  * addUser (request, response) {
      const depart = yield departemens.pair('id','name')
      yield response.sendView('admin.user.add',{departemens: depart } )
  }


  * store (request,response) {
    // validate form input
    const validation = yield Validator.validateAll(request.all(), User.rules)

    // show error messages upon validation fail
    if (validation.fails()) {
        yield request
            .withAll()
            .andWith({ errors: validation.messages() })
            .flash()

        return response.redirect('back')
    }

    // persist to database
    const user = yield User.create({
        username: request.input('username'),
        email: request.input('email'),
        password: request.input('password'),
        is_admin: request.input('position'),
        departemen_id : request.input('departemens')
    })

    // login the user

    // redirect to homepage
    response.redirect('/admin/user')
  }

}

module.exports = AdminController
