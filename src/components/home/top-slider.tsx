"use client";

import React, { useEffect, useState } from "react";
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
import { Calendar, Info, Play, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type SlideInfo = {
  id: string;
  backdrop_path: string;
  original_language: string;
  original_title: string;
  logo_path: string;
  release_date: string;
  vote_average: number;
  overview: string;
};
type ThumbnailInfo = {
  id: string;
  backdrop_path: string;
  original_language: string;
  original_name: string;
  first_air_date: string;
  vote_average: number;
  overview: string;
};

export default function TopSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideInfo, setSlideInfo] = useState<SlideInfo[]>([]);
  const [thumnailInfo, setThumbnailInfo] = useState<ThumbnailInfo[]>([]);

  const fetchSliderData = async () => {
    const url =
      "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc";
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
      },
    };
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      const slides = data.results.slice(0, 5).map((movie: any) => ({
        id: movie.id.toString(),
        backdrop_path: movie.backdrop_path,
        original_language: movie.original_language,
        original_title: movie.original_title,
        logo_path: "",
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        overview: movie.overview,
      }));
      setSlideInfo(slides);
    } catch (error) {
      console.error("Error fetching slider data:", error);
    }
  };

  const fetchThumbnailData = async () => {
    const url =
      "https://api.themoviedb.org/3/discover/tv?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc";
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_ACCESS_TOKEN}`,
      },
    };
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      const slides = data.results.slice(0, 20).map((tv: any) => ({
        id: tv.id.toString(),
        backdrop_path: tv.backdrop_path,
        original_language: tv.original_language,
        original_name: tv.original_name,
        first_air_date: tv.first_air_date,
        vote_average: tv.vote_average,
        overview: tv.overview,
      }));
      setThumbnailInfo(slides);
    } catch (error) {
      console.error("Error fetching slider data:", error);
    }
  };

  const fetchSlideInfo = async (id: string) => {
    const url = `https://api.themoviedb.org/3/movie/${id}/images`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0YzY4ZTRjYjBhMDM4OTk0MTliNmVmYTZiOGJjOGJiZSIsIm5iZiI6MTcyNzUwNjM2NS40NDQxNjUsInN1YiI6IjY2NWQ5YmMwYTVlMDU0MzUwMTQ5MWUwNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.8OL7WQIZGWr9tRfmSkRFIsaf1Wy0ksrOGDCB4KcocW4",
      },
    };
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      const logo = data.logos.find(
        (logo: any) => logo.iso_639_1 === "en",
      )?.file_path;
      return logo || "";
    } catch (error) {
      console.error(`Error fetching slide info for id ${id}:`, error);
      return "";
    }
  };

  useEffect(() => {
    fetchSliderData();
    fetchThumbnailData();
  }, []);

  useEffect(() => {
    const fetchLogos = async () => {
      const updatedSlideInfo = await Promise.all(
        slideInfo.map(async (slide) => {
          const logoPath = await fetchSlideInfo(slide.id);
          return { ...slide, logo_path: logoPath };
        }),
      );
      setSlideInfo(updatedSlideInfo);
    };

    if (slideInfo.length > 0 && !slideInfo[0].logo_path) {
      fetchLogos();
    }
  }, [slideInfo]);

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
        {slideInfo.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              <img
                src={`https://image.tmdb.org/t/p/original${slide.backdrop_path}`}
                alt={slide.original_title}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50" />
              <div className="absolute bottom-[25dvh] left-8 z-10 text-white">
                <Image
                  src={`https://image.tmdb.org/t/p/original${slide.logo_path}`}
                  alt={slide.original_title}
                  width={300}
                  height={300}
                  className="pb-10"
                />
                <div className="mb-2 flex items-center">
                  <span className="mr-2 flex items-center gap-x-1">
                    <Star className="h-4 w-4 text-yellow-500" />{" "}
                    {slide.vote_average}
                  </span>
                  <span className="ml-2 flex items-center gap-x-1 text-gray-300">
                    <Calendar className="h-4 w-4" />
                    {slide.release_date}
                  </span>
                </div>
                <p className="line-clamp-3 max-w-2xl text-lg">
                  {slide.overview}
                </p>
                <div className="mt-4">
                  <Button
                    variant={"default"}
                    size={"lg"}
                    className="mr-4 border border-white px-6 py-2 font-bold transition-transform hover:scale-110"
                  >
                    <Play className="fill-black pr-1" />
                    Play
                  </Button>
                  <Link href={`/movie/${slide.id}`}>
                    <Button
                      variant={"secondary"}
                      size={"lg"}
                      className="border border-white bg-transparent px-6 py-2 font-bold text-white transition-transform hover:scale-110"
                    >
                      <Info className="pr-1" />
                      See More
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="absolute -bottom-20 left-0 right-0 px-4 lg:px-8">
        <Swiper
          modules={[Navigation, A11y, Autoplay]}
          // spaceBetween={}
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
            1000: {
              slidesPerView: 4,
            },
            1536: { slidesPerView: 5 },
          }}
          //   navigation
          className="mx-auto h-full w-full"
        >
          {thumnailInfo.map((slide, index) => (
            <SwiperSlide key={index} className="">
              <Link href={`/tv/${slide.id}`}>
                <img
                  src={`https://image.tmdb.org/t/p/original${slide.backdrop_path}`}
                  alt={slide.original_name}
                  className="relative h-20 w-full object-contain brightness-50 lg:h-40"
                />
                <div className="absolute top-0 flex h-full w-full items-center justify-center px-10">
                  <p className="line-clamp-2 font-semibold text-red-500 md:text-xl">
                    {slide.original_name}
                  </p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
