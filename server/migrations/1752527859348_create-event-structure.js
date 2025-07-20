/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const up = (pgm) => {
  pgm.createTable('event', {
      id: { type: 'varchar(36)', primaryKey: true },
      title: { type: 'varchar(255)', notNull: true },
      description: { type: 'varchar(1000)', notNull: true },
      date: { type: 'timestamptz', notNull: true },
      location: { type: 'varchar(255)', notNull: true },
      organiser_id: {
          type: 'varchar(36)',
          notNull: true,
          references: '"organiser_profile"(id)',
          onDelete: 'CASCADE',
      },
      created_At: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  });

  pgm.createTable('ticket_type', {
      id: { type: 'varchar(36)', primaryKey: true },
      event_id: {
          type: 'varchar(36)',
          notNull: true,
          references: '"event"(id)',
          onDelete: 'CASCADE',
      },
      name: { type: 'varchar(100)', notNull: true },
      price: { type: 'integer', notNull: true },
      quantity: { type: 'integer', notNull: true },
  });

  pgm.createTable('purchase', {
      id: { type: 'varchar(36)', primaryKey: true },
      ticket_type_id: {
          type: 'varchar(36)',
          notNull: true,
          references: 'Ticket_Type(id)',
          onDelete: 'CASCADE',
      },
      total_Amount: { type: 'integer', notNull: true },
      created_At: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
  });

  pgm.createTable('purchase_item', {
      id: { type: 'varchar(36)', primaryKey: true },
      purchase_id: {
          type: 'varchar(36)',
          notNull: true,
          references: 'purchase(id)',
          onDelete: 'CASCADE',
      },
      ticket_Type_id: {
          type: 'varchar(36)',
          notNull: true,
          references: 'Ticket_Type(id)',
          onDelete: 'RESTRICT',
      },
      quantity: { type: 'integer', notNull: true },
      amount: { type: 'integer', notNull: true },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
export const down = (pgm) => {
  pgm.dropTable('purchase_item');
  pgm.dropTable('purchase');
  pgm.dropTable('ticket_type');
  pgm.dropTable('event');
};