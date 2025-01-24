'use client'
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ImageType, NammaSpecialItems } from '../type';
import { nammaSpecialItems, catalogItems, orderCreateApi, orderUpdateApi } from '@/services/apiServices';
import GlobalContext from '@/constants/global-context';
import { CatelogFilterBody } from '../page';
import { getDataFromLocalStorage, isEmptyObj, setDataInLocalStorage } from '@/utils/genericUtilties';
import { LineItems, ModifierDataType, ModifierType, OrderDetailsType, OrderUpdateBodyAdd } from '@/constants/types';
import { useRouter } from 'next/navigation';
import dayjs, { Dayjs } from 'dayjs';


interface NammaSpecialCardProps {
  data: NammaSpecialItems
  image: ImageType | undefined;
  lineItems: LineItems[];
  setLineItems: React.Dispatch<React.SetStateAction<LineItems[]>>;
  setIsItemAdded: React.Dispatch<React.SetStateAction<boolean>>;
  modifierList: ModifierDataType[];

}


const NammaSpecials = () => {



  const { isOrderUpdate, setOrderDetails, lineItems, setLineItems, nammaSpecialItemsData, updateLineItem,
    setNammaSpecialItemsData, imageData, setImageData, orderDetails, setIsOrderUpdate, setIsOrdered } = useContext(GlobalContext);
  const [isItemAdded, setIsItemAdded] = useState(false);
  const [modifierList, setMofierList] = useState<ModifierDataType[]>([]);

  const router = useRouter()

  const getNammaSpeacialDatas = async () => {
    try {
      const body: CatelogFilterBody = {
        limit: 6,
        custom_attribute_filters: [
          {
            bool_filter: true,
            custom_attribute_definition_id: "MOY2QZ3ECH5SURG6SRQB3UEJ"
          }
        ]
      }
      const response = await nammaSpecialItems(body);
      if (response?.status === 200) {
        setNammaSpecialItemsData(response?.data?.items);
        setDataInLocalStorage('NammaSpecialItemsData', response?.data?.items);
        const currentTimePlusOneWeek = dayjs().add(1, 'week').toDate();
        setDataInLocalStorage('DateHome', currentTimePlusOneWeek);
      }


    } catch (error) {
      console.log('Error', error);

    }
  };

  console.log('modifierList', modifierList);


  const getNammaSpeacialItemsImage = async () => {
    try {
      const params = { types: 'IMAGE' }
      const response = await catalogItems(params);
      if (response?.status === 200) {
        setImageData(response?.data?.objects);
        setDataInLocalStorage('ImageData', response?.data?.objects);
        const currentTimePlusOneWeek = dayjs().add(1, 'week').toDate();
        setDataInLocalStorage('DateHome', currentTimePlusOneWeek);
      }


    } catch (error) {
      console.log(error);
    }
  }
  const getModifierListData = async () => {
    try {
      const params = { types: 'MODIFIER_LIST' };
      const response = await catalogItems(params);
      if (response?.status === 200) {
        setDataInLocalStorage('ModifierListData', response?.data?.objects);
        setMofierList(response?.data?.objects);
        const currentTimePlusOneWeek = dayjs().add(1, 'week').toDate();
        setDataInLocalStorage('DateHome', currentTimePlusOneWeek);
      };

    } catch (error) {
      console.log('Error', error);
    }
  };


  const orderCreate = async () => {

    const body = {
      order: {
        location_id: 'LC1BQTNRBNPKQ',
        line_items: lineItems,
        pricing_options: {
          auto_apply_taxes: true,
          auto_apply_discounts: true,
        },
      }
    }
    try {
      const response = await orderCreateApi(body)

      if (response?.status === 200) {
        setOrderDetails(response?.data?.order);
        setLineItems(response?.data?.order?.line_items);
        setDataInLocalStorage('OrderId', response?.data?.order?.id);
        setIsOrderUpdate('created');
        setIsOrdered(true);
      }


    } catch (error) {
      console.log('Error', error);
    }
  }

  const orderUpdate = async () => {

    const body: OrderUpdateBodyAdd = {
      order: {
        location_id: 'LC1BQTNRBNPKQ',
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

      if (response?.status === 200) {

        setOrderDetails(response?.data?.order);
        setLineItems(response?.data?.order?.line_items);
        setIsOrderUpdate('updated');
        setIsOrdered(true);
      }

    } catch (error) {
      console.log('Error', error);
    }
  };

  const getNammaSpeacialDataFromLocal = () => {
    const imageDatas: ImageType[] | null = getDataFromLocalStorage('ImageData');
    const nammaSpecialData: NammaSpecialItems[] | null = getDataFromLocalStorage('NammaSpecialItemsData');
    const modifierListDatas: ModifierDataType[] | null = getDataFromLocalStorage('ModifierListData');

    if (nammaSpecialData && nammaSpecialData?.length > 0) {
      setNammaSpecialItemsData(nammaSpecialData);
    }
    if (modifierListDatas && modifierListDatas?.length > 0) {
      setMofierList(modifierListDatas);
    }

    if (imageDatas && imageDatas?.length > 0) {
      setImageData(imageDatas);
    }

  }

  useEffect(() => {
    getNammaSpeacialDataFromLocal();
    const dateData: Dayjs | null = getDataFromLocalStorage('DateHome');
    if (((dayjs(dateData).isSame() || dayjs(dateData).isBefore()) || !dateData)) {
      getNammaSpeacialDatas();
      getNammaSpeacialItemsImage();
      getModifierListData();
    }


  }, [])

  useEffect(() => {
    if ((isOrderUpdate === 'create')) {
      orderCreate()
    } else if ((isOrderUpdate && isItemAdded)) {
      orderUpdate()
    }

  }, [isOrderUpdate]);


  return (
    <div className="max-w-6xl mx-auto px-[35px] py-[70px] pb-[30px] bg-white relative rounded-[22px] mt-[-100px]">
      <div className='h-full absolute w-full top-0 bottom-0 z-[1] flex justify-center'>
        <img src="/assets/images/bg-pattern1.svg" alt="banner-bg" className="h-full absolute top-0 bottom-0 z-[1]" />
      </div>
      <div className="text-center flex justify-center">
        <img src="/assets/images/namma-special.svg" alt="banner-bg" className="absolute top-[-18px] z-[2]" />
      </div>


      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-y-[60px] mb-[40px] relative z-10">
          {nammaSpecialItemsData?.length > 0 && nammaSpecialItemsData?.map((data) => {

            const image: ImageType | undefined = imageData?.find((img) => {
              if (data?.item_data?.image_ids?.length) {
                return img?.id === data?.item_data?.image_ids[0]
              }
              return null
            });

            return <NammaSpecialCard
              key={data?.id}
              image={image}
              data={data}
              lineItems={lineItems}
              setLineItems={setLineItems}
              setIsItemAdded={setIsItemAdded}
              modifierList={modifierList}

            />
          }

          )}
        </div>

        <div className="text-center relative z-10">
          <button
            className="w-full max-w-md py-[15px] border border-[#A02621] rounded-[100px] mt-[11px] overflow-hidden text-[#A02621] text-[15px] font-medium"
            onClick={() => router.push('/our-menu')}
          >
            Explore Full Menu
          </button>
        </div>
      </>
    </div>
  );
};


const NammaSpecialCard = React.memo((props: NammaSpecialCardProps) => {
  const { image, data, lineItems, setLineItems, setIsItemAdded, modifierList } = props
  const [quantity, setQuantity] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const { setCartItemCount, cartItemCount, isOrderUpdate, orderDetails, setUpdateLineItem, updateLineItem, setIsCountDecreased, setOrderDetails } = useContext(GlobalContext);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modifierListData, setModifierListData] = useState<ModifierType[]>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');

  const matchedItem: (LineItems | undefined) = useMemo(() => {
    return lineItems?.find(
      (dataItem: LineItems) => dataItem?.catalog_object_id === data?.item_data?.variations[0]?.id
    );
  }, [lineItems, data]);


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

    const count = quantityVal ? parseInt(quantityVal) : quantity;
    setCartItemCount(cartItemCount - 1);
    if (count == 1) {
      setIsCountDecreased(true)
      setIsItemAdded(false)
      setIsAdded(false);

      const updateItem = orderDetails?.line_items?.find((obj: LineItems) => obj.catalog_object_id === data?.item_data?.variations[0]?.id) as LineItems | undefined;;

      const removeLineItem = lineItems?.filter((item) => item?.catalog_object_id !== data?.item_data?.variations[0]?.id);
      setLineItems(removeLineItem);


      const removeUpdateLineItem = updateLineItem?.filter((item: LineItems) => item?.uid !== updateItem?.uid);
      setUpdateLineItem(removeUpdateLineItem);

      const removeLineItemUpdate = orderDetails?.line_items?.filter((item: LineItems) => item?.uid !== updateItem?.uid);
      setOrderDetails((prevData: OrderDetailsType) => {
        return { ...prevData, line_items: removeLineItemUpdate };
      });

    } else {
      setIsItemAdded(true);

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





  const handleAddClick = () => {
    setIsItemAdded(true)
    setQuantity(quantity + 1)
    setCartItemCount(cartItemCount + 1)
    setIsAdded(true);
    if (data?.item_data?.modifier_list_info && data?.item_data?.modifier_list_info[0]?.modifier_list_id) {
      setIsModalOpen(true);

      const modifierData = modifierList?.find((modifier) => modifier?.id === data?.item_data?.modifier_list_info[0]?.modifier_list_id) as ModifierDataType;

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

  const handleCheckboxChange = (modifierName: string, modifierId: string) => {
    setSelectedOption(modifierName);

    setLineItems((prevData) =>
      prevData.map((item: LineItems) => {
        const existingModifiers = item?.modifiers || [];
        const isDuplicate = existingModifiers.some(
          (modifier) => modifier.catalog_object_id === modifierId
        );
        return {
          ...item,
          modifiers: isDuplicate
            ? existingModifiers
            : [{ catalog_object_id: modifierId }],
        };
      })
    );


  };



  return <div className="flex flex-col items-center rounded-lg text-center">
    <div className="relative overflow-hidden mb-4">
      <img src={image?.image_data?.url ? image?.image_data?.url : '#'} alt="card-img" className="w-[163px] h-[163px] rounded-[15px]" />
    </div>

    <h3 className="text-[12px] text-[#222A4A] font-medium px-[28px]">{data?.item_data?.name}</h3>
    <div className="flex flex-col items-center justify-between mt-auto">
      <span className="text-[13px] text-[#222A4A] font-bold mt-[15px]">$ {data?.item_data?.variations[0]?.item_variation_data?.price_money?.amount}</span>


      {(isAdded || (matchedItem && !isEmptyObj(matchedItem))) ? <div className="flex items-center border border-[#A02621] rounded-[100px] mt-[11px] overflow-hidden text-[#A02621] text-[12px]">
        <button
          className="px-3 py-1 text-red-600 hover:bg-gray-100"
          onClick={() => handleQuantityDecrement(matchedItem?.quantity)}
        >
          -
        </button>
        <span className="px-3 py-1"> {matchedItem ? matchedItem?.quantity : quantity}</span>
        <button
          className="px-3 py-1 text-red-600 hover:bg-gray-100"
          onClick={() => {
            handleCountIncrement(matchedItem?.quantity)
          }}
        >
          +
        </button>
      </div> : <div className="flex items-center border border-[#A02621] rounded-[100px] mt-[11px] overflow-hidden text-[#A02621] text-[12px]">

        <button
          className="px-3 py-1 px-[10px] min-w-[100px] hover:bg-gray-100"
          onClick={() => handleAddClick()}
        >
          Add
        </button>
      </div>}


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
            {modifierListData && modifierListData?.length && modifierListData?.map((modifier: ModifierType) => (
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
            <div className='w-full flex justify-end mt-4' onClick={() => {
              selectedOption&&setIsModalOpen(false)}}>
              <button className='bg-[#FFC300] px-[32px] py-[5px] rounded-[100px] text-[14px] font-bold text-[#A02621] relative'>Confirm</button>
            </div>

          </div>
        </div>
      </div>
    )}
  </div>
})

NammaSpecialCard.displayName = "NammaSpecialCard";
export default NammaSpecials;