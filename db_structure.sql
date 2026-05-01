create table public.djolof_orders (
  id serial not null,
  customer_name character varying(100) not null,
  customer_phone character varying(20) not null,
  customer_quartier character varying(100) not null,
  items text not null,
  total_price integer not null,
  delivery_fee integer not null default 10000,
  final_total integer not null,
  status character varying(20) not null default 'en_cuisine'::character varying,
  motard_phone character varying(20) null,
  delivered_at timestamp without time zone null,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  reference character varying(20) null,
  constraint djolof_orders_id_key unique (id),
  constraint djolof_orders_reference_key unique (reference)
) TABLESPACE pg_default;

create index IF not exists idx_djolof_orders_phone on public.djolof_orders using btree (customer_phone) TABLESPACE pg_default;

create index IF not exists idx_djolof_orders_status on public.djolof_orders using btree (status) TABLESPACE pg_default;

create index IF not exists idx_djolof_orders_created on public.djolof_orders using btree (created_at) TABLESPACE pg_default;

create index IF not exists idx_orders_status on public.djolof_orders using btree (status) TABLESPACE pg_default;

create index IF not exists idx_orders_created_at on public.djolof_orders using btree (created_at desc) TABLESPACE pg_default;

create index IF not exists idx_orders_phone on public.djolof_orders using btree (customer_phone) TABLESPACE pg_default;

create index IF not exists idx_djolof_orders_reference on public.djolof_orders using btree (reference) TABLESPACE pg_default;

CREATE SEQUENCE IF NOT EXISTS order_ref_seq START 1001;

CREATE OR REPLACE FUNCTION generate_order_reference()
RETURNS TRIGGER AS $$
BEGIN
  NEW.reference := 'DC-' || LPAD(nextval('order_ref_seq')::TEXT, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trigger_generate_order_reference'
  ) THEN
    CREATE TRIGGER trigger_generate_order_reference
      BEFORE INSERT ON djolof_orders
      FOR EACH ROW
      EXECUTE FUNCTION generate_order_reference();
  END IF;
END $$;


create table public.djolof_menus (
  id serial not null,
  category character varying(50) not null,
  name character varying(100) not null,
  description text null,
  price integer not null,
  image_url text null,
  is_available boolean not null default true,
  display_order integer not null default 0,
  created_at timestamp without time zone not null default now(),
  updated_at timestamp without time zone not null default now(),
  constraint djolof_menus_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists idx_menus_category on public.djolof_menus using btree (category) TABLESPACE pg_default;

create index IF not exists idx_menus_is_available on public.djolof_menus using btree (is_available) TABLESPACE pg_default;

create index IF not exists idx_menus_display_order on public.djolof_menus using btree (display_order) TABLESPACE pg_default;