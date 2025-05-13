import React from "react";
import Banner from './component/banner';
import NammaSpecials from './component/nammaSpecial';
import FlavorJourney from './component/FlavorJourney';
import ReviewCard from './component/reviewcarousel';
import ImageSlider from './component/banner-slider';
import Image from 'next/image';

export interface CatelogFilterBody {
  limit: number;
  custom_attribute_filters: [
    {
      bool_filter: boolean;
      custom_attribute_definition_id: string;
    }
  ];
}

async function HomePage() {
  return (
    <main className="container relative">
      <Image src="/assets/images/banner-bg.svg" width={'150'} height={'150'} alt="banner-bg" className="w-full absolute top-[170px] z-[-1]" />
      {/* <div className="container flex flex-col lg:flex-row gap-0 md:gap-6 px-4"> */}
      <div className="container flex flex-col lg:flex-row gap-0 md:gap-6 px-4">
        {/* LEFT COLUMN - 40% */}
        <div className="w-full lg:w-[40%] flex flex-col gap-0 md:gap-6">
          <Banner />
          {/* Show ImageSlider only on small devices */}
 
          <div className="relative md:bottom-[0px] bottom-[70px]">
          {/* <div className="relative mb-[0] md:mb-[100] relative md:bottom-0 bottom-[70px] "> */}
            <NammaSpecials />
          </div>
        </div>

        {/* RIGHT COLUMN - 60% */}
        <div className=" lg:w-[60%]">
          {/* For small device hidden */}
          <div className="pr-[0px] relative bottom-0 lg:bottom-[70px] h-[auto] hidden lg:block">
            <ImageSlider />
          </div>
          <div className="relative  top=[200px] hidden lg:block">
            <FlavorJourney />
          </div>
        </div>
      </div>
    </main>
  );
}

export default HomePage;
