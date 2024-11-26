create table if not exists conditions
(
    id            uuid         not null
        primary key,
    text_to_apply varchar(255) not null,
    currency      varchar(255) not null
        constraint conditions_currency_check
            check ((currency)::text = ANY
                   ((ARRAY ['TEXT_CONTAINS'::character varying, 'TEXT_EQUALS'::character varying])::text[]))
);

create table if not exists users
(
    id                      uuid         not null
        primary key,
    email                   varchar(255) not null
        constraint uk_6dotkott2kjsp8vw4d0m25fb7
            unique,
    last_logged_in_space_id uuid,
    username                varchar(255) not null
);

create table if not exists spaces
(
    id               uuid         not null
        primary key,
    created_date     timestamp(6) not null,
    name             varchar(255) not null,
    primary_currency varchar(255) not null
        constraint spaces_primary_currency_check
            check ((primary_currency)::text = ANY
                   ((ARRAY ['UAH'::character varying, 'USD'::character varying, 'EUR'::character varying])::text[])),
    updated_date     timestamp(6) not null,
    user_id          uuid         not null
        constraint fkc4cyrgg51cc6bvydhe0xpd7cy
            references users
);

create table if not exists accounts
(
    id           uuid           not null
        primary key,
    balance      numeric(38, 2) not null,
    created_date timestamp(6)   not null,
    currency     varchar(255)   not null
        constraint accounts_currency_check
            check ((currency)::text = ANY
                   ((ARRAY ['UAH'::character varying, 'USD'::character varying, 'EUR'::character varying])::text[])),
    is_default   boolean,
    description  varchar(255),
    mono_bank_id varchar(255),
    name         varchar(255)   not null,
    type         varchar(255)   not null
        constraint accounts_type_check
            check ((type)::text = ANY
                   ((ARRAY ['BANK_ACCOUNTS'::character varying, 'CASH'::character varying, 'STOCKS_CRYPTO'::character varying, 'OTHER_ASSETS'::character varying])::text[])),
    space_id     uuid           not null
        constraint fkrwujy17i75ghmhwgnyqmuql06
            references spaces
);

create table if not exists account_balance_history
(
    id         uuid           not null
        primary key,
    balance    numeric(38, 2) not null,
    date       date           not null,
    account_id uuid
        constraint fk2baa7nokb3qephvu1gqyent9k
            references accounts
);

create index if not exists idx_account_space_id
    on accounts (space_id, mono_bank_id);

create index if not exists idx_account_space_id_type_balance
    on accounts (space_id, type, balance);

create table if not exists categories
(
    id        uuid         not null
        primary key,
    icon      varchar(255) not null,
    name      varchar(255) not null,
    parent_id uuid,
    position  integer      not null,
    type      varchar(255) not null
        constraint categories_type_check
            check ((type)::text = ANY ((ARRAY ['EXPENSE'::character varying, 'INCOME'::character varying])::text[])),
    space_id  uuid         not null
        constraint fkj5t0d1np3ejgledbpb1tbb3c5
            references spaces
);

create index if not exists idx_category_space_id_type
    on categories (space_id, type);

create table if not exists mono_bank_info
(
    id        uuid         not null
        primary key,
    client_id varchar(255) not null,
    token     varchar(255) not null,
    space_id  uuid         not null
        constraint uk_cd7okjlylnxilx8spw06etal0
            unique
        constraint fk5qgqxlb1u8311hlo5om87y5a3
            references spaces
);

create table if not exists rules
(
    id                               uuid not null
        primary key,
    assign_category_id               uuid
        constraint fkd9wjkdfox1oewxro3o3v5mgue
            references categories,
    condition_id                     uuid not null
        constraint uk_oro7ikeq8olnp5ggcwkuvwv7i
            unique
        constraint fkblvetsjirysmd050jeqkarwtp
            references conditions,
    mark_as_transfer_to_account_id   uuid
        constraint fkd01uo7n9hp8qmwmsc7wrb1ly3
            references accounts,
    space_id                         uuid not null
        constraint fk8sd403jr7fg34xu9ggevhdld8
            references spaces,
    mark_as_transfer_from_account_id uuid
        constraint fk5ktysg4o40sp297jsqggaxd7h
            references accounts
);

create table if not exists transactions
(
    id              uuid           not null
        primary key,
    amount          numeric(38, 2) not null,
    created_date    timestamp(6)   not null,
    currency        varchar(255)   not null
        constraint transactions_currency_check
            check ((currency)::text = ANY
                   ((ARRAY ['UAH'::character varying, 'USD'::character varying, 'EUR'::character varying])::text[])),
    date            timestamp(6)   not null,
    mono_bank_id    varchar(255),
    name            varchar(255)   not null,
    notes           varchar(255),
    type            varchar(255)   not null
        constraint transactions_type_check
            check ((type)::text = ANY
                   ((ARRAY ['EXPENSE'::character varying, 'INCOME'::character varying, 'TRANSFER'::character varying])::text[])),
    category_id     uuid
        constraint fksqqi7sneo04kast0o138h19mv
            references categories,
    account_id      uuid           not null
        constraint fk7i7kboanveneetad7jyhbr0a7
            references accounts,
    to_account_id   uuid
        constraint fkra0an432c5wjo76mojluk0v28
            references accounts,
    from_account_id uuid
);

create index if not exists idx_transaction_account_id
    on transactions (account_id, category_id, mono_bank_id);

create index if not exists idx_transaction_date
    on transactions (date, account_id);
