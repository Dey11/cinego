"use client";

import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Scrollbar,
  A11y,
  Autoplay,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { Button } from "../ui/button";
import { Info, Play } from "lucide-react";

export default function TopSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative h-screen w-full">
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        // navigation
        // pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        className="h-full w-full"
      >
        {mainSlides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div className="relative h-full w-full">
              <img
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50" />
              <div className="absolute bottom-[25dvh] left-8 z-10 text-white">
                <h1 className="mb-2 text-6xl font-bold">{slide.title}</h1>
                <div className="mb-2 flex items-center">
                  <span className="mr-2 text-yellow-400">★ {slide.rating}</span>
                  <span className="text-gray-300">{slide.date}</span>
                </div>
                <p className="max-w-2xl text-lg">{slide.description}</p>
                <div className="mt-4">
                  <Button
                    variant={"default"}
                    size={"lg"}
                    className="mr-4 px-6 py-2 font-bold transition-transform hover:scale-110"
                  >
                    <Play className="fill-black pr-1" />
                    Play
                  </Button>
                  <Button
                    variant={"secondary"}
                    size={"lg"}
                    className="border border-white bg-transparent px-6 py-2 font-bold text-white transition-transform hover:scale-110"
                  >
                    <Info className="pr-1" />
                    See More
                  </Button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute -bottom-20 left-0 right-0 px-4 lg:px-8">
        <Swiper
          modules={[Navigation, A11y, Autoplay]}
          spaceBetween={10}
          slidesPerView={"auto"}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            320: {
              slidesPerView: 2,
            },
            500: {
              slidesPerView: 3,
            },
            700: {
              slidesPerView: 4,
            },
            800: {
              slidesPerView: 5,
            },
            1000: {
              slidesPerView: 6,
            },
            1536: {
              slidesPerView: 7,
            },
          }}
          //   navigation
          className="h-full w-full"
        >
          {thumbnailSlides.map((slide, index) => (
            <SwiperSlide key={index} className="">
              <img
                src={slide.logo}
                alt={slide.alt}
                className="relative h-20 w-full object-contain brightness-75 lg:h-40"
              />
              <div className="absolute top-0 flex h-full w-full items-center justify-center">
                <p className="text-white">{slide.alt}</p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

const mainSlides = [
  {
    title: "HIJACK 1971",
    rating: "6.4",
    date: "2024-06-21",
    description:
      "Pilots Tae-in and Gyu-sik are set to fly to Gimpo. Under the guidance of flight attendant Ok-soon, passengers are busy boarding. However, shortly after takeoff, a homemade bomb explodes, turning the cabin into chaos.",
    image:
      "https://image.tmdb.org/t/p/original/fY3lD0jM5AoHJMunjGWqJ0hRteI.jpg",
  },
  {
    title: "MOVIE 2",
    rating: "7.2",
    date: "2024-07-15",
    description: "A thrilling adventure in space.",
    image:
      "https://image.tmdb.org/t/p/original/fY3lD0jM5AoHJMunjGWqJ0hRteI.jpg",
  },
  {
    title: "MOVIE 3",
    rating: "8.1",
    date: "2024-08-30",
    description: "A heartwarming story of friendship.",
    image:
      "https://image.tmdb.org/t/p/original/fY3lD0jM5AoHJMunjGWqJ0hRteI.jpg",
  },
];

const thumbnailSlides = [
  {
    logo: "https://image.tmdb.org/t/p/original/fY3lD0jM5AoHJMunjGWqJ0hRteI.jpg",
    alt: "Netflix",
  },
  {
    logo: "https://image.tmdb.org/t/p/original/fY3lD0jM5AoHJMunjGWqJ0hRteI.jpg",
    alt: "Disney+",
  },
  {
    logo: "https://image.tmdb.org/t/p/original/fY3lD0jM5AoHJMunjGWqJ0hRteI.jpg",
    alt: "Apple TV+",
  },
  {
    logo: "https://image.tmdb.org/t/p/original/fY3lD0jM5AoHJMunjGWqJ0hRteI.jpg",
    alt: "Prime Video",
  },
  {
    logo: "https://image.tmdb.org/t/p/original/fY3lD0jM5AoHJMunjGWqJ0hRteI.jpg",
    alt: "HBO Max",
  },
  {
    logo: "https://image.tmdb.org/t/p/original/fY3lD0jM5AoHJMunjGWqJ0hRteI.jpg",
    alt: "Hulu",
  },
  {
    logo: "https://image.tmdb.org/t/p/original/fY3lD0jM5AoHJMunjGWqJ0hRteI.jpg",
    alt: "Hulu",
  },
  {
    logo: "https://image.tmdb.org/t/p/original/fY3lD0jM5AoHJMunjGWqJ0hRteI.jpg",
    alt: "Hulu",
  },
  {
    logo: "https://image.tmdb.org/t/p/original/fY3lD0jM5AoHJMunjGWqJ0hRteI.jpg",
    alt: "Hulu",
  },
  {
    logo: "https://image.tmdb.org/t/p/original/fY3lD0jM5AoHJMunjGWqJ0hRteI.jpg",
    alt: "Hulu",
  },
  {
    logo: "https://image.tmdb.org/t/p/original/fY3lD0jM5AoHJMunjGWqJ0hRteI.jpg",
    alt: "Hulu",
  },
];
