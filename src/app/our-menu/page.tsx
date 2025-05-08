"use client";
import GlobalContext from "@/constants/global-context";
import {
    CatalogItemsType,
    LineItems,
    ModifierDataType,
    ModifierIds,
} from "@/constants/types";
import React, { useContext, useEffect, useState } from "react";
import { fetchMenu } from "../../utils/fetcMenu";
import { fetchMenuItemList } from "../../utils/fetchMenuItemList";

type CategoryWithName = {
    name: string;
};

const OurMenu = () => {
    const [categories, setCategories] = useState<CategoryWithName[]>([]);
    const [itemList, setItemList] = useState<any[]>([]);
    const [isItemAdded, setIsItemAdded] = useState(false);
    const [modifierList, setMofierList] = useState<ModifierDataType[]>([]);
    const [modifierIds, setModifierIds] = useState<ModifierIds[]>([]);
    const [fieldToClear, setFieldToClear] = useState<string[]>([]);

    const {
        lineItems,
        setLineItems,
        activeMenu,
        setActiveMenu,
        updateLineItem,
        setUpdateLineItem,
    } = useContext(GlobalContext);

    const getCachedData = (key: string, ttl: number) => {
        const cachedData = localStorage.getItem(key);
        if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData);
            const currentTime = new Date().getTime();
            if (currentTime - timestamp < ttl) return data;
        }
        return null;
    };

    useEffect(() => {
        const cachedCategories = getCachedData("categories", 24 * 60 * 60 * 1000);
        if (cachedCategories) {
            setCategories(cachedCategories);
        } else {
            fetchMenu().then((cats: any) => {
                if (cats) {
                    setCategories(cats);
                    localStorage.setItem(
                        "categories",
                        JSON.stringify({ data: cats, timestamp: new Date().getTime() })
                    );
                }
            });
        }

        const cachedMenuItems = getCachedData("menuItems", 24 * 60 * 60 * 1000);
        if (cachedMenuItems) {
            setItemList(cachedMenuItems);
        } else {
            fetchMenuItemList().then((menuList: any) => {
                if (menuList) {
                    setItemList(menuList);
                    localStorage.setItem(
                        "menuItems",
                        JSON.stringify({ data: menuList, timestamp: new Date().getTime() })
                    );
                }
            });
        }
    }, []);

    // Filtered list by selected category
    const filteredList = activeMenu === "All"
        ? itemList
        : itemList.filter((item) => item.category_name === activeMenu);

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
                            onClick={() => setActiveMenu("All")}
                        >
                            All <span className="text-[#222A4A] h-[18px] overflow-hidden mt-[-5px]">|</span>
                        </button>

                        {categories.map((item, i) => (
                            <button
                                key={i}
                                className={`text-[#222A4A] leading-[29px] text-[13px] ${activeMenu === item.name ? "text-[#A02621] font-semibold" : "text-[#222A4A]"}`}
                                onClick={() => setActiveMenu(item.name)}
                            >
                                {item.name}
                                <span className="text-[#222A4A] h-[18px] overflow-hidden mt-[-5px] px-[5px]">|</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Menu content */}
                {/* Menu content */}
                <div className="grid grid-cols-12 gap-[40px]">
                    <div className="col-span-6">
                        <div className="p-6">
                            {filteredList.slice(0, Math.ceil(filteredList.length / 2)).map((category, i) => (
                                <div key={i} className="mb-8">
                                    <h2 className="text-2xl font-bold mb-4 bg-[#eee1d1] p-2 rounded">
                                        {category.category_name}
                                    </h2>
                                    <div className="space-y-2">
                                        {category.items?.map((item:any, i:any) => (
                                            !!item.amount && (
                                                <div
                                                    key={i}
                                                    className="flex items-center justify-between py-2 relative"
                                                >
                                                    <span className="absolute w-full border-b border-dotted border-[#222A4A] z-[-1]" />
                                                    <span className="bg-[#eee1d1] text-[14px] text-[#222A4A] pr-[25px]">
                                                        {item.name}
                                                    </span>
                                                    <span className="bg-[#eee1d1] text-[14px] text-[#222A4A] font-medium">
                                                        {item.amount}
                                                    </span>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="col-span-6">
                        <div className="p-6">
                            {filteredList.slice(Math.ceil(filteredList.length / 2)).map((category) => (
                                <div key={category.category_name} className="mb-8">
                                    <h2 className="text-2xl font-bold mb-4 bg-[#eee1d1] p-2 rounded">
                                        {category.category_name}
                                    </h2>
                                    <div className="space-y-2">
                                        {category.items?.map((item:any, i:any) => (
                                            !!item.amount && (
                                                <div
                                                    key={i}
                                                    className="flex items-center justify-between py-2 relative"
                                                >
                                                    <span className="absolute w-full border-b border-dotted border-[#222A4A] z-[-1]" />
                                                    <span className="bg-[#eee1d1] text-[14px] text-[#222A4A] pr-[25px]">
                                                        {item.name}
                                                    </span>
                                                    <span className="bg-[#eee1d1] text-[14px] text-[#222A4A] font-medium">
                                                        {item.amount}
                                                    </span>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default OurMenu;
