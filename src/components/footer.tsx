import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (


    <>

    <footer className="w-full bottom-0 block md:hidden lg:hidden">
        <div className='container'>
          <div className='w-full flex items-center flex-col justify-between py-[35px] relative :after'>
            <div className='flex flex-col'>
                <span className="absolute top-0 left-0 w-full h-[4px] border-t-[0.5px] border-b-[0.5px] border-[#222A4A]" />
              <div className="flex flex-wrap gap-[3px] text-[14px] text-[#222A4A] font-normal justify-center">
                <Link href="/">Home</Link>
                <span>|</span>
                <Link href="/our-menu" className="hover:text-gray-900">Our Menu</Link>
                <span >|</span>
                <Link href="/contact-us" className="hover:text-gray-900">Contact us</Link>
              </div>
              <div className="flex flex-wrap gap-[3px] text-[14px] text-[#222A4A] font-normal justify-center">
                <span className="hover:text-gray-900">Privacy Policy</span>
                <span >|</span>
                <span className="hover:text-gray-900">Terms and Conditions</span>
              </div>
              <div className="flex items-center flex-col text-[14px] text-[#222A4A] gap-[3px] my-[25px]">
                <a href="https://maps.google.com/?q=181+Ranch+Dr,+Milpitas+95035"
                  className="underline font-bold"
                  target="_blank"
                  rel="noopener noreferrer">
                  181 Ranch Dr, Milpitas 95035
                </a>
                <Link
                  href="mailto:reachusnamma@gmail.com"
                  className="text-[14px] text-[#222A4A]"
                >
                  reachusnamma@gmail.com
                </Link>
                <span><Link href="tel:+14086493417">408-649-3417</Link> & <Link href="tel:+14086493418">408-649-3418</Link></span>
              </div>
            </div>
            <div className="ml-5 mb-5 flex flex-col items-center justify-center mb-5"
            // style={{ backgroundColor: 'red' }}
            >
              <a
                href="https://chat.whatsapp.com/C6htpd8z34FLWzI6Upxw8f"
                className="mb-3 flex items-center space-x-2 underline font-bold text-gray-600 hover:text-blue-900"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/assets/images/whatsapp.svg"
                  alt="WhatsApp Icon"
                  width="18"
                  height="18"
                />
                <span >Join with us on WhatsApp</span>
              </a>

              <a
                href="https://www.instagram.com/namma_restaurant/"
                className="flex items-center space-x-2 underline font-bold text-gray-600 hover:text-blue-900"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  src="/assets/images/instagram.svg"
                  alt="Instagram Icon"
                  width="21"
                  height="21"
                />
                <span> Follow us on Instagram</span>
              </a>
            </div>



            <div className='flex flex-col items-center text-[14px] text-[#222A4A] text-center'>
              <span>Copyright © 2025 Namma Restaurant. <br /> All rights reserved.</span>
              <div className="flex flex-wrap gap-[3px] mt-[25px]">
                <a href="https://studioq.co.in" target='_blank' className="hover:underline flex items-center gap-1">
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
      
      <footer className="w-full mt-[45px] w-full bottom-0 hidden md:block">
        {/* <div className='container pb-[50px] bottom-[100px] relative'> */}
        <div className='container pb-[50px] relative'>
          <div className='w-full items-center'>
            <span className="absolute top-0 left-0 w-full h-[4px] border-t-[0.5px] border-b-[0.5px] border-[#222A4A]" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-1 text-center items-center justify-items-center">
              {/* other content of NM */}
                    <span className="absolute top-0 left-0 w-full h-[4px] border-t-[0.5px] border-b-[0.5px] border-[#222A4A]" />
              <div className="col-span-4 pt-[30px]  ">
                <div className="block lg:hidden text-center">
                  <Link href="/" className="py-">Home</Link>
                  <span className="px-2">|</span>
                  <Link href="/menu" className="hover:text-gray-900">Our Menu</Link>
                  <span className="px-2">|</span>
                  <Link href="/contact" className="hover:text-gray-900">Contact us</Link>
                  <span className="hidden md:block">|</span>
                </div>

                <div className="flex flex-col items-center md:flex-row md:justify-start flex-wrap gap-[3px] text-[14px] text-[#222A4A] font-normal text-center md:text-left">
                  <div className="hidden lg:block">
                    <Link href="/" className="py-">Home</Link>
                    <span className="px-1">|</span>
                    <Link href="/menu" className="hover:text-gray-900">Our Menu</Link>
                    <span className="px-1">|</span>
                    <Link href="/contact" className="hover:text-gray-900">Contact us</Link>
                    <span className="px-1">|</span>
                  </div>
                  <a
                    href="https://maps.google.com/?q=181+Ranch+Dr,+Milpitas+95035"
                    className="underline font-bold"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    181 Ranch Dr, Milpitas 95035
                  </a>
                </div>

                <div className="flex flex-col items-center md:items-start text-center md:text-left mt-[5px]">
                  <div className="flex flex-col sm:flex-row items-center text-[14px] text-[#222A4A] gap-[5px]">
                    <a href="mailto:reachusnamma@gmail.com" className="text-[14px] text-[#222A4A]">
                      reachusnamma@gmail.com
                    </a>
                    <span className="hidden sm:inline">|</span>
                    <span>
                      <Link href="tel:+14086493417">408-649-3417</Link> &{' '}
                      <Link href="tel:+14086493418">408-649-3418</Link>
                    </span>
                  </div>
                </div>
              </div>

              {/* social media */}
              <div className="col-span-3 flex justify-start  pt-[30]">
                <div className="flex flex-col text-left">
                  <a
                    href="https://www.instagram.com/namma_restaurant/"
                    className="flex items-center space-x-2 underline font-bold text-gray-600 hover:text-blue-900 ml-[-2]"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src="/assets/images/instagram.svg"
                      alt="Instagram Icon"
                      width={22}
                      height={22}
                    />
                    <span>Follow us on Instagram</span>
                  </a>

                  <a
                    href="https://chat.whatsapp.com/C6htpd8z34FLWzI6Upxw8f"
                    className="flex items-center space-x-2 underline font-bold text-gray-600 hover:text-blue-900"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src="/assets/images/whatsapp.svg"
                      alt="WhatsApp Icon"
                      width={18}
                      height={18}
                    />
                    <span>Join with us on WhatsApp</span>
                  </a>
                </div>
              </div>
              {/* copy right */}
              <div className="col-span-5 pt-[30]">
                <div className='flex flex-col text-[14px] text-[#222A4A] text-right'>
                  <span>Copyright © {currentYear} Namma Restaurant. All rights reserved.</span>
                  <div className="flex flex-wrap gap-[3px] justify-end">
                    <a href="/privacy-policy" className="hover:underline">
                      Privacy Policy
                    </a>
                    <span >|</span>
                    <a href="/terms-and-conditions" className="hover:underline">
                      Terms and Conditions
                    </a>
                    <span >|</span>
                    <Link href="https://studioq.co.in/" className="hover:underline flex items-center gap-1">
                      Built by <Image
                        src="/assets/images/SQ.svg"
                        alt="Google logo"
                        width={20}
                        height={20}
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Footer;