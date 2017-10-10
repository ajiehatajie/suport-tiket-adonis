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
    const item = yield Items.query().where('id',request.param('item_id')).firstOrFail()
    const time = Antl.formatDate(item.date_buy, { month:'numeric',day:'numeric',year:'numeric' })
    
    yield response.sendView('admin.item.show',{items:item.toJSON(),time:time } )
  }

  * edit (request,response) {
    const item = yield Items.query().where('id',request.param('item_id')).firstOrFail()
    const time = Antl.formatDate(item.date_buy, { month:'numeric',day:'numeric',year:'numeric' })
    yield response.sendView('admin.item.edit',{ items:item.toJSON(),time:time } )
    console.log(time);
  }

  * update (request,response) {
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
        if (validation.fails()) {
          yield request
              .withAll()
              .andWith({ errors: validation.messages() })
              .flash()
  
          return response.redirect('back')
      }
        const post = yield Items.findBy('id', request.input('id'))
        console.log(request.input('code'))
        post.code  = request.input('code')
        post.name  = request.input('name')
        post.desc  = request.input('desc')
        post.room  = request.input('room')
        post.vendor =request.input('vendor')
        post.notes  =request.input('notes')
        post.date_buy =request.input('datebuy')
        post.expired  =request.input('expired')

        yield post.save();
        console.log(request.input('code'))
        // show error messages upon validation fail
       
    
    
        yield request.with({ status: `A Items is update .` }).flash()
        response.redirect('/admin/items')
  }

  * destroy (request,response) {

  }


  * itemsUser (request,response) {
    var req = request.get()
    
    const search = req.search;
    console.log(search)
    var item;
    if(search == null) {
       item = yield Items.all()
      
    } else {
       item = yield Items.query().whereRaw('name like ?','%'+search+'%').fetch()
      
    }
    const category = yield Category.all()
    yield response.sendView('admin.item.items-user', { items:item.toJSON(),category:category.toJSON() } )

  }

}

module.exports = ItemsController
