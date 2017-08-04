'use strict'

const Mail = use('Mail')
const Validator = use('Validator')
const Ticket = use('App/Model/Ticket')
const RandomString = use('randomstring')
const Category = use('App/Model/Category')

const User = use ('App/Model/User')
class ManajerController {

  /**
   * Display all tickets.
   */
  * index(request, response) {
      const tickets = yield Ticket.query().where('category_id',2).where('status','open').fetch()
      const categories = yield Category.all()
      const user = yield User.all()
      yield response.sendView('manajer.ticket.index', { tickets: tickets.toJSON(), categories: categories.toJSON(),user:user.toJSON() })
  }

  * approve (request,response) {
    const user = request.currentUser

    const ticket = yield Ticket.query()
                    .where('ticket_id', request.param('ticket_id'))
                    .firstOrFail()
    ticket.status = 'Approve'
    ticket.updated_by = user.id
    yield ticket.save()

    const ticketOwner = yield ticket.user().fetch()

    // send email
    yield Mail.send('emails.ticket_status', { ticketOwner, ticket }, (message) => {
        message.to(ticketOwner.email, ticketOwner.username)
        message.from('support@localhost.dev')
        message.subject(`RE: ${ticket.title} (Ticket ID: ${ticket.ticket_id})`)
    })

    yield request.with({ status: 'The ticket has been Approve.' }).flash()
    response.redirect('back')

  }

  * sendmail (request,response) {

    yield Mail.send('emails.ticket_status', {}, (message) => {
        message.to('hatajie@gmail.com', 'ajie hatajie')
        message.from('support@localhost.dev')
        message.subject(`RE: test`)
    })

    yield request.with({ status: 'Mail Succes Send.' }).flash()
    response.redirect('back')

  }

}

module.exports = ManajerController
