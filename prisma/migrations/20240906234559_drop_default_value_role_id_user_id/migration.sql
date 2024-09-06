-- This is an empty migration.

ALTER TABLE user_roles alter column user_id drop default;
alter table user_roles alter column role_id drop default;
alter table path_allowed alter column role_id drop default;
