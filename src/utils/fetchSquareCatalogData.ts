export const fetchSquareCatalogData = async () => {
  const res = await fetch('/api/search-catalog-item', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      types: ['CATEGORY', 'ITEM'], // Fetch both categories and items
    }),
  });

  if (!res.ok) throw new Error('Failed to fetch catalog data'); // Handle API failure

  const data = await res.json(); // Parse the response

  // Filter the response data into categories and items
  const catalogCategories = data.objects?.filter((obj: any) => obj.type === 'CATEGORY') || [];
  const catalogItems = data.objects?.filter((obj: any) => obj.type === 'ITEM') || [];

  return { catalogCategories, catalogItems }; // Return filtered categories and items
};
