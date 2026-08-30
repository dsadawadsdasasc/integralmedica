import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";

import type { Category, Product } from "./catalog-types";

export const listCategories = createServerFn({ method: "GET" }).handler(async () => {
  const { getPublicClient } = await import("./supabase-public.server");
  const { data, error } = await getPublicClient()
    .from("categories")
    .select("id, slug, name, sort_order")
    .order("sort_order");
  if (error) throw new Error(error.message);
  return (data ?? []) as Category[];
});

export const listProducts = createServerFn({ method: "GET" })
  .inputValidator((input: { category?: string | undefined; search?: string | undefined } | undefined) => input ?? {})
  .handler(async ({ data: input }) => {
    const { getPublicClient } = await import("./supabase-public.server");
    const client = getPublicClient();

    let categoryId: string | null = null;
    if (input.category) {
      const { data: cat } = await client
        .from("categories")
        .select("id")
        .eq("slug", input.category)
        .maybeSingle();
      categoryId = (cat as { id: string } | null)?.id ?? null;
      if (!categoryId) return [] as Product[];
    }

    let query = client.from("products").select("*").order("is_featured", { ascending: false });
    if (categoryId) query = query.eq("category_id", categoryId);
    if (input.search) query = query.ilike("name", `%${input.search}%`);

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return (data ?? []) as Product[];
  });

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((input: { slug: string }) => input)
  .handler(async ({ data: input }) => {
    const { getPublicClient } = await import("./supabase-public.server");
    const client = getPublicClient();
    const { data, error } = await client
      .from("products")
      .select("*")
      .eq("slug", input.slug)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!data) return null;
    const product = data as Product;
    const { data: related } = await client
      .from("products")
      .select("*")
      .eq("category_id", product.category_id)
      .neq("id", product.id)
      .limit(4);
    return { product, related: (related ?? []) as Product[] };
  });

export const categoriesQuery = queryOptions({
  queryKey: ["categories"],
  queryFn: () => listCategories(),
  staleTime: 5 * 60 * 1000,
});

export const productsQuery = (params: { category?: string | undefined; search?: string | undefined }) =>
  queryOptions({
    queryKey: ["products", params.category ?? "all", params.search ?? ""],
    queryFn: () => listProducts({ data: params }),
  });

export const productQuery = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: () => getProduct({ data: { slug } }),
  });
