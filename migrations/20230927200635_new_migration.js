exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable("users", function (table) {
      table.increments("id");
      table.string("username", 255).notNullable();
      table.string("password", 255).notNullable();
    }),
    knex.schema.createTable("notes", function (table) {
      table.increments("id");
      table.string("title").notNullable();
      table.text("text").notNullable();
      table.boolean("isArchived").notNullable().defaultTo(false);
      table.timestamp("createdAt").defaultTo(knex.fn.now());
      table.integer("owner_id").unsigned();
      table.foreign("owner_id").references("id").inTable("users");
    }),
  ]);
};

exports.down = function (knex) {
  return Promise.all([knex.shema.dropTable("users"), knex.shema.dropTable("timers")]);
};
