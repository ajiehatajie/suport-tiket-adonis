'use strict'
const Items = use('App/Model/item')
const Validator = use('Validator')

class ItemsController {

  * index (request,response) {
    const item = yield Items.all()

    yield response.sendView('admin.item.index', { items:item.toJSON() } )

  }

  * create (request,response) {
    yield response.sendView('admin.item.create')
  }

  * store (request,response) {
    const user = request.currentUser

    // validate form input
    const validation = yield Validator.validateAll(request.all(), {
        name: 'required',
        desc: 'required',
        room: 'required',
        vendor: 'required',
        notes:'required',
        datebuy:'required'
    })

    const items= yield Items.create({
        name  :request.input('name'),
        desc  :request.input('desc'),
        room  :request.input('room'),
        vendor:request.input('vendor'),
        notes :request.input('notes'),
        date_buy:request.input('datebuy')
    })

    // show error messages upon validation fail
    if (validation.fails()) {
        yield request
            .withAll()
            .andWith({ errors: validation.messages() })
            .flash()

        return response.redirect('back')
    }


    yield request.with({ status: `A Items is Created .` }).flash()
    response.redirect('back')

  }

  * show (request,response) {

    yield response.sendView('admin.item.show',{} )
  }

  * edit (request,response) {

  }

  * update (request,response) {

  }

  * destroy (request,response) {

  }

}

module.exports = ItemsController
