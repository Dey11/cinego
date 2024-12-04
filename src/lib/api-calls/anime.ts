// import { ANIME } from "@consumet/extensions";

// const anilist = new ANIME.Anilist();

export const fetchAnimeInfo = async (id: string) => {
  try {
    // https://api-consumet-org-beige.vercel.app/meta/anilist/info/
    const info = await fetch(
      //   `https://api-consumet-org-beige.vercel.app/meta/anilist/info/${id}`,
      `http://0.0.0.0:5000/meta/anilist/info/${id}`,
    ).then((res) => res.json());
    // console.log(id, info);
    // console.log(info);
    return info;
  } catch (error) {
    console.error("Error fetching anime info:", error);
    return null;
  }
};
