const { PgLiteral } = require("node-pg-migrate");

exports.up = async pgm => {
  await pgm.createTable("cases", {
    id: {
      type: "uuid",
      default: new PgLiteral("uuid_generate_v4()"),
      notNull: true,
      primaryKey: true
    },
    status: {
      type: "varchar(12)",
      notNull: true,
      default: 'NEW'
    },
    description: {
      type: "varchar",
      notNull: true
    },
    officer: {
      type: "uuid",
      notNull: false,
      onDelete: 'RESTRICT',
      references: {
        name: 'officers'
      }
    },
    deleted_at: {
      type: "timestamp",
      notNull: false
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

  await pgm.addConstraint('cases', 'allowed_statuses', "CHECK (status IN ('NEW', 'ASSIGNED', 'RESOLVED') )");
  
  // Make sure that an officer can only have one case that is not deleted and not resolved
  pgm.createIndex('cases', ['officer'], {
    name: 'IX-one_case_per_officer',
    where: "deleted_at IS NULL AND status <> 'RESOLVED'",
    unique: true
  });
};

exports.down = pgm => {
  pgm.dropTable("cases");
};
