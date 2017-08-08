'use strict'

const Schema = use('Schema')

class CreateTableItemsTableSchema extends Schema {

  up () {
    this.create('items', (table) => {
        table.increments()
        table.string('name').notNullable().unique()
        table.text('desc')
        table.string('room')
        table.string('vendor')
        table.text('notes')
        table.timestamps()
    })
  }

  down () {
    this.drop('items')
  }

}

module.exports = CreateTableItemsTableSchema
