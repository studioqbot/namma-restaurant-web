'use client';

import React, { useContext, useEffect, useState } from 'react';
import { LineItems } from '@/constants/types';
import GlobalContext from '@/constants/global-context';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { AnimatePresence, motion } from 'framer-motion';
import { fetchMenuHotSelling } from '../../../utils/fetchMenuHotSelling';
import placeHolder from '../../../../public/assets/images/place-holder.png';

interface ItemData {
  item_data: {
    id: string;
    name: string;
    image: string;
    price: string;
    category: string;
  };
}

interface NammaSpecialCardProps {
  data: ItemData;
  lineItems: LineItems[];
  setLineItems: React.Dispatch<React.SetStateAction<LineItems[]>>;
  setIsItemAdded: React.Dispatch<React.SetStateAction<boolean>>;
}

const NammaSpecials = () => {
  const { lineItems, setLineItems } = useContext(GlobalContext);
  const [load, setLoad] = useState(false);
  const [nammaSpecialItemsData, setNammaSpecialItemsData] = useState<ItemData[]>([]);
  const [shuffledItems, setShuffledItems] = useState<ItemData[]>([]);
  const router = useRouter();

  const fetchData = async () => {
    setLoad(true);
    try {
      const response = await fetchMenuHotSelling();
      if (response) {
        const transformedItems: ItemData[] = response.flatMap((category: any) =>
          category.items.map((item: any) => ({
            item_data: {
              id: item.item_id,
              name: item.name,
              image: item.image,
              price: item.amount,
              category: category.category_name,
            },
          }))
        );

        setNammaSpecialItemsData(transformedItems);
        localStorage.setItem(
          'nammaSpecialsData',
          JSON.stringify({ data: transformedItems, timestamp: Date.now() })
        );
      }
    } catch (error) {
      console.error('Error fetching hot selling menu:', error);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    const cached = localStorage.getItem('nammaSpecialsData');
    if (cached) {
      const parsed = JSON.parse(cached);
      const cacheAge = Date.now() - parsed.timestamp;

      if (cacheAge < 1000 * 60 * 60 * 24) {
        setNammaSpecialItemsData(parsed.data);
      } else {
        fetchData();
      }
    } else {
      fetchData();
    }
  }, []);

  useEffect(() => {
    const shuffleArray = (array: ItemData[]) => {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr.slice(0, 6);
    };

    if (nammaSpecialItemsData.length > 0) {
      setShuffledItems(shuffleArray(nammaSpecialItemsData));
      const interval = setInterval(() => {
        setShuffledItems(shuffleArray(nammaSpecialItemsData));
      }, 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [nammaSpecialItemsData]);

  return (
    <div className="max-w-6xl mx-auto px-[35px] py-[70px] pb-[30px] bg-white relative rounded-[22px] mt-[-100px]">
      <div className="h-full absolute w-full top-0 bottom-0 z-[1] flex justify-center">
        <Image
          src="/assets/images/bg-pattern1.svg"
          alt="background pattern"
          width={400}
          height={100}
          className="h-full absolute left-[24px] top-0 bottom-0 z-[1]"
        />
      </div>
      <div className="text-center flex justify-center">
        <Image
          src="/assets/images/namma-special.svg"
          width={167}
          height={58}
          alt="Namma Specials"
          className="absolute top-[-18px] z-[2]"
        />
      </div>

      {load || nammaSpecialItemsData.length === 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px' }}
            >
              <Skeleton height={150} width={150} style={{ borderRadius: '12px', marginBottom: '20px' }} />
              <Skeleton height={14} width={100} style={{ marginBottom: '6px' }} />
              <Skeleton height={14} width={70} style={{ marginBottom: '15px' }} />
              <Skeleton height={34} width={100} style={{ borderRadius: '100px' }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-y-[60px] mb-[40px] relative z-10">
          <AnimatePresence mode="popLayout">
            {shuffledItems.map((data, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2 }}
              >
                <NammaSpecialCard
                  data={data}
                  lineItems={lineItems}
                  setLineItems={setLineItems}
                  setIsItemAdded={() => {}}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <div className="text-center relative z-10">
        <button
          className="w-full max-w-md py-[15px] border border-[#A02621] rounded-[100px] mt-[11px] overflow-hidden text-[#A02621] text-[15px] font-medium"
          onClick={() => router.push('/our-menu')}
        >
          Explore Full Menu
        </button>
      </div>
    </div>
  );
};

const NammaSpecialCard = React.memo(({ data }: NammaSpecialCardProps) => {
  return (
    <div className="flex flex-col items-center rounded-lg text-center">
      <div className="relative overflow-hidden mb-4">
        {data.item_data.image ? (
          <Image
            src={data.item_data.image}
            width={100}
            height={100}
            alt={data.item_data.name}
            className="w-[163px] h-[163px] rounded-[15px]"
          />
        ) : (
          <Image
            src={placeHolder}
            width={100}
            height={100}
            alt="No image"
            className="w-[163px] h-[163px] rounded-[15px]"
          />
        )}
      </div>
      <h3 className="text-[12px] text-[#222A4A] font-medium px-[28px]">{data.item_data.name}</h3>
      <div className="flex flex-col items-center justify-between mt-auto">
        <span className="text-[13px] text-[#222A4A] font-bold mt-[15px]">
          {data.item_data.price}
        </span>
      </div>
    </div>
  );
});

NammaSpecialCard.displayName = 'NammaSpecialCard';
export default NammaSpecials;
