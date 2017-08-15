'use strict'
const User = use('App/Model/User')
const Validator = use('Validator')
const departemens = use('App/Model/Department')
const Category = use('App/Model/Category')
const Ticket = use('App/Model/Ticket')
const Database = use('Database')
const Antl = use('Antl')

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

  * report (request,response) {

    var Tiket;
    var req = request.get()

    var start = req.start
    var end   = req.end

    if (start != null) {
      console.log(start);
      //var hasil = yield Ticket.query().whereBetween('created_at =',[start,end])

      Tiket = yield Database.from('tickets').whereRaw('date(created_at) between ? and ?', [start,end])
      console.log(Tiket);
    } else {
      start =null;
      end=null;
      const Tiket2 = yield Ticket.all()
      Tiket = Tiket2.toJSON()
    }
    //const Category_ticket = yield  Ticket.category().fetch()
    const categories = yield Category.all()
    const user = yield User.all()


    yield response.sendView('admin.report.index',{
      tickets:Tiket,start:start,end:end,categories: categories.toJSON(),user:user.toJSON() } )
  }

  * postreport (request,response) {

    const Tiket = yield Ticket.all()
    console.log(request)  ;
    yield response.sendView('admin.report.index',{
      tickets:Tiket.toJSON() } )
  }
}

module.exports = AdminController
