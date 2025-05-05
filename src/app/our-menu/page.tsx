"use client";
import GlobalContext from "@/constants/global-context";
import {
    CatalogItemsType,
    CategoryDataType,
    LineItems,
    ModifierDataType,
    ModifierIds,
    OrderCreateBody,
    OrderUpdateBodyAdd,
} from "@/constants/types";
import {
    catalogItems,
    orderCreateApi,
    orderUpdateApi,
} from "@/services/apiServices";
import {
    getDataFromLocalStorage,
    removeItemFrmLocalStorage,
    setDataInLocalStorage,
} from "@/utils/genericUtilties";
import dayjs, { Dayjs } from "dayjs";
import React, { use, useContext, useEffect, useState } from "react";


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

const OurMenu = () => {
    const {
        isOrderUpdate,
        setOrderDetails,
        lineItems,
        setLineItems,
        catalogCategoryAndItem,
        setCatalogCategoryAndItem,
        catalogCategory,
        setCatalogCategory,
        catalogCategoryTab,
        setCatalogCategoryTab,
        activeMenu,
        setActiveMenu,
        setIsOrderUpdate,
        orderDetails,
        updateLineItem,
        setUpdateLineItem,
        setIsOrdered,
        setGlobalLoading,
    } = useContext(GlobalContext);

    const [isItemAdded, setIsItemAdded] = useState(false);
    const [modifierList, setMofierList] = useState<ModifierDataType[]>([]);
    const [modifierIds, setModifierIds] = useState<ModifierIds[]>([]);
    const [fieldToClear, setFieldToClear] = useState<string[]>([]);
    const [itemList, setItemList] = useState<any[]>([]);
    //    const [categoryIds, setCategoryIds] = useState<string[]>(['LZLUMRZKOMIQCDAHV44TWMTB']); // Default category ID
    const [categoryIds, setCategoryIds] = useState<string[]>(['']); // Default category ID
    // const [textFilter, setTextFilter] = useState<string>("chicken"); // Default search filter text
    const [searchText, setSearchText] = useState<string>(""); // Default search filter text

    const [cursor, setCursor] = useState<string>("");
    const limit = 100;

    const getSearchCatalogItemData = async () => {
        const requestBody: any = { sort_order: "DESC" };

        if (categoryIds?.length > 0) requestBody.category_ids = categoryIds;
        if (searchText?.length > 0) requestBody.text_filter = searchText;

        try {
            const listMenuDataWithCategory: any[] = [];
            const filterKeys = ['id', 'item_data']; // Define filter keys
            const response = await fetch("/api/search-catalog-item", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                 body: JSON.stringify({}),
            });

            const resData = await response.json();

            const { items } = resData;
            console.log({ items });
            if (Array.isArray(items)) {
                console.log("items", items);

                // Filter based on filterKeys
                const filteredItems = items.map(item => {
                    const filteredItem: any = {};
                    filterKeys.forEach((key) => {
                        if (key in item) {
                            filteredItem[key] = item[key];
                        }
                    });
                    return filteredItem;
                });

                console.log("filteredItems", filteredItems);

                filteredItems.forEach((item: any) => {
                    const { id, item_data: { name, variations, product_type, reporting_category } } = item;
                    const { item_data } = item;
                    console.log('item_data105105', item_data)

                    variations.forEach((variation: any) => {
                        // Destructure price_money from variation
                        const { item_variation_data: { price_money } } = variation;
                        const { amount, currency } = price_money;

                        // Push id, name, and pricing info to the list
                        listMenuDataWithCategory.push({
                            id,
                            name,
                            reporting_category,
                            category_id: reporting_category.id,
                            /** 
                            product_type: product_type.toLowerCase()
                                .replace(/_([a-z])/g, (match: string, p1: string) => p1.toUpperCase())
                                .replace(/^./, (str: string) => str.toUpperCase())
                                .replace(/([a-z])([A-Z])/g, '$1 $2'),

                            */
                            product_type,
                            amount: '$' + (amount / 100).toFixed(2),
                            currency
                        });
                    });
                });
            }

            // Set item list after fetching data
            setItemList(listMenuDataWithCategory);
            console.log("listMenuDataWithCategory", listMenuDataWithCategory, itemList);

        } catch (error) {
            console.log("Error fetching catalog items", error);
        }
    };



    useEffect(() => {
        getSearchCatalogItemData();
    }, []);  // Will re-fetch data when either categoryIds or textFilter changes

    // Use another useEffect to log itemList when it changes
    // useEffect(() => {
    //     console.log("itemList updated:", itemList);
    // }, [itemList]);

    const getModifierListData = async () => {
        try {
            const params = { types: "MODIFIER_LIST" };
            const response = await fetch("/api/search-catalog-item", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text_filter: "Dosa",
                    types: ["ITEM"],
                }),
            });

            console.log("response", response);
        } catch (error) {
            console.log("Error", error);
        }
    };

    const getCatalofCategoryData = async () => {
        try {
            const params = { types: "CATEGORY" };
            const response = await catalogItems(params);
            if (response?.status === 200) {
                setDataInLocalStorage("CatalogCategoryData", response?.data?.objects);
                const currentTimePlusFiveMinutes = dayjs().add(1, "day").toDate();
                setDataInLocalStorage("Date", currentTimePlusFiveMinutes);
                setCatalogCategory(response?.data?.objects);
                setCatalogCategoryTab(response?.data?.objects);
            }
        } catch (error) {
            console.log("Error", error);
        }
    };

    const getCatalofItemAndCAtegoryData = async () => {
        try {
            const params = { types: "ITEM", limit: limit };
            const response = await catalogItems(params);
            if (response?.status === 200) {
                setDataInLocalStorage("CatalogItemsData", response?.data?.objects);
                const currentTimePlusFiveMinutes = dayjs().add(1, "day").toDate();

                setDataInLocalStorage("Date", currentTimePlusFiveMinutes);

                setCatalogCategoryAndItem(response?.data?.objects);
                setCursor(response?.data?.cursor);
            }
        } catch (error) {
            console.log("Error", error);
        }
    };

    const getCatalofItemAndCAtegoryDataPage2 = async () => {
        try {
            const params = { types: "ITEM", cursor: cursor, limit: limit };
            const response = await catalogItems(params);
            if (response?.status === 200) {
                if (response?.data?.cursor) {
                    setCursor(response?.data?.cursor);
                } else {
                    const currentTimePlusFiveMinutes = dayjs().add(1, "day").toDate();
                    setDataInLocalStorage("DatePage2", currentTimePlusFiveMinutes);
                    setCursor("");
                }
                const itemData = [
                    ...catalogCategoryAndItem,
                    ...response?.data?.objects,
                ];
                setDataInLocalStorage("CatalogItemsData", itemData);

                setCatalogCategoryAndItem(itemData);
            }
        } catch (error) {
            console.log("Error", error);
        }
    };

    const handleCategoryTabs = async (categoryItem: CategoryDataType) => {
        setActiveMenu(categoryItem?.category_data?.name);
        setCatalogCategory([categoryItem]);
    };

    const getOurMenuDatasFromLocal = () => {
        const itemAndCategoryData: CatalogItemsType[] | null =
            getDataFromLocalStorage("CatalogItemsData");
        const categoryData: CategoryDataType[] | null = getDataFromLocalStorage(
            "CatalogCategoryData"
        );
        const modifierData: ModifierDataType[] | null =
            getDataFromLocalStorage("ModifierListData");

        if (itemAndCategoryData && itemAndCategoryData?.length) {
            setCatalogCategoryAndItem(itemAndCategoryData);
        }
        if (categoryData && categoryData?.length) {
            setCatalogCategory(categoryData);
            setCatalogCategoryTab(categoryData);
        }
        if (modifierData && modifierData?.length) {
            setMofierList(modifierData);
        }
    };

    useEffect(() => {
        const dateData: Dayjs | null = getDataFromLocalStorage("Date");

        if (activeMenu === "All") {
            getOurMenuDatasFromLocal();
        }

        if (dayjs(dateData).isSame() || dayjs(dateData).isBefore() || !dateData) {
            if (activeMenu === "All") {
                getCatalofItemAndCAtegoryData();
                getCatalofCategoryData();
                getModifierListData();
            }
        }
    }, []);

    useEffect(() => {
        const dateData: Dayjs | null = getDataFromLocalStorage("DatePage2");
        if (
            cursor &&
            (dayjs(dateData).isSame() || dayjs(dateData).isBefore() || !dateData)
        ) {
            getCatalofItemAndCAtegoryDataPage2();
        }
    }, [cursor]);

    const orderCreate = async () => {
        setGlobalLoading(true);
        const body: OrderCreateBody = {
            order: {
                location_id: process.env.NEXT_PUBLIC_LOCATION_ID,
                line_items: lineItems,
                modifiers: modifierIds,
                pricing_options: {
                    auto_apply_taxes: true,
                    auto_apply_discounts: true,
                },
            },
        };
        if (modifierIds?.length > 0) {
            delete body?.order?.modifiers;
        }
        try {
            const response = await orderCreateApi(body);
            setGlobalLoading(false);
            if (response?.status === 200) {
                setIsOrderUpdate("created");
                setOrderDetails(response?.data?.order);
                setLineItems(response?.data?.order?.line_items || []);
                setDataInLocalStorage("OrderId", response?.data?.order?.id);
                setIsOrdered(true);
            }
        } catch (error) {
            setGlobalLoading(false);
            console.log("Error", error);
        }
    };

    const orderUpdate = async () => {
        setGlobalLoading(true);
        const body: OrderUpdateBodyAdd = {
            fields_to_clear: fieldToClear,
            order: {
                location_id: process.env.NEXT_PUBLIC_LOCATION_ID,
                line_items: updateLineItem,

                pricing_options: {
                    auto_apply_taxes: true,
                    auto_apply_discounts: true,
                },
                version: orderDetails?.version,
            },
        };
        try {
            const response = await orderUpdateApi(body, orderDetails?.id);
            setGlobalLoading(false);
            if (response?.status === 200) {
                setIsOrdered(true);
                setOrderDetails(response?.data?.order);
                setLineItems(response?.data?.order?.line_items || []);
                setIsOrderUpdate("updated");
                setUpdateLineItem([]);
                setFieldToClear([]);
            }
        } catch (error) {
            setGlobalLoading(false);
            console.log("Error", error);
        }
    };

    useEffect(() => {
        if (lineItems?.length === 0) {
            removeItemFrmLocalStorage(["OrderId"]);
        }
        if (isOrderUpdate === "create") {
            orderCreate();
        } else if (isOrderUpdate && isItemAdded) {
            orderUpdate();
        }
    }, [isOrderUpdate]);

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

                        {catalogCategoryTab?.map((item) => {
                            // Mark 'Namma Menu' as not top level
                            if (item?.category_data?.name === "Namma Menu") {
                                item.category_data.is_top_level = false;
                            }
                            // Check if category_data exists and is_top_level is true
                            if (!item?.category_data?.is_top_level) return null;
                            // if (!category?.category_data?.loca) return null;

                            return (
                                <button
                                    key={item?.id}
                                    className={`text-[#222A4A] leading-[29px] text-[13px] ${activeMenu === item?.category_data?.name
                                        ? "text-[#A02621] font-semibold"
                                        : "text-[#222A4A]"
                                        }`}
                                    onClick={() => handleCategoryTabs(item)}
                                >
                                    {/* {item.id}{item?.category_data?.name}7799 */}
                                    {item?.category_data?.name}
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
                                                        {category?.category_data?.name}
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
                                                        {category?.category_data?.name}
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
                                {data?.item_data?.name}
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
