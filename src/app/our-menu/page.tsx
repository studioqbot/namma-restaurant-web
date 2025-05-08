"use client";
import GlobalContext from "@/constants/global-context";
import {
    CatalogItemsType,
    LineItems,
    ModifierDataType,
    ModifierIds,
} from "@/constants/types";

import React, { use, useContext, useEffect, useState } from "react";
import { patchRetrieve } from "../../utils/patchRetrieve"
import { patchRetrieveByCatId } from '../../utils/patchRetrieveByCatId';
interface OurMenuItemsType {
    data: CatalogItemsType;
    setLineItems: React.Dispatch<React.SetStateAction<LineItems[]>>;
    lineItems: LineItems[];
    setUpdateLineItem: React.Dispatch<React.SetStateAction<LineItems[]>>;
    updateLineItem: LineItems[];
    setIsItemAdded: React.Dispatch<React.SetStateAction<boolean>>;
    modifierList: ModifierDataType[] | undefined;
    modifierIds: ModifierIds[];
    setModifierIds: React.Dispatch<React.SetStateAction<ModifierIds[]>>;
    setFieldToClear: React.Dispatch<React.SetStateAction<string[]>>;
}


type CatalogObject = {
    type: string;
    id: string;
    item_data?: {
        name: string;
        categories?: { id: string; ordinal: number }[];
    };
};

type CategoryWithName = {
    //   id: string;
    name: string;
};

type CategoryMap = {
    [id: string]: CategoryWithName;
};


const OurMenu = () => {

    const [menuItems, setMenuItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const {
        lineItems,
        setLineItems,
        catalogCategoryAndItem,
        catalogCategory,
        setCatalogCategory,
        catalogCategoryTab,
        activeMenu,
        setActiveMenu,
        updateLineItem,
        setUpdateLineItem,     
    } = useContext(GlobalContext);

    const [isItemAdded, setIsItemAdded] = useState(false);
    const [modifierList, setMofierList] = useState<ModifierDataType[]>([]);
    const [modifierIds, setModifierIds] = useState<ModifierIds[]>([]);
    const [fieldToClear, setFieldToClear] = useState<string[]>([]);
    const [itemList, setItemList] = useState<any[]>([]);
    const [selectMenu, setSelectMenu] = useState<string>('');
    const [categories, setCategories] = useState<{ name: string }[]>([]);


    const fetchMenu = async (cursorParam: string | null = null) => {
        setLoading(true);
        try {
            const url = cursorParam ? `/api/category-list?cursor=${cursorParam}` : `/api/category-list`;
            console.log('Fetching from URL:', url);

            const response = await fetch(url);
            const data: { cursor?: string; objects?: CatalogObject[] } = await response.json();

            // Extract new items
            const newItems: CatalogObject[] = (data?.objects || []).filter(
                (obj: CatalogObject) => obj.type === 'ITEM'
            );

            setMenuItems(prev => [...prev, ...newItems]);

            // Extract unique category IDs
            const categoryMap: CategoryMap = {};
            const categoryIdSet: Set<string> = new Set();

            // Collect unique category IDs
            for (const item of newItems) {
                const categories = item.item_data?.categories || [];
                for (const category of categories) {
                    if (!categoryIdSet.has(category.id)) {
                        categoryIdSet.add(category.id);
                    }
                }
            }

            // Fetch names using patchRetrieve for all unique category IDs
            for (const categoryId of categoryIdSet) {
                const name = await patchRetrieveByCatId([categoryId]); // Get name using your existing function

                // Only add category if the name is not already in the map
                if (!Object.values(categoryMap).some((category) => category.name === name)) {
                    categoryMap[categoryId] = {
                        name: name || 'Unknown',
                    };
                }
            }

            // Convert category map to an array of unique name objects
            const categoryArray = Object.values(categoryMap);

            console.log('Category Array with Unique Names:', categoryArray);


            setCategories(categoryArray);
            // Return the array of unique name categories
            return categoryArray;

        } catch (error) {
            console.error('Failed to load menu:', error);
            return null; // Return null or empty if there's an error
        } finally {
            setLoading(false);
            console.log('Loading complete');
        }
    };


    const getSearchCatalogItemData = async () => {
        try {
            const listOurMenu: any[] = [];
            const filterKeys = ['id', 'item_data'];

            const requestBody: any = {
                sort_order: "DESC",
                // category_ids : [],
                category_ids: [],
                text_filter: 'Chicken'
                // text_filter : ''
            };

            const response = await fetch("/api/search-catalog-item", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(requestBody), // ✅ Always present, even if just { sort_order: "DESC" }
            });

            const resData = await response.json();
            const { items } = resData;
            console.log({ items });

            if (Array.isArray(items)) {
                const filteredItems = items.map(item => {
                    const filteredItem: any = {};
                    filterKeys.forEach((key) => {
                        if (key in item) {
                            filteredItem[key] = item[key];
                        }
                    });
                    return filteredItem;
                });

                filteredItems.forEach(async (item: any) => {
                    const { id, item_data: { name, variations, product_type, reporting_category } } = item;

                    variations.forEach(async (variation: any) => {
                        const { item_variation_data: { price_money } } = variation;
                        const { amount, currency } = price_money;

                        listOurMenu.push({
                            id,
                            name,
                            product_type,
                            amount: '$ ' + (amount / 100).toFixed(2),
                            currency,
                            category_id: reporting_category?.id,
                            category_name: await patchRetrieve([id]),
                        });
                    });
                });
            }

            setItemList(listOurMenu);
            console.log("listOurMenu", listOurMenu);

        } catch (error) {
            console.log("Error fetching catalog items", error);
        }
    };

    const hanldeListMenu = (name: string) => {
        setSelectMenu(name)
        console.log('Fn:hanldeListMenu', { itemList : itemList.includes })
        console.log({ ClickedMenu: name })
    }




    useEffect(() => {
        getSearchCatalogItemData();
        fetchMenu()
    }, []);  // Will re-fetch data when either categoryIds or textFilter changes



    return (
        <div className="w-full">
            <div className="container">
                <div className="w-full flex items-center py-[20px] relative mt-[55px] mb-[60px]">
                    <span className="absolute top-0 left-0 w-full h-[4px] border-t-[0.5px] border-b-[0.5px] border-[#222A4A]" />
                    <span className="absolute bottom-0 left-0 w-full h-[4px] border-t-[0.5px] border-b-[0.5px] border-[#222A4A]" />
                    <span className="text-[#A02621] text-[27px] leading-[31px] font-semibold font-unbounded bg-[#eee1d1] absolute pr-[10px] top-[-14px] left-0">
                        Our Menu

                    </span>

                    <div className="flex flex-row items-center overflow-x-auto whitespace-nowrap justify-between w-full">
                        <button
                            className={`text-[#222A4A] leading-[29px] text-[13px]  ${activeMenu === "All"
                                ? "text-[#A02621] font-semibold"
                                : "text-[#222A4A]"
                                }`}
                            onClick={() => {
                                setCatalogCategory([...catalogCategoryTab]);
                                setActiveMenu("All");
                            }}
                        >
                            All &nbsp;
                            <span className="text-[#222A4A] h-[18px] overflow-hidden mt-[-5px]">
                                |
                            </span>
                        </button>

                        {categories?.map((item, i) => {
                            // Mark 'Namma Menu' as not top level


                            return (
                                <button
                                    key={i}
                                    className={`text-[#222A4A] leading-[29px] text-[13px] ${activeMenu === item?.name
                                        ? "text-[#A02621] font-semibold"
                                        : "text-[#222A4A]"
                                        }`}
                                    onClick={() => hanldeListMenu(item?.name)}
                                >
                                    {/* {item.id}{item?.category_data?.name}7799 */}
                                    {item?.name}
                                    <span className="text-[#222A4A] h-[18px] overflow-hidden mt-[-5px] px-[5px]">
                                        |
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-[40px]">
                    <div className="col-span-6">
                        <div className="p-6">
                            {catalogCategory
                                ?.filter((_, index) => index % 2 === 0)
                                ?.map((category) => {
                                    // Only render if is_top_level is true
                                    // Mark 'Namma Menu' as not top level
                                    if (category?.category_data?.name === "Namma Menu") {
                                        category.category_data.is_top_level = false;
                                    }
                                    if (!category?.category_data?.is_top_level) return null;

                                    const catalogItems = catalogCategoryAndItem?.filter(
                                        (itemData: CatalogItemsType) =>
                                            itemData?.item_data?.category_id === category?.id
                                    );

                                    return (
                                        <div key={category?.id} className="col-span-6">
                                            <div className="p-6">
                                                <div className="mb-8">
                                                    <h2 className="text-2xl font-bold mb-4 bg-[#eee1d1]">
                                                        {category?.category_data?.name} 123
                                                    </h2>
                                                    <div className="space-y-2">
                                                        {/** catalogItems?.map((item: CatalogItemsType) => (
                                                            <OurMenuItems
                                                                key={item?.id}
                                                                data={item}
                                                                lineItems={lineItems}
                                                                setLineItems={setLineItems}
                                                                setUpdateLineItem={setUpdateLineItem}
                                                                updateLineItem={updateLineItem}
                                                                setIsItemAdded={setIsItemAdded}
                                                                modifierList={modifierList}
                                                                modifierIds={modifierIds}
                                                                setModifierIds={setModifierIds}
                                                                setFieldToClear={setFieldToClear}
                                                            />
                                                        ))*/}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>

                    <div className="col-span-6">
                        <div className="p-6">
                            {catalogCategory
                                ?.filter((_, index) => index % 2 !== 0)
                                ?.map((category) => {
                                    // Mark 'Namma Menu' as not top level
                                    if (category?.category_data?.name === "Namma Menu") {
                                        category.category_data.is_top_level = false;
                                    }
                                    // Skip rendering if category_data.is_top_level is not true
                                    if (!category?.category_data?.is_top_level) return null;
                                    // if (!category?.category_data?.location_overrides) return null;

                                    const catalogItems = catalogCategoryAndItem?.filter(
                                        (itemData: CatalogItemsType) =>
                                            itemData?.item_data?.category_id === category?.id
                                    );

                                    return (
                                        <div key={category?.id} className="col-span-6">
                                            <div className="p-6">
                                                <div className="mb-8">
                                                    <h2 className="text-2xl font-bold mb-4 bg-[#eee1d1]">
                                                        {category?.category_data?.name} 234
                                                    </h2>
                                                    <div className="space-y-2">
                                                        {catalogItems?.map((item: CatalogItemsType) => (
                                                            <OurMenuItems
                                                                key={item?.id}
                                                                data={item}
                                                                lineItems={lineItems}
                                                                setLineItems={setLineItems}
                                                                setUpdateLineItem={setUpdateLineItem}
                                                                updateLineItem={updateLineItem}
                                                                setIsItemAdded={setIsItemAdded}
                                                                modifierList={modifierList}
                                                                modifierIds={modifierIds}
                                                                setModifierIds={setModifierIds}
                                                                setFieldToClear={setFieldToClear}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// const OurMenuItems = React.memo(({ data, setLineItems, lineItems, setUpdateLineItem, setIsItemAdded, updateLineItem, modifierList, setFieldToClear }: OurMenuItemsType) => {
const OurMenuItems = React.memo(({ data }: OurMenuItemsType) => {
    return (
        <>
            {!!data?.item_data?.variations[0]?.item_variation_data?.price_money
                ?.amount && (
                    <div className="flex items-center justify-between py-2 relative">
                        <span className="absolute w-full border-b border-dotted border-[#222A4A] z-[-1]" />

                        <>
                            <span className="bg-[#eee1d1] text-[14px] text-[#222A4A] pr-[25px]">
                                {data?.item_data?.name}123
                            </span>
                            <span className="bg-[#eee1d1] text-[14px] text-[#222A4A] font-medium">
                                $
                                {data.item_data.variations[0].item_variation_data.price_money
                                    .amount / 100}
                            </span>
                        </>
                    </div>
                )}
        </>
    );
});

OurMenuItems.displayName = "OurMenuItems";
export default OurMenu;
