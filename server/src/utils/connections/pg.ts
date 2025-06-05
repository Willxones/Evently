import { Pool } from 'pg';

const pool = new Pool({
    host: 'host.docker.internal',
    user: 'postgres',
    password: 'postgres',
    database: 'postgres',
    port: 54322,
    idleTimeoutMillis: 30000, // 30 seconds
    connectionTimeoutMillis: 2000, // 2 seconds
});

export { pool };
