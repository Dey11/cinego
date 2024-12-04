export const fetchAnimeInfo = async (id: string) => {
  try {
    const info = await fetch(
      `${process.env.ANIME_API}/meta/anilist/info/${id}`,
      //   `http://0.0.0.0:5000/meta/anilist/info/${id}`,
    ).then((res) => res.json());
    // console.log(id, info);
    // console.log(info);
    return info;
  } catch (error) {
    console.error("Error fetching anime info:", error);
    return null;
  }
};
