/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.sql(`
    CREATE TABLE IF NOT EXISTS public.organiser_profile (
        ID TEXT PRIMARY KEY,
        ORGANISER_NAME VARCHAR(150) NOT NULL,
        FIRST_NAME VARCHAR(50) NOT NULL,
        LAST_NAME VARCHAR(50) NOT NULL,
        DESCRIPTION TEXT NOT NULL,
        LOCATION VARCHAR(150),
        LOGO_IMAGE VARCHAR(150) NOT NULL,
        BANNER_IMAGE VARCHAR(150),
        PUBLIC_EMAIL VARCHAR(150),
        WEBSITE_URL VARCHAR(150),
        SOCIAL_LINKS JSONB,
        USER_ID UUID NOT NULL,
        CREATED_AT TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT organiser_profile_user_id_fkey FOREIGN KEY (USER_ID) REFERENCES auth.users(id) ON DELETE CASCADE
    );
    `)
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.sql(`
        DROP TABLE IF EXISTS public.organiser_profile CASCADE;
    `)
};
