"use client";

import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Dynamically import react-slick without SSR
const Slider = dynamic(() => import("react-slick"), { ssr: false });

const reviews = [
  {
    text: "The Vanjaram Fish Fry at Namma Restaurant is simply outstanding! Perfectly spiced, crisp on the outside, and tender inside—every bite is a burst of Karaikudi goodness. It's my absolute favorite!",
    image: "/assets/images/review-card-img.svg",
    user: "Priya R",
    icon: "/assets/images/google.svg",
  },
  {
    text: "Our first time coming to the restaurant and what better way to find out their best dishes than to have a thali and sample some of their dishes. The place is huge and very inviting! Fast service as well.",
    image: "/assets/images/review-card-img-2.jpg",
    user: "Rajesh K",
    icon: "/assets/images/yelp_icon.svg",
  },
  {
    text: "Gosh, the food here is simply fantastic!!! We tried a whole bunch of stuff and everything was perfect and just so delicious. We tried Pallipalayam Paneer for the first time - it was very spicy & tangy and I loved it.",
    image: "/assets/images/review-card-img-3.jpg",
    user: "Divya M",
    icon: "/assets/images/yelp_icon.svg",
  },
  // You can add more reviews here...
];

export default function ReviewCard() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="hidden md:block w-full mx-auto sm:grid sm:grid-cols-1 relative mt-0 lg:mt-[40px]">
      <div className="relative">
        {/* Background SVG */}
        <div className="hidden md:block">
          <Image
            className="absolute bottom-[-25px] w-[calc(100%-8px)] mx-[2px] my-[1px]"
            alt="Review background"
            src="/assets/images/review-bg.svg"
            width={1200}
            height={100}
            loading="lazy"
          />
        </div>

        {/* Review Carousel */}
        <Slider {...settings}>
          {reviews.map((review, index) => (
            <div key={index}>
              <div className="mx-auto bg-white rounded-[15px] flex flex-col sm:flex-row overflow-hidden shadow-md">
                <div
                  className="w-full sm:w-[140px] min-h-[180px] sm:h-auto bg-cover bg-no-repeat bg-center"
                  style={{ backgroundImage: `url('${review.image}')` }}
                />
                <div className="py-4 px-5 flex-1">
                  <p className="text-[#222A4A] text-[13px] leading-[21px] mb-3">
                    {review.text}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Image
                      src={review.icon}
                      alt={`${review.user} review source`}
                      width={20}
                      height={20}
                      loading="lazy"
                    />
                    <span className="text-[#222A4A] text-[14px] font-semibold">
                      {review.user}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
