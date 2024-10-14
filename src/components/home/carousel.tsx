"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Card from "./card";

type CarouselProps = {
  id: number;
  title?: string;
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
  vote_average: number;
  original_language: string;
};

export function CarouselComponent({ shows }: { shows: CarouselProps[] }) {
  return (
    <div className="mx-auto w-full min-w-[350px] overflow-hidden px-2 md:px-0 lg:max-w-screen-xl xl:overflow-visible">
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={80}
        // slidesPerView={"auto"}
        breakpoints={{
          320: {
            slidesPerView: 3,
          },
          450: {
            slidesPerView: 3,
          },
          600: {
            slidesPerView: 4,
          },
          950: {
            slidesPerView: 5,
          },
          1100: {
            slidesPerView: 6,
          },
          1350: {
            slidesPerView: 7,
          },
        }}
        navigation
        // pagination={{ clickable: true }}
        // scrollbar={{ draggable: true }}
        // onSwiper={(swiper) => console.log(swiper)}
      >
        {shows.map((show) => (
          <SwiperSlide key={show.id} className="">
            <Card show={show} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
