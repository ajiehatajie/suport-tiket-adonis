'use strict'

const Schema = use('Schema')

class DepartementTableSchema extends Schema {

  up () {
    this.create('departments', (table) => {
        table.increments()
        table.string('name').notNullable().unique()
        table.timestamps()
    })

  }

  down () {
    this.drop('departments')
  }

}

module.exports = DepartementTableSchema
