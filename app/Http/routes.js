'use strict'

const Route = use('Route')

Route.get('/','DashboardController.index').middleware('auth')

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/
//Route.get('register', 'AuthController.showRegisterPage')
//Route.post('register', 'AuthController.register')
Route.get('login', 'AuthController.showLoginPage')
Route.post('login', 'AuthController.login')
Route.get('logout', 'AuthController.logout')

/*
|--------------------------------------------------------------------------
| Tickets Routes
|--------------------------------------------------------------------------
*/
Route.get('new_ticket', 'TicketsController.create').middleware('auth')
Route.post('new_ticket', 'TicketsController.store').middleware('auth')
Route.get('tickets/:ticket_id', 'TicketsController.show').middleware('auth')
Route.get('my_tickets', 'TicketsController.userTickets').middleware('auth')

Route.get('ticket_teknisi', 'TicketsController.ticketteknisi').middleware('auth')
Route.post('approveticket/:ticket_id','TicketsController.approve').middleware('auth')



Route.post('comment', 'CommentsController.postComment')
Route.get('test','CategoriesController.test')
/*
|--------------------------------------------------------------------------
| Tickets Routes
|--------------------------------------------------------------------------
*/
Route.group('admin', function () {
    Route.get('/','AdminController.index')
    Route.get('dashboard','AdminController.index').as('admin')
    //Route.get('ticket', 'TicketsController.index');
    Route.get('ticket', 'AdminController.ticket_wait');
    Route.get('tickets/:ticket_id', 'AdminController.show')
    Route.post('done/:ticket_id','AdminController.ticket_done')
    Route.post('approveticket/:ticket_id','AdminController.approve')
    
    Route.post('close_ticket/:ticket_id', 'TicketsController.close');


    Route.get('category','CategoriesController.index')
    Route.get('category/add','CategoriesController.add')
    Route.post('category','CategoriesController.store')

    Route.get('department','DepartmentController.index')
    Route.get('department/create','DepartmentController.create')
    Route.post('department','DepartmentController.store')

    Route.get('items','ItemsController.index')
    Route.get('items/create','ItemsController.create')
    Route.post('items','ItemsController.store')
    Route.get('items/edit/:item_id','ItemsController.edit')
    Route.get('items/detail/:item_id','ItemsController.show')


    Route.get('user','AdminController.index')
    Route.get('user/create','AdminController.addUser')
    Route.post('user','AdminController.store')

    Route.get('report','AdminController.report')
    Route.post('report','AdminController.report')
    Route.get('report/detail/:ticket_id', 'AdminController.reportdetail')
    

}).prefix('admin').middleware(['auth', 'admin'])


Route.group('manajer', function () {
    Route.get('tickets', 'ManajerController.index');
    Route.get('tickets/done', 'ManajerController.done');
    Route.get('tickets/progress', 'ManajerController.progress');


    Route.post('approveticket/:ticket_id','ManajerController.approve')
    Route.post('approveipsrs/:ticket_id','ManajerController.approveipsrs')
    Route.post('approvert/:ticket_id','ManajerController.approvert')
    
    
    Route.post('closeticket/:ticket_id','ManajerController.close')
    
    Route.get('sendmail','ManajerController.sendmail')
}).prefix('manajer').middleware(['auth', 'manajer'])

Route.group('superadmin', function () {
    Route.get('tickets', 'WakilController.index');
    Route.post('approveticket/:ticket_id','WakilController.approve')
    Route.get('tickets/progress', 'ManajerController.progress');
    Route.get('tickets/done', 'ManajerController.done');

}).prefix('superadmin').middleware(['auth', 'wakil'])


Route.group('direktur', function () {
    Route.get('tickets', 'DirekturController.index');
    Route.post('approveticket/:ticket_id','DirekturController.approve')
    Route.get('tickets/progress', 'ManajerController.progress');
    Route.get('tickets/done', 'ManajerController.done');

}).prefix('direktur').middleware(['auth', 'direktur'])
