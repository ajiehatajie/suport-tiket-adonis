'use strict'
const Mail = use('Mail')
const Validator = use('Validator')
const Ticket = use('App/Model/Ticket')
const RandomString = use('randomstring')
const Category = use('App/Model/Category')
const Items   = use ('App/Model/Item')


class DashboardController {


  * index (request,response) {
    const userLogin = request.currentUser
  ;
    if(userLogin.is_admin == 0 ){ //buat user
      const tickets_mainten = yield Ticket.query()
                              .where('user_id', request.currentUser.id)
                              .where('category_id',1)
                              .fetch()
      const tickets_new = yield Ticket.query()
                              .where('user_id', request.currentUser.id)
                              .where('category_id',2)
                              .fetch()
     yield response.sendView('dashboard.user', {
            mainten: tickets_mainten.toJSON(),new:tickets_new.toJSON()
                               })

    } else if (userLogin.is_admin == 1) { //buat admin
      const tickets_mainten = yield Ticket.query()
                              .whereIn('status_approve',[7,2,4])
                              .where('status','open')
                              .fetch()
      const tickets_new = yield Ticket.query()
                            .where('category_id',2)
                            .where('status','Close')
                            .fetch()

    console.log(request.currentUser.id);
     yield response.sendView('dashboard.admin', {
            mainten: tickets_mainten.toJSON(),new:tickets_new.toJSON()

            })

    }else if (userLogin.is_admin == 2) {
      const tickets_mainten = yield Ticket.query()
                              .where('status_approve',userLogin.departemen_id)
                              .where('status','open')
                              .fetch()
      const tickets_new = yield Ticket.query()
                            .where('category_id',2)
                            .where('status','Close')
                            .fetch()

    console.log(request.currentUser.id);
     yield response.sendView('dashboard.manajer', {
            mainten: tickets_mainten.toJSON(),new:tickets_new.toJSON()

            })

    }
      else if (userLogin.is_admin == 3) { //buat wakil
        const tickets_mainten = yield Ticket.query()
                                .where('status_approve',5)
                                .where('status','open')
                                .fetch()
        const tickets_new = yield Ticket.query()
                            
                              .where('status','Close')
                              .fetch()
      console.log(tickets_mainten);
      console.log(request.currentUser.id);
       yield response.sendView('dashboard.wakil', {
              mainten: tickets_mainten.toJSON(),new:tickets_new.toJSON()

              })
    } else if (userLogin.is_admin == 4) { //buat direktur
      const tickets_mainten = yield Ticket.query()
                              .where('status_approve',6)
                              .where('status','open')
                              .fetch()
      const tickets_new = yield Ticket.query()
                            
                            .where('status','Close')
                            .fetch()

    console.log(request.currentUser.id);
     yield response.sendView('dashboard.direktur', {
            mainten: tickets_mainten.toJSON(),new:tickets_new.toJSON()

            })
    }

  }
}

module.exports = DashboardController
