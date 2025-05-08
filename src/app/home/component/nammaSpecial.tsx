"use client";
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

interface NammaSpecialCardProps {
  data: any;
  lineItems: LineItems[];
  setLineItems: React.Dispatch<React.SetStateAction<LineItems[]>>;
  setIsItemAdded: React.Dispatch<React.SetStateAction<boolean>>;
}

const NammaSpecials = () => {
  const { lineItems, setLineItems } = useContext(GlobalContext);
  const [load, setLoad] = useState(false);
  const [nammaSpecialItemsData, setNammaSpecialItemsData] = useState<any[]>([]);
  const [shuffledItems, setShuffledItems] = useState<any[]>([]);
  const router = useRouter();

  const fetchData = async () => {
    setLoad(true);
    try {
      const response = await fetchMenuHotSelling(); // Fetching data

      if (response) {
        // Transform the response into the format needed
        const transformedItems = response.flatMap(category =>
          category.items.map(item => ({
            item_data: {
              id: item.item_id, // Item ID from response
              name: item.name, // Item name from response
              image: item.image, // Image URL from response
              price: item.amount, // Price from response
              category: category.category_name // Category name from response
            }
          }))
        );
        setNammaSpecialItemsData(transformedItems); // Set the transformed items

        // Save to cache with timestamp
        const cacheData = {
          data: transformedItems,
          timestamp: new Date().getTime(),
        };
        localStorage.setItem('nammaSpecialsData', JSON.stringify(cacheData));
      }
    } catch (error) {
      console.error('Error fetching hot selling menu:', error);
    } finally {
      setLoad(false);
    }
  };

  useEffect(() => {
    // Check cache first
    const cachedData = localStorage.getItem('nammaSpecialsData');
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      const cacheAge = new Date().getTime() - parsedData.timestamp;

      if (cacheAge < 1000 * 60 * 60 * 24) {
        // Data is less than 24 hours old, use it from cache
        setNammaSpecialItemsData(parsedData.data);
      } else {
        // Cache expired, fetch new data
        fetchData();
      }
    } else {
      // No cached data, fetch new data
      fetchData();
    }
  }, []);

  useEffect(() => {
    const shuffleArray = (array: any[]) => {
      const arr = [...array];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr.slice(0, 6); // Return only the first 6 items
    };

    if (nammaSpecialItemsData.length > 0) {
      setShuffledItems(shuffleArray(nammaSpecialItemsData));

      const interval = setInterval(() => {
        setShuffledItems(shuffleArray(nammaSpecialItemsData));
      }, 1000 * 60); // Shuffle every 60 seconds

      return () => clearInterval(interval);
    }
  }, [nammaSpecialItemsData]);

  return (
    <div className="max-w-6xl mx-auto px-[35px] py-[70px] pb-[30px] bg-white relative rounded-[22px] mt-[-100px]">
      <div className="h-full absolute w-full top-0 bottom-0 z-[1] flex justify-center">
        <Image src="/assets/images/bg-pattern1.svg" alt="banner-bg" width={400} height={100} className="h-full absolute left-[24px] top-0 bottom-0 z-[1]" />
      </div>
      <div className="text-center flex justify-center">
        <Image src="/assets/images/namma-special.svg" width={167} height={58} alt="banner-bg" className="absolute top-[-18px] z-[2]" />
      </div>
      <>
        {(load || nammaSpecialItemsData.length === 0) ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
            {Array(10).fill(0).map((_, index) => (
              <div key={index} style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: '30px' }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: 'center' }}>
                  <Skeleton height={150} width={150} style={{ borderRadius: "12px", marginBottom: '20px' }} />
                  <Skeleton height={14} width={100} style={{ marginBottom: "6px" }} />
                  <Skeleton height={14} width={70} style={{ marginBottom: "15px" }} />
                  <Skeleton height={34} width={100} style={{ marginBottom: "6px", borderRadius: '100px' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-y-[60px] mb-[40px] relative z-10">
            <AnimatePresence mode="popLayout">
              {shuffledItems.map((data, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2 }} // Smooth transition for opacity
                >
                  <NammaSpecialCard
                    data={data}
                    lineItems={lineItems}
                    setLineItems={setLineItems}
                    setIsItemAdded={() => { }}
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
      </>
    </div>
  );
};

const NammaSpecialCard = React.memo((props: NammaSpecialCardProps) => {
  const { data } = props;

  return (
    <div className="flex flex-col items-center rounded-lg text-center">
      <div className="relative overflow-hidden mb-4">
        {data?.item_data?.image ? (
          <Image src={data?.item_data?.image} width={100} height={100} alt="card-img" className="w-[163px] h-[163px] rounded-[15px]" />
        ) : (
          <Image src={placeHolder} width={100} height={100} alt="card-img" className="w-[163px] h-[163px] rounded-[15px]" />
        )}
      </div>
      <h3 className="text-[12px] text-[#222A4A] font-medium px-[28px]">{data?.item_data?.name}</h3>
      <div className="flex flex-col items-center justify-between mt-auto">
        <span className="text-[13px] text-[#222A4A] font-bold mt-[15px]">{data?.item_data?.price}</span>
      </div>
    </div>
  );
});

NammaSpecialCard.displayName = 'NammaSpecialCard';
export default NammaSpecials;
