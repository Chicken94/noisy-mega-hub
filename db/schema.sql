-- Noisy Mega Hub schema. Safe to run many times.
create table if not exists users (
  id serial primary key,
  email text unique not null,
  name text not null default '',
  role text not null check (role in ('admin','team','client')),
  created_at timestamptz not null default now()
);
create table if not exists clients (
  id serial primary key,
  slug text unique not null,
  name text not null,
  short text not null default '',
  sort int not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists memberships (
  user_id int not null references users(id) on delete cascade,
  client_id int not null references clients(id) on delete cascade,
  primary key (user_id, client_id)
);
create table if not exists projects (
  id serial primary key,
  client_id int not null references clients(id) on delete cascade,
  slug text not null,
  title text not null,
  kind text not null default 'Revisions',
  brief text not null default '',
  links jsonb not null default '[]',
  sort int not null default 0,
  archived boolean not null default false,
  created_at timestamptz not null default now(),
  unique (client_id, slug)
);
create table if not exists tasks (
  id serial primary key,
  project_id int not null references projects(id) on delete cascade,
  ext_key text,
  group_title text not null default '',
  title text not null,
  detail text not null default '',
  assignee text not null default '',
  done boolean not null default false,
  done_at timestamptz,
  done_by int references users(id) on delete set null,
  sort int not null default 0,
  unique (project_id, ext_key)
);
create table if not exists assets (
  id serial primary key,
  project_id int not null references projects(id) on delete cascade,
  caption text not null default '',
  mime text not null,
  data bytea not null,
  sort int not null default 0
);
create table if not exists sessions (
  token_hash text primary key,
  user_id int not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null
);
create table if not exists invites (
  token_hash text primary key,
  user_id int not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  used_at timestamptz
);
create index if not exists tasks_project on tasks(project_id);
create index if not exists assets_project on assets(project_id);
