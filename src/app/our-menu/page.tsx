// File: app/our-menu/page.tsx
"use client";
import GlobalContext from "@/constants/global-context";
import {
    CatalogItemsType,
    LineItems,
    ModifierDataType,
    ModifierIds,
} from "@/constants/types";
import React, { useContext, useEffect, useState } from "react";
import { patchRetrieve } from "@/utils/patchRetrieve";
// import { fetchMenu, CategoryWithName } from "@/utils/fetchMenu";
import { fetchMenu } from '../../utils/fetcMenu';
import { fetchMenuItemList } from '../../utils/fetchMenuItemList';

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



type CategoryWithName = {
    //   id: string;
    name: string;
};

const OurMenu = () => {
    const [categories, setCategories] = useState<CategoryWithName[]>([]);
    const [itemList, setItemList] = useState<any[]>([]);
    const [selectMenu, setSelectMenu] = useState<string>("");
    const [isItemAdded, setIsItemAdded] = useState(false);
    const [modifierList, setMofierList] = useState<ModifierDataType[]>([]);
    const [modifierIds, setModifierIds] = useState<ModifierIds[]>([]);
    const [fieldToClear, setFieldToClear] = useState<string[]>([]);

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

    const handleListMenu = (name: string) => {
        setSelectMenu(name);

        if (name === "All") {
            console.log("Fn:handleListMenu - Showing All Items");
            console.log("All Items:", itemList);
            // Optionally reset to full list
            // setItemList(originalFullList); ← if you're maintaining a separate full list
            return;
        }

        const filteredItems = itemList.filter((item) => {
            console.log({ cat_name: item.category_name, name });
            return item.category_name === name;
        });

        const hasCategory = filteredItems.length > 0;

        console.log("Fn:handleListMenu", { hasCategory });

        if (hasCategory) {
            console.log("Filtered Items:", filteredItems);
            // setItemList(filteredItems); ← optionally update displayed items
        }
    };



    useEffect(() => {
        fetchMenu().then((cats: any) => {
            console.log({cats})
            if (cats) setCategories(cats);
        });

        fetchMenuItemList().then((menuList: any) => {
            if (menuList) setItemList(menuList);
        });
    }, []);



    return (
        <div className="w-full">
            <div className="container">
                {/* Menu tabs */}
                <div className="w-full flex items-center py-[20px] relative mt-[55px] mb-[60px]">
                    <span className="absolute top-0 left-0 w-full h-[4px] border-t-[0.5px] border-b-[0.5px] border-[#222A4A]" />
                    <span className="absolute bottom-0 left-0 w-full h-[4px] border-t-[0.5px] border-b-[0.5px] border-[#222A4A]" />
                    <span className="text-[#A02621] text-[27px] leading-[31px] font-semibold font-unbounded bg-[#eee1d1] absolute pr-[10px] top-[-14px] left-0">
                        Our Menu
                    </span>
                    <div className="flex flex-row items-center overflow-x-auto whitespace-nowrap justify-between w-full">
                        <button
                            className={`text-[#222A4A] leading-[29px] text-[13px] ${activeMenu === "All" ? "text-[#A02621] font-semibold" : "text-[#222A4A]"}`}
                            onClick={() => {
                                setCatalogCategory([...catalogCategoryTab]);
                                setActiveMenu("All");
                            }}
                        >
                            All <span className="text-[#222A4A] h-[18px] overflow-hidden mt-[-5px]">|</span>
                        </button>
                        
                        {categories.map((item, i) => (
                                             
                            <button
                                key={i}
                                className={`text-[#222A4A] leading-[29px] text-[13px] ${activeMenu === item.name ? "text-[#A02621] font-semibold" : "text-[#222A4A]"}`}
                                onClick={() => handleListMenu(item.name)}
                            >
                                {item.name}
                                <span className="text-[#222A4A] h-[18px] overflow-hidden mt-[-5px] px-[5px]">|</span>
                            </button>
                    
                        ))}
                    </div>
                </div>

                {/* Menu content */}
                <div className="grid grid-cols-12 gap-[40px]">
                    {/* {[0, 1].map((mod,i) => (
                        <div key={mod} className="col-span-6">
                            <div className="p-6">
                                {catalogCategory
                                    ?.filter((_, index) => index % 2 === mod)
                                    ?.map((category) => {
                                        if (category?.category_data?.name === "Namma Menu") {
                                            category.category_data.is_top_level = false;
                                        }
                                        if (!category?.category_data?.is_top_level) return null;

                                        const catalogItems = catalogCategoryAndItem?.filter(
                                            (itemData: CatalogItemsType) => itemData?.item_data?.category_id === category?.id
                                        );

                                        return (
                                            <div key={category?.id} className="mb-8">
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
                                        );
                                    })}
                            </div>
                        </div>
                    ))} */}
                </div>
            </div>
        </div>
    );
};

const OurMenuItems = React.memo(({ data }: OurMenuItemsType) => {
    return !!data?.item_data?.variations[0]?.item_variation_data?.price_money?.amount ? (
        <div className="flex items-center justify-between py-2 relative">
            <span className="absolute w-full border-b border-dotted border-[#222A4A] z-[-1]" />
            <span className="bg-[#eee1d1] text-[14px] text-[#222A4A] pr-[25px]">
                {data?.item_data?.name}
            </span>
            <span className="bg-[#eee1d1] text-[14px] text-[#222A4A] font-medium">
                $ {(data.item_data.variations[0].item_variation_data.price_money.amount / 100).toFixed(2)}
            </span>
        </div>
    ) : null;
});

OurMenuItems.displayName = "OurMenuItems";
export default OurMenu;
