'use client'
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { ImageType, NammaSpecialItems } from '../type';
import { nammaSpecialItems, catalogItems } from '@/services/apiServices';
import GlobalContext from '@/constants/global-context';
import { CatelogFilterBody } from '../page';
import { getDataFromLocalStorage, isEmptyObj, setDataInLocalStorage } from '@/utils/genericUtilties';
import { LineItems, ModifierDataType, OrderDetailsType } from '@/constants/types';
import { useRouter } from 'next/navigation';
import dayjs, { Dayjs } from 'dayjs';
import placeHolder from '../../../../public/assets/images/place-holder.png'
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import "react-loading-skeleton/dist/skeleton.css";

interface NammaSpecialCardProps {
  data: NammaSpecialItems
  image: ImageType | undefined;
  lineItems: LineItems[];
  setLineItems: React.Dispatch<React.SetStateAction<LineItems[]>>;
  setIsItemAdded: React.Dispatch<React.SetStateAction<boolean>>;
  modifierList: ModifierDataType[];

}


const NammaSpecials = () => {



  const { lineItems, setLineItems, nammaSpecialItemsData,
    setNammaSpecialItemsData, imageData, setImageData } = useContext(GlobalContext);
  // const [setIsItemAdded] = useState(false);
  const [load, setLoad] = useState(false);
  const [modifierList, setMofierList] = useState<ModifierDataType[]>([]);
  const dataLimit = 6;
  const router = useRouter()

  const getNammaSpeacialDatas = async () => {
    try {
      const body: CatelogFilterBody = {
        limit: dataLimit,
        custom_attribute_filters: [
          {
            bool_filter: true,
            custom_attribute_definition_id: "P6DTBZV62JU2X2AXJQL34JH6"
            // custom_attribute_definition_id: "MOY2QZ3ECH5SURG6SRQB3UEJ"
          }
        ]
      }
      const response = await nammaSpecialItems(body);
      setLoad(false)
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
      setLoad(false)

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
      setLoad(false);

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
      setLoad(true)
      getNammaSpeacialDatas();
      getNammaSpeacialItemsImage();
      getModifierListData();
    }


  }, [])




  return (
    <div className="max-w-6xl mx-auto px-[35px] py-[70px] pb-[30px] bg-white relative rounded-[22px] mt-[-100px]">
      <div className='h-full absolute w-full top-0 bottom-0 z-[1] flex justify-center'>
        <Image src="/assets/images/bg-pattern1.svg" alt="banner-bg" width={400} height={100} className="h-full absolute left-[24px] top-0 bottom-0 z-[1]" />
      </div>
      <div className="text-center flex justify-center">
        <Image src="/assets/images/namma-special.svg" width={167} height={58} alt="banner-bg" className="absolute top-[-18px] z-[2]" />
      </div>
      <>
        {(load || nammaSpecialItemsData?.length === 0) ? <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
          {Array(6).fill(0).map((_, index) => (
            <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: '30px' }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: 'center' }}>
                <Skeleton height={150} width={150} style={{ borderRadius: "12px", marginBottom: '20px' }} />
                <Skeleton height={14} width={100} style={{ marginBottom: "6px" }} />
                <Skeleton height={14} width={70} style={{ marginBottom: "15px" }} />
                <Skeleton height={34} width={100} style={{ marginBottom: "6px", borderRadius: '100px' }} />
              </div>
            </div>
          ))}
        </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-y-[60px] mb-[40px] relative z-10">
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
              // setIsItemAdded={false}
              setIsItemAdded={() => { }}
              modifierList={modifierList}
            />
          }

          )}
        </div>}



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
  // const { image, data, lineItems, setLineItems, setIsItemAdded } = props
  const { image, data, lineItems, setLineItems } = props
  const [quantity, setQuantity] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const { setCartItemCount, cartItemCount, orderDetails, setUpdateLineItem,
    isCartOpen, updateLineItem, setFieldToClear, setIsCountDecreased, setOrderDetails } = useContext(GlobalContext);
  // const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  // const [modifierListData, setModifierListData] = useState<ModifierType[]>([]);
  // const [selectedOption, setSelectedOption] = useState<string>('');

  const matchedItem: (LineItems | undefined) = useMemo(() => {
    return lineItems?.find(
      (dataItem: LineItems) => dataItem?.catalog_object_id === data?.item_data?.variations[0]?.id
    );
  }, [lineItems, data]);

  const handleCountIncrement = async (quantityVal: string | undefined) => {
    // setIsItemAdded(true)
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

  }


  const handleQuantityDecrement = (quantityVal: string | undefined) => {
    // setIsItemAdded(true);
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

    };

    if (matchedItem?.quantity) {
      setQuantity(parseInt(matchedItem?.quantity) - 1);
    } else {
      setQuantity(quantity - 1)
    };
  };




  return <div className="flex flex-col items-center rounded-lg text-center">
    <div className="relative overflow-hidden mb-4">
      {image?.image_data?.url ?
        <Image src={image?.image_data?.url ? image?.image_data?.url : '#'} width={100} height={100} alt="card-img" className="w-[163px] h-[163px] rounded-[15px]" /> :
        <Image src={placeHolder} width={100} height={100} alt="card-img" className="w-[163px] h-[163px] rounded-[15px]" />}
    </div>

    <h3 className="text-[12px] text-[#222A4A] font-medium px-[28px]">{data?.item_data?.name}</h3>
    <div className="flex flex-col items-center justify-between mt-auto">
      <span className="text-[13px] text-[#222A4A] font-bold mt-[15px]">$ {data?.item_data?.variations[0]?.item_variation_data?.price_money?.amount / 100}</span>

      {isCartOpen && <>
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
        </div> :

          <></>

        }
      </>}

    </div>

  </div>
})

NammaSpecialCard.displayName = "NammaSpecialCard";
export default NammaSpecials;

