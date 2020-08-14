import Knex from 'knex';

export async function up(knex: Knex){ // quais as alterações queremos fazer no banco
    return knex.schema.createTable('connections', table => {
        table.increments('id').primary();

        //relationship
        table.integer('user_id')
            .notNullable()
            .references('id')
            .inTable('users')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');

        table.timestamp('created_at')
            .defaultTo(knex.raw('CURRENT_TIMESTAMP'))
            .notNullable();
    });
}

export async function down(knex: Knex){ // o que fazer para alterar os erros
    return knex.schema.dropTable('class-schedule')
}