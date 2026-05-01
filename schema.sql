-- ============================================
-- Djolof Chicken - Structure réelle de la BDD
-- Exécuter dans l'éditeur SQL de Supabase
-- ============================================

-- 1. Désactiver RLS le temps du setup
ALTER TABLE IF EXISTS public.djolof_orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.djolof_menus DISABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.djolof_orders (
  id SERIAL NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_quartier VARCHAR(100) NOT NULL,
  items TEXT NOT NULL,
  total_price INTEGER NOT NULL,
  delivery_fee INTEGER NOT NULL DEFAULT 10000,
  final_total INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'en_cuisine',
  motard_phone VARCHAR(20) NULL,
  delivered_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  reference VARCHAR(20) NULL,
  CONSTRAINT djolof_orders_id_key UNIQUE (id),
  CONSTRAINT djolof_orders_reference_key UNIQUE (reference)
);

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

CREATE INDEX IF NOT EXISTS idx_djolof_orders_phone ON public.djolof_orders (customer_phone);
CREATE INDEX IF NOT EXISTS idx_djolof_orders_status ON public.djolof_orders (status);
CREATE INDEX IF NOT EXISTS idx_djolof_orders_created ON public.djolof_orders (created_at);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.djolof_orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.djolof_orders (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.djolof_orders (customer_phone);
CREATE INDEX IF NOT EXISTS idx_djolof_orders_reference ON public.djolof_orders (reference);

CREATE TABLE IF NOT EXISTS public.djolof_menus (
  id SERIAL NOT NULL,
  category VARCHAR(50) NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT NULL,
  price INTEGER NOT NULL,
  image_url TEXT NULL,
  is_available BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT djolof_menus_pkey PRIMARY KEY (id)
);

CREATE INDEX IF NOT EXISTS idx_menus_category ON public.djolof_menus (category);
CREATE INDEX IF NOT EXISTS idx_menus_is_available ON public.djolof_menus (is_available);
CREATE INDEX IF NOT EXISTS idx_menus_display_order ON public.djolof_menus (display_order);

-- ============================================
-- REALTIME (à exécuter séparément)
-- ============================================
-- ALTER PUBLICATION supabase_realtime ADD TABLE djolof_orders;
-- ALTER PUBLICATION supabase_realtime ADD TABLE djolof_menus;

-- ============================================
-- ROW LEVEL SECURITY (recommandé)
-- ============================================
-- ALTER TABLE djolof_orders ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE djolof_menus ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Enable all for authenticated users" ON djolof_orders
--   FOR ALL USING (true);

-- CREATE POLICY "Enable all for authenticated users" ON djolof_menus
--   FOR ALL USING (true);
