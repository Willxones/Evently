/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.sql(`
    CREATE TABLE IF NOT EXISTS public.event (
        ID TEXT PRIMARY KEY,
        TITLE VARCHAR(255) NOT NULL,
        DESCRIPTION VARCHAR(1000) NOT NULL,
        DATE TIMESTAMPTZ NOT NULL,
        LOCATION VARCHAR(255) NOT NULL,
        ORGANISER_ID TEXT NOT NULL,
        CREATED_AT TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT event_organiser_id_fkey FOREIGN KEY (ORGANISER_ID) REFERENCES organiser_profile(ID) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS public.ticket_type (
        ID TEXT PRIMARY KEY,
        EVENT_ID TEXT NOT NULL,
        NAME VARCHAR(100) NOT NULL,
        PRICE INTEGER NOT NULL,
        QUANTITY INTEGER NOT NULL,

        CONSTRAINT ticket_type_event_id_fkey FOREIGN KEY (EVENT_ID) REFERENCES event(ID) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS public.purchase (
        ID TEXT PRIMARY KEY,
        TICKET_TYPE_ID TEXT NOT NULL,
        TOTAL_AMOUNT INTEGER NOT NULL,
        CREATED_AT TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT purchase_ticket_type_id_fkey FOREIGN KEY (TICKET_TYPE_ID) REFERENCES ticket_type(ID) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS public.purchase_item (
        ID TEXT PRIMARY KEY,
        PURCHASE_ID TEXT NOT NULL,
        TICKET_TYPE_ID TEXT NOT NULL,
        QUANTITY INTEGER NOT NULL,
        AMOUNT INTEGER NOT NULL,

        CONSTRAINT purchase_item_purchase_id_fkey FOREIGN KEY (PURCHASE_ID) REFERENCES purchase(ID) ON DELETE CASCADE,
        CONSTRAINT purchase_item_ticket_type_id_fkey FOREIGN KEY (TICKET_TYPE_ID) REFERENCES ticket_type(ID) ON DELETE RESTRICT
    );
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.sql(`
    DROP TABLE IF EXISTS public.purchase_item CASCADE;
    DROP TABLE IF EXISTS public.purchase CASCADE;
    DROP TABLE IF EXISTS public.ticket_type CASCADE;
    DROP TABLE IF EXISTS public.event CASCADE;
  `);
};