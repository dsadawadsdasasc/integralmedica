-- CATEGORIES
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categorias sao publicas" ON public.categories FOR SELECT TO anon, authenticated USING (true);

-- PRODUCTS
CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  price_cents int NOT NULL,
  compare_at_cents int,
  image_key text NOT NULL DEFAULT 'whey',
  flavors text[] NOT NULL DEFAULT '{}',
  rating numeric(2,1) NOT NULL DEFAULT 5.0,
  reviews_count int NOT NULL DEFAULT 0,
  stock int NOT NULL DEFAULT 100,
  is_featured boolean NOT NULL DEFAULT false,
  is_new boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Produtos sao publicos" ON public.products FOR SELECT TO anon, authenticated USING (true);
CREATE INDEX products_category_idx ON public.products(category_id);

-- PROFILES
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  full_name text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  cpf text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Perfil proprio - leitura" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "Perfil proprio - insercao" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Perfil proprio - atualizacao" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ORDERS
CREATE TABLE public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  order_number text NOT NULL UNIQUE DEFAULT upper(substr(replace(gen_random_uuid()::text,'-',''),1,8)),
  status text NOT NULL DEFAULT 'pago',
  subtotal_cents int NOT NULL,
  shipping_cents int NOT NULL DEFAULT 0,
  total_cents int NOT NULL,
  payment_method text NOT NULL DEFAULT 'pix',
  customer_name text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  phone text NOT NULL DEFAULT '',
  cep text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  number text NOT NULL DEFAULT '',
  complement text NOT NULL DEFAULT '',
  district text NOT NULL DEFAULT '',
  city text NOT NULL DEFAULT '',
  state text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Pedidos proprios - leitura" ON public.orders FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Pedidos proprios - insercao" ON public.orders FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- ORDER ITEMS
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text NOT NULL,
  product_slug text NOT NULL DEFAULT '',
  image_key text NOT NULL DEFAULT 'whey',
  flavor text NOT NULL DEFAULT '',
  unit_price_cents int NOT NULL,
  quantity int NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.order_items TO authenticated;
GRANT ALL ON public.order_items TO service_role;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Itens proprios - leitura" ON public.order_items FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()));
CREATE POLICY "Itens proprios - insercao" ON public.order_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()));
CREATE INDEX order_items_order_idx ON public.order_items(order_id);

-- SEED
INSERT INTO public.categories (slug, name, sort_order) VALUES
  ('proteinas', 'Proteínas', 1),
  ('creatinas', 'Creatinas', 2),
  ('pre-treinos', 'Pré-Treinos', 3),
  ('aminoacidos', 'Aminoácidos', 4),
  ('hipercaloricos', 'Hipercalóricos', 5),
  ('barras-snacks', 'Barras e Snacks', 6);

INSERT INTO public.products (slug, name, description, category_id, price_cents, compare_at_cents, image_key, flavors, rating, reviews_count, is_featured, is_new)
SELECT v.slug, v.name, v.description, c.id, v.price_cents, v.compare_at_cents, v.image_key, v.flavors, v.rating, v.reviews, v.featured, v.is_new
FROM (VALUES
  ('100-pure-whey-900g','100% Pure Whey 900g','Whey protein concentrado e isolado com 24g de proteína por dose. Absorção rápida para recuperação muscular.','proteinas',18990,24990,'whey', ARRAY['Baunilha','Chocolate','Morango','Cookies'],4.8,1240,true,false),
  ('nutri-whey-protein-907g','Nutri Whey Protein 907g','Blend proteico premium com enzimas digestivas e perfil completo de aminoácidos.','proteinas',22990,27990,'whey', ARRAY['Chocolate','Baunilha'],4.7,860,true,false),
  ('iso-protein-900g','Iso Protein 900g','Proteína isolada com baixíssimo teor de gordura e carboidratos. Ideal para definição.','proteinas',27990,32990,'whey', ARRAY['Chocolate','Morango'],4.9,540,true,true),
  ('darkness-whey-3w-837g','Darkness Whey 3W 837g','Três fontes de proteína: isolada, concentrada e hidrolisada, para liberação prolongada.','proteinas',25990,NULL,'whey', ARRAY['Chocolate','Baunilha','Cookies'],4.6,410,false,false),
  ('creatina-hardcore-300g','Creatina Hardcore 300g','Creatina monohidratada pura, sem aditivos. Mais força e explosão em cada série.','creatinas',13990,17990,'creatina', ARRAY['Sem sabor'],4.9,2100,true,false),
  ('creatina-creapure-150g','Creatina Creapure 150g','Creatina alemã Creapure com 99,9% de pureza certificada.','creatinas',11990,NULL,'creatina', ARRAY['Sem sabor'],4.8,930,false,false),
  ('creatina-monohidratada-1kg','Creatina Monohidratada 1kg','Embalagem econômica para quem treina pesado o ano inteiro.','creatinas',34990,39990,'creatina', ARRAY['Sem sabor'],4.7,320,false,true),
  ('pre-hardcore-300g','Pré-Treino Hardcore 300g','Energia extrema com cafeína, beta-alanina e taurina. Foco total no treino.','pre-treinos',15990,19990,'preworkout', ARRAY['Frutas Vermelhas','Limão','Uva'],4.7,780,true,false),
  ('pump-extreme-150g','Pump Extreme 150g','Vasodilatador com arginina e citrulina para máxima congestão muscular.','pre-treinos',12990,NULL,'preworkout', ARRAY['Melancia','Laranja'],4.5,260,false,false),
  ('thermo-burn-60caps','Thermo Burn 60 cápsulas','Termogênico com cafeína anidra para energia e disposição.','pre-treinos',8990,10990,'preworkout', ARRAY['Cápsulas'],4.4,190,false,true),
  ('bcaa-2400-120caps','BCAA 2400 120 cápsulas','Aminoácidos de cadeia ramificada na proporção 2:1:1 contra o catabolismo.','aminoacidos',7990,9990,'bcaa', ARRAY['Cápsulas'],4.6,650,true,false),
  ('glutamina-300g','Glutamina 300g','Glutamina pura para recuperação muscular e suporte imunológico.','aminoacidos',9990,NULL,'bcaa', ARRAY['Sem sabor'],4.7,420,false,false),
  ('beta-alanina-200g','Beta Alanina 200g','Retarda a fadiga muscular e aumenta a resistência nos treinos intensos.','aminoacidos',10990,12990,'bcaa', ARRAY['Sem sabor'],4.5,150,false,true),
  ('hipercalorico-massa-3kg','Hipercalórico Massa 3kg','1200 kcal por dose com carboidratos complexos e proteínas de qualidade.','hipercaloricos',18990,23990,'hipercalorico', ARRAY['Chocolate','Baunilha','Morango'],4.6,510,true,false),
  ('mass-gainer-1-5kg','Mass Gainer 1,5kg','Ganho de peso limpo com mix de carboidratos e whey.','hipercaloricos',11990,NULL,'hipercalorico', ARRAY['Chocolate','Baunilha'],4.4,230,false,false),
  ('barra-proteica-caixa-12','Barra Proteica Caixa com 12','20g de proteína por barra, cobertura de chocolate. Lanche prático e delicioso.','barras-snacks',9990,12990,'barra', ARRAY['Chocolate','Doce de Leite','Coco'],4.5,880,true,false),
  ('barra-proteica-unidade','Barra Proteica Unidade','Sua dose de proteína para levar na mochila.','barras-snacks',990,NULL,'barra', ARRAY['Chocolate','Doce de Leite'],4.4,340,false,false),
  ('pasta-amendoim-1kg','Pasta de Amendoim Integral 1kg','Fonte de gorduras boas e proteína vegetal, sem açúcar adicionado.','barras-snacks',3990,4990,'barra', ARRAY['Tradicional','Chocolate'],4.8,610,false,true)
) AS v(slug,name,description,cat_slug,price_cents,compare_at_cents,image_key,flavors,rating,reviews,featured,is_new)
JOIN public.categories c ON c.slug = v.cat_slug;