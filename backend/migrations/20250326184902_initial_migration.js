export function up(knex) {
  return knex.raw(`
    CREATE TYPE user_role AS ENUM ('overlord', 'user');

    CREATE TYPE user_role_is_orgs AS ENUM ('admin', 'user');

    CREATE TABLE orgs (
        id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        address TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        cnpj TEXT UNIQUE,
        utc_created_on TIMESTAMP NOT NULL DEFAULT now()
    );

    CREATE TABLE smtp_config (
        id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
        title TEXT NOT NULL,
        host TEXT NOT NULL,
        port INTEGER NOT NULL,
        secure BOOLEAN NOT NULL,
        username TEXT NOT NULL,
        pass TEXT NOT NULL,
        org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
        utc_created_on TIMESTAMP NOT NULL DEFAULT now()
    );

    CREATE TABLE users (
        id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        cpf TEXT NOT NULL UNIQUE,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        role user_role NOT NULL DEFAULT 'user',
        utc_created_on TIMESTAMP NOT NULL DEFAULT now()
    );

    CREATE TABLE email_model (
        id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
        utc_created_on TIMESTAMP NOT NULL DEFAULT now()
    );

    CREATE TABLE user_is_orgs (
        id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
        role user_role_is_orgs NOT NULL DEFAULT 'user',
        utc_created_on TIMESTAMP NOT NULL DEFAULT now()
    );

    CREATE TABLE mails (
        id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
        org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
        subject TEXT NOT NULL,
        body TEXT NOT NULL,
        utc_created_on TIMESTAMP NOT NULL DEFAULT now()
    );

    CREATE TABLE mail_attachments (
        id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
        mail_id UUID NOT NULL REFERENCES mails(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        path TEXT NOT NULL,
        utc_created_on TIMESTAMP NOT NULL DEFAULT now()
    );

    CREATE TABLE events (
        id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
        org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        utc_created_on TIMESTAMP NOT NULL DEFAULT now()
    );

    `);
}
export function down(knex) {
  return knex.raw(`
    DROP TABLE IF EXISTS mail_attachments CASCADE;
    DROP TABLE IF EXISTS mails CASCADE;
    DROP TABLE IF EXISTS events CASCADE;
    DROP TABLE IF EXISTS user_is_orgs CASCADE;
    DROP TABLE IF EXISTS email_model CASCADE;
    DROP TABLE IF EXISTS smtp_config CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
    DROP TABLE IF EXISTS orgs CASCADE;
    
    DROP TYPE IF EXISTS user_role_is_orgs;
    DROP TYPE IF EXISTS user_role;
  `);
}
