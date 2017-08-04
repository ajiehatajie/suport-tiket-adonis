'use strict'
const departemens = use ('App/Model/Department')
const Validator = use('Validator')

class DepartmentController {


  * index ( request,response) {

    const depart = yield departemens.all()

    yield response.sendView('admin.departemens.index',{departemens:depart.toJSON() } )

  }

  * create (request,response) {

    yield response.sendView('admin.departemens.create')

  }

  * store (request,response) {
    // validate form input
    const validation = yield Validator.validateAll(request.all(), {
        name: 'required'
    })
    // show error messages upon validation fail
    if (validation.fails()) {
        yield request
            .withAll()
            .andWith({ errors: validation.messages() })
            .flash()

        return response.redirect('back')
    }

    // persist ticket to database
    const depart= yield departemens.create({
        name: request.input('name')
        })

    yield request.with({ status: `Success create new Department.` }).flash()
    response.redirect('/admin/department')

  }

  * edit (request,response) {

  }

  * delete (request,response) {

  }

}

module.exports = DepartmentController
