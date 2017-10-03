'use strict'

const Mail = use('Mail')
const Validator = use('Validator')
const Ticket = use('App/Model/Ticket')
const RandomString = use('randomstring')
const Category = use('App/Model/Category')
const Items   = use ('App/Model/Item')
const Database = use('Database')


class TicketsController {

    /**
     * Display all tickets.
     */
    * index(request, response) {
        const tickets = yield Ticket.all()
        const categories = yield Category.all()

        yield response.sendView('tickets.index', { tickets: tickets.toJSON(), categories: categories.toJSON() })
    }

    /**
     * Display all tickets by a user.
     */
    * userTickets(request, response) {
        const tickets = yield Ticket.query().where('user_id', request.currentUser.id).fetch()
        const categories = yield Category.all()
        const tickets_mainten = yield Ticket.query()
                                .where('user_id', request.currentUser.id)
                                .where('category_id',1)
                                .fetch()
        const tickets_new = yield Ticket.query()
                                .where('user_id', request.currentUser.id)
                                .where('category_id',2)
                                .fetch()

        yield response.sendView('tickets.user_tickets', {
          tickets: tickets.toJSON(), categories: categories.toJSON(),
          mainten: tickets_mainten.toJSON(),new:tickets_new.toJSON()
         })
    }

    * ticketteknisi (request,response) {
        
        const tickets = yield Ticket.query().where('status', 'Open')
                              .where('status_approve',2)
                              .fetch()
        const categories = yield Category.all()
      
        yield response.sendView('tickets.user_tickets', {
            tickets: tickets.toJSON(), categories: categories.toJSON()
           
           })
    }
    /**
     * Show the form for opening a new ticket.
     */
    * create(request, response) {
        const categories = yield Category.pair('id', 'name')
        const items = yield Items.pair('id','name')
        //const items = yield Database.select('id','concat').from('items')
        
        console.log(items)
        yield response.sendView('tickets.create', {categories: categories,items: items})
    }

    /**
     * Store a newly created ticket in database.
     */
    * store(request, response) {
        const user = request.currentUser

        // validate form input
        const validation = yield Validator.validateAll(request.all(), {
            title: 'required',
            priority: 'required',
            message: 'required',
            items:'required'
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
        const ticket = yield Ticket.create({
            title: request.input('title'),
            user_id: user.id,
            ticket_id: RandomString.generate({ length: 10, capitalization: 'uppercase' }),
            priority: request.input('priority'),
            message: request.input('message'),
            status: "Open",
            id_item:request.input('items')
        })

        // send mail notification
        yield Mail.send('emails.ticket_info', { user, ticket }, (message) => {
            message.to(user.email, user.username)
            message.from('support@localhost.dev')
            message.subject(`[Ticket ID: ${ticket.ticket_id}] ${ticket.title}`)
        })

        yield request.with({ status: `A ticket with ID: #${ticket.ticket_id} has been opened.` }).flash()
        response.redirect('back')
    }

    /**
     * Display a specified ticket.
     */
    * show(request, response) {
        const ticket = yield Ticket.query()
                        .where('ticket_id', request.param('ticket_id'))
                        .with('user')
                        .firstOrFail()
        const comments = yield ticket.comments().with('user').fetch()
        const category = yield Category.pair('id','name')
        const Category_ticket = yield  ticket.category().fetch()
        const User = yield ticket.updated().fetch()
        const items = yield ticket.item().fetch()

      //  console.log(User);
        yield response.sendView('tickets.show', {
            ticket: ticket.toJSON(),
            comments: comments.toJSON(),
            category: category,
            category_ticket : Category_ticket,
            users:User,item:items

        })
    }

    /**
     * Close the specified ticket.
     */
    * close(request, response) {
        const ticket = yield Ticket.query()
                        .where('ticket_id', request.param('ticket_id'))
                        .firstOrFail()
        ticket.status = 'Closed'
        yield ticket.save()

        const ticketOwner = yield ticket.user().fetch()

        // send email
        yield Mail.send('emails.ticket_status', { ticketOwner, ticket }, (message) => {
            message.to(ticketOwner.email, ticketOwner.username)
            message.from('support@localhost.dev')
            message.subject(`RE: ${ticket.title} (Ticket ID: ${ticket.ticket_id})`)
        })

        yield request.with({ status: 'The ticket has been closed.' }).flash()
        response.redirect('back')
    }


    * approve (request,response) {
        const user = request.currentUser
    
        const ticket = yield Ticket.query()
                        .where('ticket_id', request.param('ticket_id'))
                        .firstOrFail()
        const status = request.input('status')
        const category = request.input('category')

        ticket.category_id = category
        console.log('====================================');
        console.log(category);
        console.log('====================================');
        ticket.check = 'Y'
        ticket.updated_by = user.id
        yield ticket.save()
    
        const ticketOwner = yield ticket.user().fetch()
    
        yield request.with({ status: 'The ticket has been Approve.' }).flash()
        response.redirect('/manajer/tickets')
    
      }
}

module.exports = TicketsController
