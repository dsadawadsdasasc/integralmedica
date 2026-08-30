ALTER TABLE public.products ADD COLUMN IF NOT EXISTS tags text[] NOT NULL DEFAULT '{}';

UPDATE public.products SET slug='whey-concentrado-pouch-900g', name='Whey Protein Concentrado Pouch 900g', price_cents=20000, compare_at_cents=22700, tags='{100% WHEY PROTEIN,GANHO DE MASSA,LOW CARB}' WHERE slug='100-pure-whey-900g';
UPDATE public.products SET slug='whey-concentrado-pote-900g', name='Whey Protein Concentrado Pote 900g', price_cents=24000, compare_at_cents=NULL, tags='{100% WHEY PROTEIN,GANHO DE MASSA,LOW CARB}' WHERE slug='nutri-whey-protein-907g';
UPDATE public.products SET slug='whey-protein-isolado-900g', name='Whey Protein Isolado 900g', price_cents=48300, compare_at_cents=NULL, tags='{ZERO AÇÚCAR ADICIONADO,ZERO GLÚTEN,DEFINIÇÃO MUSCULAR}' WHERE slug='iso-protein-900g';
UPDATE public.products SET slug='my-whey-900g', name='MY WHEY Integralmedica 900g', price_cents=17500, compare_at_cents=NULL, tags='{100% WHEY PROTEIN,BAIXO EM GORDURA,AUMENTO DE SACIEDADE}' WHERE slug='darkness-whey-3w-837g';

UPDATE public.products SET slug='creatina-100-pura-300g-hardcore', name='Creatina 100% Pura 300g Hardcore', price_cents=6000, compare_at_cents=NULL, tags='{SEM ADITIVOS,ZERO AÇÚCAR,ENERGIA MUSCULAR}' WHERE slug='creatina-hardcore-300g';
UPDATE public.products SET slug='creatina-100-pura-pouch-1kg', name='Creatina 100% Pura Pouch 1kg', price_cents=15600, compare_at_cents=NULL, tags='{SEM ADITIVOS,ZERO AÇÚCAR,ENERGIA MUSCULAR}' WHERE slug='creatina-monohidratada-1kg';
UPDATE public.products SET slug='creatina-creapure-300g', name='Creatina Creapure 300g', price_cents=18400, compare_at_cents=NULL, tags='{LANÇAMENTO}' WHERE slug='creatina-creapure-150g';

UPDATE public.products SET slug='pre-treino-prime-md-300g', name='Pré-Treino Prime MD 300g', price_cents=11200, compare_at_cents=NULL, tags='{LANÇAMENTO,DUAL CAFFEINE,MAIS ENERGIA,FOCO}' WHERE slug='pre-hardcore-300g';
UPDATE public.products SET slug='huger-pre-treino-320g', name='Huger Pré-Treino 320g', price_cents=9500, compare_at_cents=15900, tags='{ENERGIA,VITAMINAS,ZERO AÇÚCAR}' WHERE slug='pump-extreme-150g';
UPDATE public.products SET slug='creatina-350g-hardcore-com-sabor', name='Creatina 350g Hardcore Com Sabor', price_cents=6000, compare_at_cents=NULL, tags='{LANÇAMENTO,ZERO CARBOIDRATOS,AUMENTO DE FORÇA,ZERO AÇÚCAR}' WHERE slug='thermo-burn-60caps';

UPDATE public.products SET slug='bcaa-2044mg', name='BCAA 2044 mg', price_cents=6900, compare_at_cents=NULL, tags='{GANHO DE FORÇA,ZERO SÓDIO,ZERO AÇÚCAR}' WHERE slug='bcaa-2400-120caps';
UPDATE public.products SET slug='beta-alanina-em-po-123g', name='Beta Alanina em Pó 123g', price_cents=5400, compare_at_cents=6500, tags='{ZERO AÇÚCAR,REDUÇÃO DA FADIGA MUSCULAR,ZERO SÓDIO}' WHERE slug='beta-alanina-200g';
UPDATE public.products SET name='Glutamina 300g em pó', price_cents=7500, compare_at_cents=NULL, tags='{IMUNIDADE,ZERO SÓDIO,ANTIOXIDANTE}' WHERE slug='glutamina-300g';

UPDATE public.products SET slug='beef-protein-900g', name='Beef Protein 900g', price_cents=21100, compare_at_cents=NULL, tags='{LANÇAMENTO,ZERO LACTOSE,ZERO GLÚTEN,30G DE PROTEÍNA}' WHERE slug='hipercalorico-massa-3kg';
UPDATE public.products SET slug='whey-concentrado-sache', name='Whey Protein Concentrado Sachê', price_cents=11300, compare_at_cents=NULL, tags='{LANÇAMENTO,100% WHEY PROTEIN,GANHO DE MASSA,PRATICIDADE}' WHERE slug='mass-gainer-1-5kg';

UPDATE public.products SET slug='protein-crisp-bar-12und', name='Protein Crisp Bar 12 und', price_cents=10500, compare_at_cents=11900, tags='{}' WHERE slug='barra-proteica-caixa-12';
UPDATE public.products SET slug='protein-crisp-bar-unidade', name='Protein Crisp Bar Unidade', price_cents=1100, compare_at_cents=NULL, tags='{COMPRE POR UNIDADE!}' WHERE slug='barra-proteica-unidade';
UPDATE public.products SET slug='vo2-whey-bar-12und', name='VO2 Whey Bar 12 unid', price_cents=7300, compare_at_cents=NULL, tags='{}' WHERE slug='pasta-amendoim-1kg';