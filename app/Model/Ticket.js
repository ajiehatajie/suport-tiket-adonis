'use strict'

const Lucid = use('Lucid')

class Ticket extends Lucid {

    /**
     * A ticket belongs to a category
     */
    category() {
        return this.belongsTo('App/Model/Category')
    }

    /**
     * A ticket can have many comments
     */
    comments() {
        return this.hasMany('App/Model/Comment')
    }

    /**
     * A ticket belongs to a user
     */
    user() {
        return this.belongsTo('App/Model/User')
    }

    item() {
        return this.belongsTo('App/Model/Item','id','id_item')
    }

    updated() {
      return this.belongsTo('App/Model/User','id','updated_by' )
    }
}

module.exports = Ticket
