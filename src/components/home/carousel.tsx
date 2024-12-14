"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, A11y, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import Card from "./card";
import { useCallback, useEffect, useState } from "react";
import { debounce } from "lodash";

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
  const [slidesPerView, setSlidesPerView] = useState<number>(3);

  const updateSlidesPerView = useCallback(() => {
    const width = window.innerWidth;
    if (width < 640) {
      setSlidesPerView(2.2);
    } else if (width < 768) {
      setSlidesPerView(3.2);
    } else if (width < 1024) {
      setSlidesPerView(4.2);
    } else if (width < 1280) {
      setSlidesPerView(5.2);
    } else {
      setSlidesPerView(6.2);
    }
  }, []);

  useEffect(() => {
    const debouncedUpdate = debounce(updateSlidesPerView, 100);

    updateSlidesPerView();
    window.addEventListener("resize", debouncedUpdate);

    return () => {
      window.removeEventListener("resize", debouncedUpdate);
      debouncedUpdate.cancel();
    };
  }, [updateSlidesPerView]);

  return (
    <div className="mx-auto w-full min-w-[350px] overflow-hidden px-2 md:px-0 lg:max-w-screen-xl xl:overflow-visible">
      <Swiper
        modules={[Navigation, A11y, FreeMode]}
        // spaceBetween={12}
        slidesPerView={slidesPerView}
        navigation
        freeMode={{
          enabled: true,
          sticky: false,
          momentumBounce: false,
          minimumVelocity: 0.02,
          momentum: true,
        }}
        className=""
      >
        {shows.map((show) => (
          <SwiperSlide key={show.id} className="!w-auto">
            <Card show={show} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
