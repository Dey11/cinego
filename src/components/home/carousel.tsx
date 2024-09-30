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
};

export function CarouselComponent({ shows }: { shows: CarouselProps[] }) {
  return (
    <div className="mx-auto w-full min-w-[350px] overflow-hidden px-2 lg:max-w-screen-xl xl:overflow-visible">
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={6}
        slidesPerView={"auto"}
        breakpoints={{
          320: {
            slidesPerView: 3,
          },
          480: {
            slidesPerView: 4,
          },
          640: {
            slidesPerView: 3,
          },
          768: {
            slidesPerView: 4,
          },
          1024: {
            slidesPerView: 5,
          },
          1280: {
            slidesPerView: 6,
          },
          1536: {
            slidesPerView: 7,
          },
        }}
        // navigation
        // pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log("slide change")}
      >
        {shows.map((show) => (
          <SwiperSlide key={show.id}>
            <Card show={show} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
