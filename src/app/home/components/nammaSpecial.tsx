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
  const [load, setLoad] = useState(false);
  const [modifierList, setMofierList] = useState<ModifierDataType[]>([]);
  const [shuffledItems, setShuffledItems] = useState<NammaSpecialItems[]>([]); // <-- added

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
  }, []);

  // <-- shuffle items every 1 min
  // useEffect(() => {
  //   if (nammaSpecialItemsData?.length > 0) {
  //     const shuffleArray = (array: NammaSpecialItems[]) => {
  //       const arr = [...array];
  //       for (let i = arr.length - 1; i > 0; i--) {
  //         const j = Math.floor(Math.random() * (i + 1));
  //         [arr[i], arr[j]] = [arr[j], arr[i]];
  //       }
  //       return arr;
  //     };

  //     setShuffledItems(shuffleArray(nammaSpecialItemsData));

  //     const interval = setInterval(() => {
  //       setShuffledItems(shuffleArray(nammaSpecialItemsData));
  //     }, 1000); // shuffle every 1 minute 60000

  //     return () => clearInterval(interval);
  //   }
  // }, [nammaSpecialItemsData]);
  // -->

useEffect(() => {
  const shuffleArray = (array: NammaSpecialItems[]) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  if (nammaSpecialItemsData?.length > 0) {
    setShuffledItems(shuffleArray(nammaSpecialItemsData)); // initial shuffle

    const interval = setInterval(() => {
      setShuffledItems(shuffleArray(nammaSpecialItemsData)); // re-shuffle every 60 sec
    }, 1000);

    return () => clearInterval(interval); // cleanup
  }
}, [nammaSpecialItemsData]); // <== key part, this should run only when source data changes

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
          {shuffledItems?.map((data) => { // <-- replaced original loop
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
              setIsItemAdded={() => { }}
              modifierList={modifierList}
            />
          })}
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
  const { image, data } = props

  return <div className="flex flex-col items-center rounded-lg text-center">
    <div className="relative overflow-hidden mb-4">
      {image?.image_data?.url ?
        <Image src={image?.image_data?.url ? image?.image_data?.url : '#'} width={100} height={100} alt="card-img" className="w-[163px] h-[163px] rounded-[15px]" /> :
        <Image src={placeHolder} width={100} height={100} alt="card-img" className="w-[163px] h-[163px] rounded-[15px]" />}
    </div>

    <h3 className="text-[12px] text-[#222A4A] font-medium px-[28px]">{data?.item_data?.name}</h3>
    <div className="flex flex-col items-center justify-between mt-auto">
      <span className="text-[13px] text-[#222A4A] font-bold mt-[15px]">$ {data?.item_data?.variations[0]?.item_variation_data?.price_money?.amount / 100}</span>
    </div>
  </div>
})

NammaSpecialCard.displayName = "NammaSpecialCard";
export default NammaSpecials;
