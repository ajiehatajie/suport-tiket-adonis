'use strict'

const Mail = use('Mail')
const Validator = use('Validator')
const Ticket = use('App/Model/Ticket')
const RandomString = use('randomstring')
const Category = use('App/Model/Category')

const User = use ('App/Model/User')

class DirekturController {

  * index(request, response) {

      const userLogin = request.currentUser
      const tickets = yield Ticket.query()
                        .where('status_approve',6)
                        .where('status','open')
                        .fetch()

      const categories = yield Category.all()
      const user = yield User.all()
      yield response.sendView('manajer.ticket.index', { tickets: tickets.toJSON()
        ,user:user.toJSON()
        ,userlogin:userLogin.toJSON() })
  }

  * approve (request,response) {

    const user = request.currentUser

    const ticket = yield Ticket.query()
                    .where('ticket_id', request.param('ticket_id'))
                    .firstOrFail()
    const status = request.input('status')
    const category = request.input('category')

    console.log(`status dari direktur ${status} `);

    if(status=='approve')
    {
        ticket.status_approve = 7
        ticket.updated_by = user.id
        yield ticket.save()
  
    } else if(status =='reject') {
        ticket.status ='Reject'
    } else {
        ticket.status = 'edit'
    }    

   

    const ticketOwner = yield ticket.user().fetch()

    yield request.with({ status: 'The ticket has been Approve.' }).flash()
    response.redirect('/direktur/tickets')



  }

}

module.exports = DirekturController
