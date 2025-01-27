-- Function to add trade_category column if it doesn't exist
create or replace function add_trade_category_column()
returns void
language plpgsql
security definer
as $$
begin
    -- Check if column exists
    if not exists (
        select 1
        from information_schema.columns
        where table_name = 'posts'
        and column_name = 'trade_category'
    ) then
        -- Add the column
        execute 'alter table posts add column trade_category text';
    end if;
end;
$$;
