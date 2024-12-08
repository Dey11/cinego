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
import next from "next";

type SlideInfo = {
  id: string;
  backdrop_path: string;
  original_language: string;
  title?: string;
  name?: string;
  logo_path: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  overview: string;
  media_type: string;
};
type ThumbnailInfo = {
  id: string;
  backdrop_path: string;
  original_language: string;
  title?: string;
  name?: string;
  logo_path: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  overview: string;
  media_type: string;
  genre_ids: number[];
};

type GenreIds = {
  id: number;
  name: string;
};

export default function TopSlider() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideInfo, setSlideInfo] = useState<SlideInfo[]>([]);
  const [thumnailInfo, setThumbnailInfo] = useState<ThumbnailInfo[]>([]);
  const [movieGenres, setMovieGenres] = useState<GenreIds[]>([]);
  const [tvGenres, setTVGenres] = useState<GenreIds[]>([]);

  const fetchGenres = async () => {
    const movieGenresUrl = `https://api.themoviedb.org/3/genre/movie/list?language=en-US&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`;
    const tvGenresUrl = `https://api.themoviedb.org/3/genre/tv/list?language=en-US&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`;
    const options = {
      method: "GET",
      next: { revalidate: 3600 }, // 1 hours
    };
    try {
      const movieGenresResponse = await fetch(movieGenresUrl, options);
      const movieGenresData = await movieGenresResponse.json();
      setMovieGenres(movieGenresData.genres);
      const tvGenresResponse = await fetch(tvGenresUrl, options);
      const tvGenresData = await tvGenresResponse.json();
      setTVGenres(tvGenresData.genres);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  const fetchSliderData = async () => {
    const url = `https://api.themoviedb.org/3/trending/all/day?language=en-US&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`;
    const options = {
      method: "GET",
      next: { revalidate: 3600 }, // 1 hours
    };
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      const slides = data.results.map((movie: any) => ({
        id: movie.id.toString(),
        backdrop_path: movie.backdrop_path,
        original_language: movie.original_language,
        name: movie.name || "",
        title: movie.title || "",
        logo_path: "",
        release_date: movie.release_date || "",
        first_air_date: movie.first_air_date || "",
        vote_average: movie.vote_average,
        overview: movie.overview,
        media_type: movie.media_type,
      }));
      setSlideInfo(slides.filter((slide: any) => slide.logo_path === ""));
    } catch (error) {
      console.error("Error fetching slider data:", error);
    }
  };

  const fetchThumbnailData = async () => {
    const url = `https://api.themoviedb.org/3/trending/all/week?language=en-US&api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`;
    const options = {
      method: "GET",
      next: { revalidate: 3600 }, // 1 hours
    };
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      const slides = data.results.map((tv: any) => ({
        id: tv.id.toString(),
        backdrop_path: tv.backdrop_path,
        original_language: tv.original_language,
        name: tv.name || "",
        title: tv.title || "",
        first_air_date: tv.first_air_date || "",
        release_date: tv.release_date || "",
        vote_average: tv.vote_average,
        overview: tv.overview,
        media_type: tv.media_type,
        genre_ids: tv.genre_ids,
      }));
      setThumbnailInfo(slides);
    } catch (error) {
      console.error("Error fetching slider data:", error);
    }
  };

  const fetchSlideInfo = async (id: string, media_type: string) => {
    const url = `https://api.themoviedb.org/3/${media_type}/${id}/images?api_key=${process.env.NEXT_PUBLIC_TMDB_API_KEY}`;
    const options = {
      method: "GET",
      next: { revalidate: 3600 }, // 1 hours
    };
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      let logo = data.logos.find(
        (logo: any) => logo.iso_639_1 === "en",
      )?.file_path;
      if (!logo) {
        logo = data.logos[0]?.file_path || null;
        if (!logo) {
          setSlideInfo(
            slideInfo.filter((slide) => {
              return slide.id !== id;
            }),
          );
        }
      }
      return logo || "";
    } catch (error) {
      console.error(`Error fetching slide info for id ${id}:`, error);
      return "";
    }
  };

  useEffect(() => {
    fetchGenres();
    fetchSliderData();
    fetchThumbnailData();
  }, []);

  useEffect(() => {
    const fetchLogos = async () => {
      const updatedSlideInfo = await Promise.all(
        slideInfo.map(async (slide) => {
          const logoPath = await fetchSlideInfo(slide.id, slide.media_type);
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
                alt={slide.title ? slide.title : slide.name!}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50" />
              <div className="absolute bottom-[20%] left-1/2 z-10 w-[90%] -translate-x-1/2 text-white sm:left-5 sm:-translate-x-0 sm:px-5">
                <Image
                  src={`https://image.tmdb.org/t/p/original${slide.logo_path}`}
                  alt={slide.title ? slide.title : slide.name!}
                  width={300}
                  height={300}
                  className="pb-10"
                />
                <div className="mx-auto mb-2 flex items-center">
                  <span className="mr-3 flex items-center capitalize text-gray-300">
                    {slide.media_type}
                  </span>
                  <span className="mr-2 flex items-center gap-x-1 text-gray-300">
                    <Star className="h-4 w-4 fill-white text-white" />{" "}
                    {slide.vote_average}
                  </span>
                  <span className="ml-2 flex items-center gap-x-1 text-gray-300">
                    <Calendar className="h-4 w-4" />
                    {slide.release_date
                      ? slide.release_date
                      : slide.first_air_date}
                  </span>
                </div>
                <p className="line-clamp-3 max-w-2xl text-lg">
                  {slide.overview}
                </p>
                <div className="mt-4">
                  <Link
                    href={
                      slide.media_type === "movie"
                        ? `/watch/${slide.media_type}/${slide.id}`
                        : `/watch/${slide.media_type}/${slide.id}?season=1&episode=1`
                    }
                  >
                    <Button
                      variant={"default"}
                      size={"lg"}
                      className="mr-4 border border-white bg-white px-6 py-2 font-bold text-black transition-transform hover:scale-110 hover:bg-gray-200"
                    >
                      <Play className="fill-black pr-1" />
                      Play
                    </Button>
                  </Link>
                  <Link href={`/${slide.media_type}/${slide.id}`}>
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
          spaceBetween={10}
          slidesPerView={"auto"}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          breakpoints={{
            320: {
              slidesPerView: 1,
            },
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            // 800: {
            //   slidesPerView: 3,
            // },
            1024: {
              slidesPerView: 4,
            },
            1280: {
              slidesPerView: 4,
            },
            1440: {
              slidesPerView: 5,
            },
            // 1536: { slidesPerView: 5 },
          }}
          //   navigation
          className="mx-auto h-full"
        >
          {thumnailInfo.map((slide, index) => (
            <SwiperSlide key={index} className="gap-x-10">
              <Link href={`/${slide.media_type}/${slide.id}`}>
                <div
                  className="relative h-52 w-full overflow-hidden rounded-xl sm:h-40 md:h-32 lg:h-32 xl:h-44"
                  style={{
                    backgroundImage: `url(https://image.tmdb.org/t/p/original${slide.backdrop_path})`,
                    backgroundSize: "cover",
                    objectFit: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    // backdropFilter: "brightness(0.7)",
                    filter: "brightness(0.8)",
                    // filter: "blur(2px)",
                  }}
                >
                  <div className="absolute inset-0 h-full w-full items-center justify-center rounded-2xl px-5 text-white transition duration-300 ease-in-out hover:text-red-500 hover:backdrop-blur-[2px]">
                    <div className="absolute inset-0 left-2 right-2 top-1/2 flex flex-col truncate font-semibold md:text-xl">
                      <span className="truncate">
                        {slide.name ? slide.name : slide.title}
                      </span>
                      <div className="flex gap-x-2 text-[10px] text-gray-400">
                        {slide.genre_ids.slice(0, 2).map((genreId) => {
                          let genre;
                          if (slide.media_type === "movie") {
                            genre = movieGenres.find(
                              (genre) => genre.id === genreId,
                            );
                          } else {
                            genre = tvGenres.find(
                              (genre) => genre.id === genreId,
                            );
                          }
                          return (
                            <span key={genreId} className="truncate">
                              {genre ? genre.name : ""}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
