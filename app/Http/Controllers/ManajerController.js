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

      const userLogin = request.currentUser
      var tickets;
      if (userLogin.departemen_id == 1 ) {
         tickets = yield Ticket.query()
        .where('status_approve',userLogin.departemen_id)
        .where('status','open')
        .fetch()

      } else {
         tickets = yield Ticket.query()
        .where('status_approve',userLogin.departemen_id)
        .where('status','open')
        .where('check','Y')
        .fetch()

      }

      console.log('====================================');
      console.log(userLogin.departemen_id);
      console.log('====================================');
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

    console.log(`status dari manajer ${status} `);

      if (user.departemen_id == 1) {
          ticket.status_approve = 2
      }
      else if (user.departemen_id == 2) {
          ticket.category_id = category
          if(category == 1) {//mainten

            if(status=='approve')
            {
              ticket.status ='Close'
            } else {
              ticket.status ='Reject'
            }

          } else if (category ==2) { //request new
            if(status=='approve')
            {
                ticket.status_approve = 3 //step 3 approve
                ticket.status ='Open'
            }
          }
      }
      else if (user.departemen_id == 3) {
        if(status=='approve')
        {
          ticket.status_approve = 4 //step 4
        } else {
            ticket.status ='Close'
        }

      }
      else if (user.departemen_id == 4) {
        if(status=='approve')
        {
          ticket.status_approve = 5 //step 5
        } else {
            ticket.status ='Close'
        }

      }
      else if (user.departemen_id == 5) {
        if(status=='approve')
        {
          ticket.status_approve = 5 //step 5
        } else {
            ticket.status ='Close'
        }

      }


    ticket.updated_by = user.id
    yield ticket.save()

    const ticketOwner = yield ticket.user().fetch()

    yield request.with({ status: 'The ticket has been Approve.' }).flash()
    response.redirect('/manajer/tickets')

  }
 
  *close (request,response) {
    const user = request.currentUser
    
    const ticket = yield Ticket.query()
                        .where('ticket_id', request.param('ticket_id'))
                        .firstOrFail()
    ticket.status ='Close'
    ticket.updated_by = user.id
    yield ticket.save()

    const ticketOwner = yield ticket.user().fetch()

    yield request.with({ status: 'The ticket has been Approve.' }).flash()
    response.redirect('/manajer/tickets')
    
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



  * wakil(request, response) {

      const userLogin = request.currentUser

      //department_id 1 sama dengan request new
      //department_id 2 sama dengan mainten
      const tickets = yield Ticket.query()
                        .where('status_approve',5)
                        .where('status','open')
                        .fetch()

      const categories = yield Category.all()
      const user = yield User.all()
      yield response.sendView('manajer.ticket.index', { tickets: tickets.toJSON()
        ,user:user.toJSON()
        ,userlogin:userLogin.toJSON() })
  }

  * direktur(request, response) {

      const userLogin = request.currentUser

      //department_id 1 sama dengan request new
      //department_id 2 sama dengan mainten
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

  * done (request,response) {

    const tickets_close = yield Ticket.query()
                          .where('status','Close')
                          .fetch()
    const tickets_open = yield Ticket.query()
                          .where('status','Open')
                          .fetch()
     const user = yield User.all()
    yield response.sendView('manajer.ticket.done', {user:user.toJSON(),
                            tickets_close:tickets_close.toJSON()
                            ,tickets_open:tickets_open.toJSON() })

  }

  * progress (request,response) {

    const tickets_close = yield Ticket.query()
                          .where('category_id',2)
                          .where('status','Close')
                          .fetch()
    const tickets_progress = yield Ticket.query()
                          .where('status','Open')
                          .fetch()
      const user = yield User.all()
    yield response.sendView('manajer.ticket.progress', {user:user.toJSON(),
                            tickets_close:tickets_close.toJSON()
                            ,tickets_progress:tickets_progress.toJSON() })

  }

}

module.exports = ManajerController
