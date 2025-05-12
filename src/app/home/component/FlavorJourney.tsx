'use client';
import React from 'react';
import Image from 'next/image';

const FlavorJourney = () => {
  return (
    <div className="container">
      <div className="rounded-[23px] bg-[#F7F0E3] flex flex-row">
        <div className="relative w-[400px] right-[40px]">
          <Image
            src="/assets/images/journey-bg.svg"
            alt="Journey"
            fill
          />
        </div>
        <div className="relative right-[40px] w-[400px]">
          <h3 className="text-black text-[25px] leading-[38px] font-unbounded mt-[25px] mb-[15px]">
            A Journey Through <br /> India{"'"}s Flavors
          </h3>

          <p className="text-[#222A4A] text-sm leading-7 mb-6">
            South Indian cuisine is a vibrant celebration of traditions, flavors, and heritage that has been perfected over centuries. Each region offers its own distinct culinary treasures, making South Indian food a delightful mosaic of tastes and aromas. Tamil Nadu enchants with its bold and fiery Chettinad spices, Kerala captivates with its coconut-rich curries and fresh seafood, Andhra Pradesh excites with its tangy tamarind and spicy chilies, and Karnataka charms with its balanced flavors, from the comforting Rasam to the aromatic Bisibele Bath.
          </p>
          <p className="text-[#222A4A] text-sm leading-7 mb-6">
            At Namma Restaurant, we honor this incredible diversity by bringing together dishes that truly capture the essence of South Indian cooking. Our menu is crafted to celebrate the traditional recipes and authentic flavors of the region, from the golden crispness of a perfectly made Dosa to the hearty warmth of a bowl of Sambar or the indulgent richness of a Malabar-style curry.
          </p>
          <p className="text-[#222A4A] text-sm leading-7 mb-6">
            Every dish we serve is a reflection of South India's culinary heritage, a tribute to the passion and care that go into every meal. Whether you’re rediscovering old favorites or exploring something new, our food promises to take you on a flavorful journey through the heart of South India.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FlavorJourney;
