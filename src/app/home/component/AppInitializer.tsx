// src/utils/fetchSquareCatalogData.ts
export const fetchSquareCatalogData = async () => {
  const res = await fetch('/api/search-catalog-item', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      types: ['CATEGORY', 'ITEM'],
    }),
  });

  if (!res.ok) throw new Error('Failed to fetch catalog data');

  const data = await res.json();

  // Filter the response
  const catalogCategories = data.objects?.filter((obj: any) => obj.type === 'CATEGORY') || [];
  const catalogItems = data.objects?.filter((obj: any) => obj.type === 'ITEM') || [];

  return { catalogCategories, catalogItems };
};
