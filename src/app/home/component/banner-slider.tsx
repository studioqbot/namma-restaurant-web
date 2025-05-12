"use client";

import React from "react";
import dynamic from "next/dynamic";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Slider = dynamic(() => import("react-slick"), { ssr: false });

const ImageSlider = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
    fade: true,
  };

  const images = [
    "/assets/images/hero-slider1.svg",
    "/assets/images/hero-slider2.svg",
    "/assets/images/hero-slider3.svg",
  ];

  const moBimages = [
    "/assets/images/banner-slide-mob-1.svg",
    "/assets/images/banner-slide-mob-2.svg",
    "/assets/images/banner-slide-mob-3.svg",
  ];

  return (
    <div className="w-full">
      {/* Desktop & Tablet */}
      <div className="hidden md:block">
        <Slider {...settings} className="outline-0">
          {images.map((image, index) => (
            <div key={index} className="banner-slider w-full">
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Mobile Only */}
      <div className="block md:hidden relative top-[-100px]">
        <Slider {...settings} className="outline-0">
          {moBimages.map((image, index) => (
            <div key={index} className="banner-slider w-full">
              <img
                src={image}
                alt={`Slide ${index + 1}`}
                style={{ width: "100%", height: "auto" }}
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default ImageSlider;
