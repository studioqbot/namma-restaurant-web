'use client'
import React, { useContext, useEffect } from 'react';
import Link from "next/link";

import GlobalContext from '@/constants/global-context';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';
import Image from 'next/image';

function Header() {
  // const { cartItemCount, setIsOrderUpdate, isOrderUpdate, lineItems, setIsCartOpen ,isCartOpen} = useContext(GlobalContext);
  const { setIsCartOpen } = useContext(GlobalContext);
  const router = useRouter()


  const operationalHours: { [key: string]: { open: string; close: string }[] } = {
    Mon: [
      { open: "11:30", close: "15:00" },
      { open: "17:30", close: "21:30" },
    ],
    Tue: [],
    Wed: [
      { open: "11:30", close: "15:00" },
      { open: "17:30", close: "22:00" },
    ],
    Thu: [
      { open: "10:30", close: "15:00" },
      { open: "17:30", close: "22:00" },
    ],
    Fri: [
      { open: "11:30", close: "15:00" },
      { open: "17:30", close: "22:00" },
    ],
    Sat: [
      { open: "11:30", close: "15:00" },
      { open: "17:30", close: "22:00" },
    ],
    Sun: [
      { open: "11:30", close: "15:00" },
      { open: "17:30", close: "22:00" },
    ],
  };

  useEffect(() => {
    const isMobileDevice = /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
    if (isMobileDevice) {
      window.location.href = 'https://namma-restaurant-mobile-sjsf.vercel.app/';

    }

    const checkIfOpen = () => {
      const now = dayjs();
      const currentDay = now.format("ddd");
      const currentTime = now.format("HH:mm");

      const todayHours = operationalHours[currentDay] || [];

      if (todayHours.length === 0) {
        setIsCartOpen(false);
        return;
      }

      const isOpenNow = todayHours.some(
        ({ open, close }) => currentTime >= open && currentTime <= close
      );

      setIsCartOpen(isOpenNow);
    };

    checkIfOpen();

    const interval = setInterval(checkIfOpen, 60000);

    return () => clearInterval(interval);
  }, []);



  return (
    <header className='w-full py-[22px]'>
      <div className='container'>
        <nav className="flex justify-between items-center">
          <button className="flex items-center" onClick={() => router.push('/home')}>
            {/* <Image src="/assets/images/Logo.svg" alt="Logo" className="h-[60px] w-[auto]" /> */}
            <Image
              src="/assets/images/Logo.svg"
              alt="Logo"
              width={235}  // Add width
              height={60}  // Add height for proper aspect ratio
              className="h-[60px]"
            />
          </button>
          <div className="flex items-center gap-[45px] text-[14px] text-[#222A4A]">
            <Link href="/" >Home</Link>
            <Link href="/our-menu" >Our Menu</Link>
            <Link href="https://www.google.com/maps?q=181+Ranch+Dr,+Milpitas+95035" target='_blank'>Location</Link>
            <Link href="/contact-us" >Contact us</Link>
            {/* <Link href="https://withbites.com/merchants/nammamilpitas" >Order Now</Link> */}
            {/**
             * 
             *View cart buttom removed 
             *
             {isCartOpen && <button disabled={lineItems?.length === 0 ? true : false} className="bg-[#FFC300] px-[28px] py-[7px] rounded-[100px] text-[14px] font-bold text-[#A02621] relative" onClick={() => {

              if (!isOrderUpdate) {
                setIsOrderUpdate('create');
              } else {
                setIsOrderUpdate('update');
              }

              router.push('/cart')
            }}>
              View Cart
              {cartItemCount !== 0 && <span className='absolute w-[25px] h-[25px] bg-[#9E241F] text-[#fff] text-[14px] font-bold rounded-[100px] flex items-center justify-center top-[-10px] right-[3px]'>{cartItemCount||0}</span>}
            </button>} */}
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;


