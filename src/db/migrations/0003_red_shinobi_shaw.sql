
  -- Step 1: Remove the primary key constraint from the existing `id` column
  ALTER TABLE users DROP CONSTRAINT users_pkey;

  -- Step 2: Rename the existing `id` column in `users` to `old_id` to preserve the data
  ALTER TABLE users RENAME COLUMN id TO old_id;

  -- Step 3: Add a new `id` column of type `text` and set it as the primary key
  ALTER TABLE users ADD COLUMN id text;
  ALTER TABLE users ADD PRIMARY KEY (id);

  -- Step 4: Update the new `id` column with the string representation of the `old_id` column
  UPDATE users SET id = old_id::text;

  -- Step 5: Drop the `old_id` column as it's no longer needed
  ALTER TABLE users DROP COLUMN old_id;

  ALTER TABLE workouts ADD COLUMN user_id text; 
  -- Step 6: Remove the foreign key constraint from `workouts.user_id`
  ALTER TABLE workouts DROP CONSTRAINT IF EXISTS fk_user;

  -- Step 7: Alter the `user_id` column in `workouts` to type `text`
  ALTER TABLE workouts ALTER COLUMN user_id TYPE text USING user_id::text;

  -- Step 8: Add the foreign key constraint back
  ALTER TABLE workouts ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users (id);

