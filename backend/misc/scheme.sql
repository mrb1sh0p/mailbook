CREATE TABLE
  smtp_config (
    id uuid NOT NULL DEFAULT gen_random_uuid () CONSTRAINT pk_smtp PRIMARY KEY,
    tittle TEXT NOT NULL,
    host TEXT NOT NULL,
    port INTEGER NOT NULL,
    secure BOOLEAN NOT NULL,
    username TEXT NOT NULL,
    pass TEXT NOT NULL,
    utc_created_on TIMESTAMP NOT NULL CONSTRAINT df_smtp_utc_created_on DEFAULT now ()
  );