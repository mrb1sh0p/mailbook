CREATE TYPE user_role AS ENUM ('overlord', 'user');

CREATE TYPE user_role_is_orgs AS ENUM ('admin', 'user');

CREATE TABLE
  orgs (
    id uuid NOT NULL DEFAULT gen_random_uuid () CONSTRAINT pk_orgs PRIMARY KEY,
    name TEXT NOT NULL,
    utc_created_on TIMESTAMP NOT NULL CONSTRAINT df_orgs_utc_created_on DEFAULT now ()
  );

CREATE TABLE
  smtp_config (
    id uuid NOT NULL DEFAULT gen_random_uuid () CONSTRAINT pk_smtp PRIMARY KEY,
    title TEXT NOT NULL,
    host TEXT NOT NULL,
    port INTEGER NOT NULL,
    secure TEXT NOT NULL,
    username TEXT NOT NULL,
    pass TEXT NOT NULL,
    org_id uuid NOT NULL CONSTRAINT fk_smtp_org_id REFERENCES orgs (id),
    utc_created_on TIMESTAMP NOT NULL CONSTRAINT df_smtp_utc_created_on DEFAULT now ()
  );

CREATE TABLE
  users (
    id uuid NOT NULL DEFAULT gen_random_uuid () CONSTRAINT pk_users PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    role user_role NOT NULL CONSTRAINT df_users_role DEFAULT 'user',
    utc_created_on TIMESTAMP NOT NULL CONSTRAINT df_users_utc_created_on DEFAULT now ()
  );

CREATE TABLE
  email_model (
    id uuid NOT NULL DEFAULT gen_random_uuid () CONSTRAINT pk_email_model PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    utc_created_on TIMESTAMP NOT NULL CONSTRAINT df_email_model_utc_created_on DEFAULT now (),
    org_id uuid NOT NULL CONSTRAINT fk_email_model_org_id REFERENCES orgs (id)
  );

CREATE TABLE
  user_is_orgs (
    id uuid NOT NULL DEFAULT gen_random_uuid () CONSTRAINT pk_user_is_orgs PRIMARY KEY,
    user_id uuid NOT NULL,
    org_id uuid NOT NULL,
    role user_role_is_orgs NOT NULL CONSTRAINT df_user_is_orgs_role DEFAULT 'user',
    utc_created_on TIMESTAMP NOT NULL CONSTRAINT df_user_is_orgs_utc_created_on DEFAULT now (),
    CONSTRAINT fk_user_is_orgs_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_user_is_orgs_org_id FOREIGN KEY (org_id) REFERENCES orgs (id)
  );

CREATE TABLE
  mails (
    id uuid NOT NULL DEFAULT gen_random_uuid () CONSTRAINT pk_mails PRIMARY KEY,
    org_id uuid NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    utc_created_on TIMESTAMP NOT NULL CONSTRAINT df_mails_utc_created_on DEFAULT now (),
    CONSTRAINT fk_mails_org_id FOREIGN KEY (org_id) REFERENCES orgs (id)
  );

CREATE TABLE
  mail_attachments (
    id uuid NOT NULL DEFAULT gen_random_uuid () CONSTRAINT pk_mail_attachments PRIMARY KEY,
    mail_id uuid NOT NULL,
    name TEXT NOT NULL,
    path TEXT NOT NULL,
    utc_created_on TIMESTAMP NOT NULL CONSTRAINT df_mail_attachments_utc_created_on DEFAULT now (),
    CONSTRAINT fk_mail_attachments_mail_id FOREIGN KEY (mail_id) REFERENCES mails (id)
  );

CREATE TABLE
  events (
    id uuid NOT NULL DEFAULT gen_random_uuid () CONSTRAINT pk_events PRIMARY KEY,
    org_id uuid NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    utc_created_on TIMESTAMP NOT NULL CONSTRAINT df_events_utc_created_on DEFAULT now (),
    CONSTRAINT fk_events_org_id FOREIGN KEY (org_id) REFERENCES orgs (id)
  );