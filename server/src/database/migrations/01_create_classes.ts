import Knex from 'knex';

export async function up(knex: Knex){ // quais as alterações queremos fazer no banco
    return knex.schema.createTable('classes', table => {
        table.increments('id').primary();
        table.string('subject').notNullable();
        table.decimal('cost').notNullable();

        //relationship
        table.integer('user_id')
            .notNullable()
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
    });
}

export async function down(knex: Knex){ // o que fazer para alterar os erros
    return knex.schema.dropTable('classes')
}