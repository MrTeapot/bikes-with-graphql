const { PgLiteral } = require("node-pg-migrate");

exports.up = pgm => {
  pgm.createTable("officers", {
    id: {
      type: "uuid",
      default: new PgLiteral("uuid_generate_v4()"),
      notNull: true,
      primaryKey: true
    },
    first_name: {
      type: "varchar(320)",
      notNull: true
    },
    last_name: {
      type: "varchar(320)",
      notNull: true
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp")
    },
    deleted_at: {
      type: "timestamp",
      notNull: false
    }
  });

};

exports.down = pgm => { 
  pgm.dropTable("officers");
};
