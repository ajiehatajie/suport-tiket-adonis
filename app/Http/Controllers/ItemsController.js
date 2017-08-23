'use strict'
const Items = use('App/Model/Item')
const Validator = use('Validator')
const Category = use ('App/Model/Category')
const Antl = use('Antl')
class ItemsController {



  * index (request,response) {
    const item = yield Items.all()
    const category = yield Category.all()
    yield response.sendView('admin.item.index', { items:item.toJSON(),category:category.toJSON() } )

  }

  * create (request,response) {
    yield response.sendView('admin.item.create')
  }

  * store (request,response) {
    const user = request.currentUser

    // validate form input
    const validation = yield Validator.validateAll(request.all(), {
        code:'required',
        name: 'required',
        desc: 'required',
        room: 'required',
        vendor: 'required',
        notes:'required',
        datebuy:'required',
        expired:'required'
    })

    const items= yield Items.create({
        code  :request.input('code'),
        name  :request.input('name'),
        desc  :request.input('desc'),
        room  :request.input('room'),
        vendor:request.input('vendor'),
        notes :request.input('notes'),
        date_buy:request.input('datebuy'),
        expired  :request.input('expired')
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
    response.redirect('/admin/items')

  }

  * show (request,response) {

    yield response.sendView('admin.item.show',{} )
  }

  * edit (request,response) {
    const item = yield Items.query().where('id',request.param('item_id')).firstOrFail()
    const time = Antl.formatDate(item.date_buy, { month:'numeric',day:'numeric',year:'numeric' })
    yield response.sendView('admin.item.edit',{ items:item.toJSON(),time:time } )
    console.log(time);
  }

  * update (request,response) {

  }

  * destroy (request,response) {

  }

}

module.exports = ItemsController
