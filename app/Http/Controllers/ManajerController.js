'use strict'

const Mail = use('Mail')
const Validator = use('Validator')
const Ticket = use('App/Model/Ticket')
const RandomString = use('randomstring')
const Category = use('App/Model/Category')


class ManajerController {

  /**
   * Display all tickets.
   */
  * index(request, response) {
      const tickets = yield Ticket.query().where('category_id',2).fetch()
      const categories = yield Category.all()

      yield response.sendView('tickets.index', { tickets: tickets.toJSON(), categories: categories.toJSON() })
  }

}

module.exports = ManajerController
