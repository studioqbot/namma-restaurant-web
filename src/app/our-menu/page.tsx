/* eslint-disable */
"use client";

import GlobalContext from "@/constants/global-context";
import React, { useContext, useEffect, useState } from "react";
import { fetchMenu } from "../../utils/fetcMenu";
import { fetchMenuItemList } from "../../utils/fetchMenuItemList";
import { fetchMenuHotSelling } from "../../utils/fetchMenuHotSelling";

type CategoryWithName = {
    category_name: string;
    category_id: string;
    name: string;
};

const OurMenu = () => {
    const [categories, setCategories] = useState<CategoryWithName[]>([]);
    const [itemList, setItemList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true); // Loader state

    const { activeMenu, setActiveMenu } = useContext(GlobalContext);
    console.log({ activeMenu })
    useEffect(() => {

        const fetchMenuList = async () => {
            try {
                const response = await fetch('api/menu-list');
                const data = await response.json();
                // console.log("newmenu",data)
                setCategories(data.categoryList);
                setLoading(false)
            } catch (error) {
                console.error('Error fetching menu list:', error);
            }
        };
        const fetchItemList = async () => {
            try {
                const response = await fetch('api/item-list');
                const data = await response.json();
                // console.log("newmenulist",data)
                setItemList(data.menu_items);
                setLoading(false)


            } catch (error) {
                console.error('Error fetching menu list:', error);
            }
        };
        fetchItemList();
        fetchMenuList();
    }, []);
    // console.log("newmenulist", itemList)
    console.log("newmenucategories", categories)

    const filteredList = 
        activeMenu === "All"
            ? itemList
            : itemList.filter((item) => item.category_id === activeMenu);

    if (loading) {
        return (
            <div className="w-full flex justify-center items-center h-[60vh]">
                <div className="text-[#A02621] text-xl font-semibold">Refreshing menu...</div>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="container">
                {/* Tabs */}
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
                            All <span className="text-[#222A4A] h-[18px] overflow-hidden mt-[-5px] pl-[4] pr-[4]">|</span>
                        </button>

                        {categories
                            // .filter((item) => item.name !== "Namma Menu")
                            .map((menu, i) => (
                                <button
                                    key={i}
                                    className={`text-[#222A4A] leading-[29px] text-[13px] ${activeMenu === menu.category_name ? "text-[#A02621] font-semibold" : "text-[#222A4A]"}`}
                                    onClick={() => setActiveMenu(menu.category_name)}
                                >
                                    {menu.category_name}
                                    <span className="text-[#222A4A] h-[18px] overflow-hidden mt-[-5px] px-[5px]">|</span>
                                </button>
                            ))}
                    </div>
                </div>

                {/* Menu content */}
                <div className="grid grid-cols-12 gap-[40px]">
                    <div className="col-span-6">
                        <div className="p-6">
                            {filteredList
                                .slice(0, Math.ceil(filteredList.length / 2))
                                .map((category, i) => (
                                    <div key={i} className="mb-8">
                                        <h2 className="text-2xl font-bold mb-4 bg-[#eee1d1] p-2 rounded">
                                            {category.category_id}
                                        </h2>
                                        <div className="space-y-2">
                                            {category.items?.map((item: any, i: any) => (
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
                            {filteredList
                                .slice(Math.ceil(filteredList.length / 2))
                                .map((category) => (
                                    <div key={category.category_name} className="mb-8">
                                        <h2 className="text-2xl font-bold mb-4 bg-[#eee1d1] p-2 rounded">
                                            {category.category_id}
                                        </h2>
                                        <div className="space-y-2">
                                            {category.items?.map((item: any, i: any) => (
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
