DROP SCHEMA IF EXISTS sirin CASCADE;
CREATE SCHEMA sirin;

CREATE TABLE sirin.users(
	user_id varchar NOT NULL,
	email varchar NOT NULL,
	password_hash varchar NOT NULL,
	CONSTRAINT user_id_pk PRIMARY KEY (user_id, email)
);
CREATE TABLE sirin.repos(
	repo_id varchar NOT NULL,
	repo_name varchar NOT NULL,
	repo_owner varchar NOT NULL,
	repo_url varchar NOT NULL,
	stars integer NOT NULL DEFAULT 0,
	forks integer NOT NULL DEFAULT 0,
	issues integer NOT NULL DEFAULT 0,
	created timestamptz NOT NULL,
	CONSTRAINT repo_id_pk PRIMARY KEY (repo_id)
);
CREATE TABLE sirin.users_repos(
	repo_id varchar NOT NULL,
	user_id varchar NOT NULL
);