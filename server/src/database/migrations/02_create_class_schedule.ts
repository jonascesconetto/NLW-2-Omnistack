import Knex from 'knex';

export async function up(knex: Knex){ // quais as alterações queremos fazer no banco
    return knex.schema.createTable('class_schedule', table => {
        table.increments('id').primary();
       
        table.integer('week_day').notNullable();
        table.integer('from').notNullable();
        table.integer('to').notNullable();

        //relationship
        table.integer('class_id')
            .notNullable()
            .references('id')
            .inTable('classes')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
    });
}

export async function down(knex: Knex){ // o que fazer para alterar os erros
    return knex.schema.dropTable('class-schedule')
}