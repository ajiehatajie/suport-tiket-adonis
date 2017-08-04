'use strict'

const Route = use('Route')

Route.on('/').render('home')

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
    Route.get('tickets', 'TicketsController.index');
    Route.post('close_ticket/:ticket_id', 'TicketsController.close');

    Route.get('category','CategoriesController.index')
    Route.get('category/add','CategoriesController.add')
    Route.post('category','CategoriesController.store')

    Route.get('department','DepartmentController.index')
    Route.get('department/create','DepartmentController.create')
    Route.post('department','DepartmentController.store')




    Route.get('user','AdminController.index')
    Route.get('user/create','AdminController.addUser')
    Route.post('user','AdminController.store')

}).prefix('admin').middleware(['auth', 'admin'])


Route.group('manajer', function () {
    Route.get('tickets', 'ManajerController.index');
    Route.post('approveticket/:ticket_id','ManajerController.approve')
    Route.get('sendmail','ManajerController.sendmail')
}).prefix('manajer').middleware(['auth', 'manajer'])
