-- Create exec_sql function to run arbitrary SQL
create or replace function exec_sql(sql_query text)
returns void
language plpgsql
security definer
as $$
begin
  execute sql_query;
end;
$$;
