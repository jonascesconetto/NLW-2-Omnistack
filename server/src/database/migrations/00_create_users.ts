import Knex from 'knex';

export async function up(knex: Knex){ // quais as alterações queremos fazer no banco
    return knex.schema.createTable('users', table => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table.string('avatar').notNullable();
        table.string('whatsapp').notNullable();
        table.string('bio').notNullable();
    })
}

export async function down(knex: Knex){ // o que fazer para alterar os erros
    return knex.schema.dropTable('users')
}