'use client';
import GlobalContext from '@/constants/global-context';
import { CatalogItemsType, CategoryDataType, LineItems, ModifierDataType, ModifierIds, ModifierType, OrderCreateBody, OrderDetailsType, OrderUpdateBodyAdd } from '@/constants/types';
import { catalogItems, orderCreateApi, orderUpdateApi } from '@/services/apiServices';
import { getDataFromLocalStorage, isEmptyObj, removeItemFrmLocalStorage, setDataInLocalStorage } from '@/utils/genericUtilties';
import dayjs, { Dayjs } from 'dayjs';
import React, { useContext, useEffect, useMemo, useState } from 'react';


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

};

const OurMenu = () => {


    const {
        isOrderUpdate, setOrderDetails, lineItems, setLineItems,
        catalogCategoryAndItem, setCatalogCategoryAndItem, catalogCategory,
        setCatalogCategory, catalogCategoryTab, setCatalogCategoryTab,
        activeMenu, setActiveMenu, setIsOrderUpdate, orderDetails,
        updateLineItem, setUpdateLineItem, setIsOrdered, setGlobalLoading
    } = useContext(GlobalContext);

    const [isItemAdded, setIsItemAdded] = useState(false);
    const [modifierList, setMofierList] = useState<ModifierDataType[]>([]);
    const [modifierIds, setModifierIds] = useState<ModifierIds[]>([]);
    const [fieldToClear, setFieldToClear] = useState<string[]>([]);


    const getModifierListData = async () => {
        try {
            const params = { types: 'MODIFIER_LIST' }
            const response = await catalogItems(params);
            if (response?.status === 200) {
                setDataInLocalStorage('ModifierListData', response?.data?.objects);
                setMofierList(response?.data?.objects);
            }

        } catch (error) {
            console.log('Error', error);
        }
    };

    const getCatalofCategoryData = async () => {
        try {
            const params = { types: 'CATEGORY' }
            const response = await catalogItems(params);
            if (response?.status === 200) {
                setDataInLocalStorage('CatalogCategoryData', response?.data?.objects);
                setCatalogCategory(response?.data?.objects);
                setCatalogCategoryTab(response?.data?.objects);
            }

        } catch (error) {
            console.log('Error', error);
        }
    };

    const getCatalofItemAndCAtegoryData = async () => {
        try {
            const params = { types: 'ITEM' }
            const response = await catalogItems(params);
            if (response?.status === 200) {
                setDataInLocalStorage('CatalogItemsData', response?.data?.objects)
                const currentTimePlusFiveMinutes = dayjs().add(1, 'week').toDate();

                setDataInLocalStorage('Date', currentTimePlusFiveMinutes);

                setCatalogCategoryAndItem(response?.data?.objects)
            }


        } catch (error) {
            console.log('Error', error);

        }
    };

    const handleCategoryTabs = async (categoryItem: CategoryDataType) => {

        setActiveMenu(categoryItem?.category_data?.name);
        setCatalogCategory([
            categoryItem
        ])

    };

    const getOurMenuDatasFromLocal = () => {
        const itemAndCategoryData: CatalogItemsType[] | null = getDataFromLocalStorage('CatalogItemsData');
        const categoryData: CategoryDataType[] | null = getDataFromLocalStorage('CatalogCategoryData');
        const modifierData: ModifierDataType[] | null = getDataFromLocalStorage('ModifierListData');


        if (itemAndCategoryData && itemAndCategoryData?.length) {
            setCatalogCategoryAndItem(itemAndCategoryData)

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
        const dateData: Dayjs | null = getDataFromLocalStorage('Date');

        if (activeMenu === 'All') {
            getOurMenuDatasFromLocal();
        }

        if (((dayjs(dateData).isSame() || dayjs(dateData).isBefore()) || !dateData)) {
            if (activeMenu === 'All') {
                getCatalofItemAndCAtegoryData();
                getCatalofCategoryData();
                getModifierListData();
            }

        }

    }, []);

    const orderCreate = async () => {
        setGlobalLoading(true)
        const body: OrderCreateBody = {
            order: {
                location_id: process.env.NEXT_PUBLIC_LOCATION_ID,
                line_items: lineItems,
                modifiers: modifierIds,
                pricing_options: {
                    auto_apply_taxes: true,
                    auto_apply_discounts: true,
                },
            }
        }
        if (modifierIds?.length > 0) {
            delete body?.order?.modifiers
        }
        try {
            const response = await orderCreateApi(body);
            setGlobalLoading(false)
            if (response?.status === 200) {
                setIsOrderUpdate('created');
                setOrderDetails(response?.data?.order);
                setLineItems(response?.data?.order?.line_items || []);
                setDataInLocalStorage('OrderId', response?.data?.order?.id);
                setIsOrdered(true);


            };

        } catch (error) {
            setGlobalLoading(false)
            console.log('Error', error);
        };
    };

    const orderUpdate = async () => {
        setGlobalLoading(true)
        const body: OrderUpdateBodyAdd = {
            fields_to_clear: fieldToClear,
            order: {
                location_id: process.env.NEXT_PUBLIC_LOCATION_ID,
                line_items: updateLineItem,

                pricing_options: {
                    auto_apply_taxes: true,
                    auto_apply_discounts: true,
                },
                version: orderDetails?.version
            }
        }
        try {
            const response = await orderUpdateApi(body, orderDetails?.id)
            setGlobalLoading(false)
            if (response?.status === 200) {
                setIsOrdered(true);
                setOrderDetails(response?.data?.order);
                setLineItems(response?.data?.order?.line_items || []);
                setIsOrderUpdate('updated');
                setUpdateLineItem([])

            }

        } catch (error) {
            setGlobalLoading(false)
            console.log('Error', error);
        }
    };




    useEffect(() => {
        if (lineItems?.length === 0) {
            removeItemFrmLocalStorage(['OrderId'])
        }
        if ((isOrderUpdate === 'create')) {
            orderCreate();
        } else if ((isOrderUpdate && isItemAdded)) {
            orderUpdate();
        }

    }, [isOrderUpdate]);





    return (
        <div className="w-full">
            <div className="container">
                <div className='w-full flex items-center py-[20px] relative mt-[55px] mb-[60px]'>
                    <span className="absolute top-0 left-0 w-full h-[4px] border-t-[0.5px] border-b-[0.5px] border-[#222A4A]" />
                    <span className="absolute bottom-0 left-0 w-full h-[4px] border-t-[0.5px] border-b-[0.5px] border-[#222A4A]" />
                    <span className='text-[#A02621] text-[27px] leading-[31px] font-semibold font-unbounded bg-[#eee1d1] absolute pr-[10px] top-[-14px] left-0'>Our Menu</span>
                    <div className="flex flex-row items-center overflow-x-auto whitespace-nowrap justify-between w-full">
                        <button
                            className={`text-[#222A4A] leading-[29px] text-[13px]  ${activeMenu === "All"
                                ? "text-[#A02621] font-semibold"
                                : "text-[#222A4A]"
                                }`}
                            onClick={() => {
                                setCatalogCategory([...catalogCategoryTab])
                                setActiveMenu("All")
                            }}
                        >
                            All
                            <span className="text-[#222A4A] h-[18px] overflow-hidden mt-[-5px]">|</span>
                        </button>

                        {catalogCategoryTab?.map((item) => (
                            <button
                                key={item?.id}
                                className={`text-[#222A4A] leading-[29px] text-[13px]  ${activeMenu === item?.category_data?.name
                                    ? "text-[#A02621] font-semibold"
                                    : "text-[#222A4A]"
                                    }`}
                                onClick={() => handleCategoryTabs(item)}
                            >
                                {item?.category_data?.name}
                                <span className="text-[#222A4A] h-[18px] overflow-hidden mt-[-5px] px-[5px]">|</span>
                            </button>


                        ))}
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-[40px]">
                    <div className="col-span-6">
                        <div className="p-6">
                            {catalogCategory?.slice(0, Math.ceil(catalogCategory?.length / 2))?.map((category) => {
                                const catalogItems = catalogCategoryAndItem?.filter((itemData: CatalogItemsType) => {
                                    return itemData?.item_data?.category_id === category?.id;
                                });
                                return <div key={category?.id} className="col-span-6">
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
                            })}
                        </div>
                    </div>

                    <div className="col-span-6">
                        <div className="p-6">
                            {catalogCategory?.slice(Math.ceil(catalogCategory?.length / 2))?.map((category) => {
                                const catalogItems = catalogCategoryAndItem?.filter((itemData: CatalogItemsType) => {
                                    return itemData?.item_data?.category_id === category?.id;
                                });
                                return <div key={category?.id} className="col-span-6">
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
                            })}
                        </div>
                    </div>
                </div>
            </div>

        </div>

    );
};

const OurMenuItems = React.memo(({ data, setLineItems, lineItems, setUpdateLineItem, setIsItemAdded, updateLineItem, modifierList, setFieldToClear }: OurMenuItemsType) => {

    const [quantity, setQuantity] = useState(0);
    const [modifierListData, setModifierListData] = useState<ModifierType[] | undefined>([]);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedOption, setSelectedOption] = useState<string>('');




    const [isAdded, setIsAdded] = useState(false);
    const { setCartItemCount, cartItemCount, isOrderUpdate, orderDetails, setOrderDetails, setIsCountDecreased } = useContext(GlobalContext);

    const matchedItem = useMemo(() => {
        return orderDetails?.line_items?.find(
            (dataItem: LineItems) => dataItem?.catalog_object_id === data?.item_data?.variations[0]?.id
        );
    }, [lineItems, data]);



    const handleAddClick = () => {
        setIsItemAdded(true)
        setQuantity(quantity + 1);
        setCartItemCount(cartItemCount + 1);
        setIsAdded(true);
        console.log('modifierData', data?.item_data?.modifier_list_info);
        if (data?.item_data?.modifier_list_info && data?.item_data?.modifier_list_info[0]?.modifier_list_id) {
            setIsModalOpen(true);

            const modifierData = modifierList?.find((modifier) => modifier?.id === data?.item_data?.modifier_list_info[0]?.modifier_list_id)

            setModifierListData(modifierData?.modifier_list_data?.modifiers)

        }

        if (!isOrderUpdate) {
            setLineItems([...lineItems, {
                quantity: String(quantity + 1),
                catalog_object_id: data?.item_data?.variations[0]?.id,
            }]);
        } else {
            setLineItems((prevData: LineItems[]) => {
                return [...prevData, {
                    quantity: String(quantity + 1),
                    catalog_object_id: data?.item_data?.variations[0]?.id,
                }]
            });
            setUpdateLineItem((prevData: LineItems[]) => {
                return [...prevData, {
                    quantity: String(quantity + 1),
                    catalog_object_id: data?.item_data?.variations[0]?.id,
                }]
            })
        }
    }


    const handleCountIncrement = async (quantityVal: string | undefined) => {
        setIsItemAdded(true)
        const count = quantityVal ? parseInt(quantityVal) : quantity;

        setQuantity(count + 1);
        setCartItemCount(cartItemCount + 1);
        setLineItems((prevData: LineItems[]) => {
            const items = prevData.find((obj: LineItems) => obj.catalog_object_id === data?.item_data?.variations[0]?.id);
            if (items) {
                items.quantity = String(count + 1);
                return prevData;
            }
            return prevData
        });
        if ((isOrderUpdate === 'update' || isOrderUpdate === 'created' || isOrderUpdate === 'updated')) {
            const updateItem = orderDetails?.line_items?.find((obj: LineItems) => obj.catalog_object_id === data?.item_data?.variations[0]?.id) as LineItems | undefined;;

            setUpdateLineItem((prevData: LineItems[]) => {
                const items = prevData.find((obj: LineItems) => obj.catalog_object_id === data?.item_data?.variations[0]?.id);

                if (!items) {
                    return [...prevData, {
                        quantity: String(count + 1),
                        uid: updateItem?.uid,
                        catalog_object_id: data?.item_data?.variations[0]?.id
                    }]
                } else {
                    items.quantity = String(count + 1);
                    items.uid = updateItem?.uid;
                    return prevData;
                }
            });
        }
    }


    const handleQuantityDecrement = (quantityVal: string | undefined) => {
        setIsItemAdded(true);
        const count = quantityVal ? parseInt(quantityVal) : quantity;
        setCartItemCount(cartItemCount - 1);
        if (count == 1) {
            setIsCountDecreased(true)
            setIsAdded(false);


            const updateItem = orderDetails?.line_items?.find((obj: LineItems) => obj.catalog_object_id === data?.item_data?.variations[0]?.id) as LineItems | undefined;;
            setFieldToClear((prevData) => [...prevData, `line_items[${updateItem?.uid}]`] as string[])
            const removeLineItem = lineItems?.filter((item) => item?.catalog_object_id !== data?.item_data?.variations[0]?.id);
            setLineItems(removeLineItem);


            const removeUpdateLineItem = updateLineItem?.filter((item: LineItems) => item?.uid !== updateItem?.uid);
            setUpdateLineItem(removeUpdateLineItem);

            const removeLineItemUpdate = orderDetails?.line_items?.filter((item: LineItems) => item?.uid !== updateItem?.uid);
            setOrderDetails((prevData: OrderDetailsType) => {
                return { ...prevData, line_items: removeLineItemUpdate };
            });

        } else {

            setLineItems((prevData: LineItems[]) => {
                const item = prevData.find((obj: LineItems) => obj.catalog_object_id === data?.item_data?.variations[0]?.id);
                if (item) {
                    item.quantity = String(count - 1);
                    return prevData;
                }
                return prevData;
            });

            if ((isOrderUpdate === 'update' || isOrderUpdate === 'created' || isOrderUpdate === 'updated')) {
                const updateItem = orderDetails?.line_items?.find((obj: LineItems) => obj.catalog_object_id === data?.item_data?.variations[0]?.id) as LineItems | undefined;

                setUpdateLineItem((prevData: LineItems[]) => {
                    const items = prevData.find((obj: LineItems) => obj.catalog_object_id === data?.item_data?.variations[0]?.id);
                    if (!items) {
                        return [...prevData, {
                            quantity: String(count - 1),
                            uid: updateItem?.uid,
                            catalog_object_id: data?.item_data?.variations[0]?.id
                        }]
                    } else {
                        items.quantity = String(count - 1);
                        items.uid = updateItem?.uid;
                        return prevData;
                    }
                });
            }
        };

        if (matchedItem?.quantity) {
            setQuantity(parseInt(matchedItem?.quantity) - 1);
        } else {
            setQuantity(quantity - 1)
        };
    };


    const handleCheckboxChange = (modifierName: string, modifierId: string) => {
        setSelectedOption(modifierName);



        setLineItems((prevData: LineItems[]) => {
            const addModifier = prevData?.find((item) => item.catalog_object_id === data?.item_data?.variations[0]?.id);
            if (addModifier) {
                addModifier.modifiers = [{ catalog_object_id: modifierId }]
            }
            return prevData
        }

        );

        if (isOrderUpdate && isOrderUpdate !== 'create') {
            setUpdateLineItem((prevData: LineItems[]) => {
                const addModifier = prevData?.find((item) => item.catalog_object_id === data?.item_data?.variations[0]?.id);
                if (addModifier) {
                    addModifier.modifiers = [{ catalog_object_id: modifierId }]
                }
                return prevData
            }

            );
        }


    };



    return (
        <div className="flex items-center justify-between py-2 relative">
            <span className='absolute w-full border-b border-dotted border-[#222A4A] z-[-1]' />
            <span className="bg-[#eee1d1] text-[14px] text-[#222A4A] pr-[25px]">{data?.item_data?.name}</span>
            <div className="flex items-center bg-[#eee1d1] gap-4 pl-[11px]">
                <span className="bg-[#eee1d1] text-[14px] text-[#222A4A] font-medium">${data?.item_data?.variations[0]?.item_variation_data?.price_money?.amount}</span>
                {(isAdded || (matchedItem && !isEmptyObj(matchedItem))) ? <div className="flex items-center min-w-[100px] border border-[#A02621] rounded-[100px] overflow-hidden text-[#A02621] text-[12px]">
                    <button
                        onClick={() => handleQuantityDecrement(matchedItem?.quantity)}
                        className="px-3 py-1 text-red-600 hover:bg-gray-100"
                    >
                        -
                    </button>
                    <span className="px-3 py-1 text-red-600">
                        {matchedItem ? matchedItem?.quantity : quantity}
                    </span>
                    <button
                        onClick={() => {
                            handleCountIncrement(matchedItem?.quantity)
                        }}
                        className="px-3 py-1 text-red-600 hover:bg-gray-100"
                    >
                        +
                    </button>
                </div> : <button
                    onClick={() => {


                        handleAddClick()
                    }}
                    className="py-[4px] min-w-[100px] border border-[#A02621] rounded-[100px] overflow-hidden text-[#A02621] text-[12px]"
                >
                    Add
                </button>}
            </div>
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[99999]"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div
                        className="bg-white rounded-lg w-[330px] p-[30px] relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-full flex flex-col items-start justify-center">
                            <h2 className="text-lg font-semibold text-gray-800 mb-[10px]">Customization</h2>
                            {modifierListData && modifierListData?.length && modifierListData.map((modifier: ModifierType) => (
                                <div
                                    key={modifier?.id}
                                    className="flex items-center justify-between w-full py-[10px] relative"
                                >
                                    <span className='absolute w-full border-b border-dotted border-[#222A4A] z-[1]' />
                                    <span className=" bg-white min-w-[100px] relative z-[2]">{modifier?.modifier_data?.name}</span>
                                    <div className="bg-white relative z-[2] flex pl-[10px]">

                                        <input
                                            type='radio'
                                            id={modifier?.modifier_data?.name}
                                            name="customization"
                                            value={modifier?.modifier_data?.name}
                                            checked={selectedOption === modifier?.modifier_data?.name}
                                            onChange={() => handleCheckboxChange(modifier?.modifier_data?.name, modifier?.id)}
                                            className="hidden peer"
                                        />

                                        <label
                                            htmlFor={modifier?.modifier_data?.name}
                                            className="w-5 h-5 border border-[#222A4A] rounded-full flex items-center justify-center cursor-pointer peer-checked:border-[#A02621] peer-checked:bg-[#A02621]"
                                        >
                                            <div className="w-2.5 h-2.5 bg-white rounded-full peer-checked:bg-[#A02621]"></div>
                                        </label>
                                    </div>

                                    {/* <span className=' bg-white relative z-[2] flex pl-[10px]'>
                                    
                                    </span> */}

                                </div>
                            ))}

                            <div className='w-full flex justify-end mt-4' onClick={() => setIsModalOpen(false)}>
                                <button className='bg-[#FFC300] px-[32px] py-[5px] rounded-[100px] text-[14px] font-bold text-[#A02621] relative'>Confirm</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
});

OurMenuItems.displayName = "OurMenuItems";
export default OurMenu;
