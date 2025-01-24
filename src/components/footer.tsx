import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function Footer() {
  return (

    <>
      <footer className="w-full mt-[45px]">
        <div className='container'>
          <div className='w-full flex items-center justify-between py-[35px] relative :after'>
          <span className="absolute top-0 left-0 w-full h-[4px] border-t-[0.5px] border-b-[0.5px] border-[#222A4A]"/>
            <div className='flex flex-col'>
              <div className="flex flex-wrap gap-[3px] text-[14px] text-[#222A4A] font-normal">
                <Link href="/">Home</Link>
                <span>|</span>
                <Link href="/menu" className="hover:text-gray-900">Our Menu</Link>
                <span >|</span>
                <Link href="/contact" className="hover:text-gray-900">Contact us</Link>
                <span >|</span>
                <a href="https://maps.google.com/?q=181+Ranch+Dr,+Milpitas+95035"
                  className="underline font-bold"
                  target="_blank"
                  rel="noopener noreferrer">
                  181 Ranch Dr, Milpitas 95035
                </a>
              </div>
              <div className="flex items-center text-[14px] text-[#222A4A] gap-[3px] mt-[5px]">
                <a
                  href="mailto:reachusnamma@gmail.com"
                  className="text-[14px] text-[#222A4A]"
                >
                  reachusnamma@gmail.com
                </a>
                <span>|</span>
                <span>408-649-3417 & 408-649-3418</span>
              </div>
            </div>
            <div className='flex flex-col text-[14px] text-[#222A4A] text-right'>
            <span>Copyright © 2024 Namma Restaurant. All rights reserved.</span>
            <div className="flex flex-wrap gap-[3px] justify-end">
              <a href="/privacy-policy" className="hover:underline">
                Privacy Policy
              </a>
              <span >|</span>
              <a href="/terms-and-conditions" className="hover:underline">
                Terms and Conditions
              </a>
              <span >|</span>
              <a href="https://example.com" className="hover:underline flex items-center gap-1">
                Built by <Image
                            src="/assets/images/SQ.svg" 
                            alt="Google logo"
                            width={20}
                            height={20}
                          />
              </a>
            </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;