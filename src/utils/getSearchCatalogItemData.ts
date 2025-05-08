// import { patchRetrieve } from './patchRetrieve'; // adjust path as needed
// // patchRetr
// import { Dispatch, SetStateAction } from 'react';

// interface CatalogItem {
//   id: string;
//   item_data: {
//     name: string;
//     variations: {
//       item_variation_data: {
//         price_money: {
//           amount: number;
//           currency: string;
//         };
//       };
//     }[];
//     product_type: string;
//     reporting_category?: {
//       id: string;
//     };
//   };
// }

// interface MenuItem {
//   id: string;
//   name: string;
//   product_type: string;
//   amount: string;
//   currency: string;
//   category_id?: string;
//   category_name: string;
// }

// export const getSearchCatalogItemData = async (
//   textFilter: string,
//   setItemList: Dispatch<SetStateAction<MenuItem[]>>
// ) => {
//   try {
//     const listOurMenu: MenuItem[] = [];
//     const filterKeys: (keyof CatalogItem)[] = ['id', 'item_data'];

//     const requestBody = {
//       sort_order: 'DESC',
//       category_ids: [],
//       text_filter: textFilter,
//     };

//     const response = await fetch('/api/search-catalog-item', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(requestBody),
//     });

//     const resData = await response.json();
//     const { items } = resData;

//     if (Array.isArray(items)) {
//       const filteredItems = items.map((item: CatalogItem) => {
//         const filteredItem: Partial<CatalogItem> = {};
//         filterKeys.forEach((key) => {
//           if (key in item) {
//             filteredItem[key] = item[key];
//           }
//         });
//         return filteredItem;
//       });

//       for (const item of filteredItems) {
//         const { id, item_data } = item as CatalogItem;
//         const { name, variations, product_type, reporting_category } = item_data;

//         for (const variation of variations) {
//           const { price_money } = variation.item_variation_data;
//           const { amount, currency } = price_money;

//           listOurMenu.push({
//             id,
//             name,
//             product_type,
//             amount: '$ ' + (amount / 100).toFixed(2),
//             currency,
//             category_id: reporting_category?.id,
//             category_name: await patchRetrieve([id]),
//           });
//         }
//       }
//     }

//     setItemList(listOurMenu);
//     console.log('listOurMenu', listOurMenu);
//   } catch (error) {
//     console.error('Error fetching catalog items', error);
//   }
// };


