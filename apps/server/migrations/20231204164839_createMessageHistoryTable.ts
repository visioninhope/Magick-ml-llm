import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('chatMessages', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('agentId').unsigned().notNullable();
    table.foreign('agentId').references('id').inTable('agents');
    table.string('sender').notNullable();
    table.string('connector').notNullable();
    table.string('content').notNullable();
    table.string('coversation_id');
    table.timestamps(true, true);
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('chatMessages');
}

