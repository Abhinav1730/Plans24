import axios from "axios";

const UNSPLASH_URL = "https://api.unsplash.com/search/photos";

export const GetPlaceImage = (query) => {
  return axios.get(UNSPLASH_URL, {
    params: {
      query: query,
      per_page: 1,
      orientation: "landscape",
    },
    headers: {
      Authorization: `Client-ID ${import.meta.env.VITE_UNSPLASH_ACCESS_KEY}`,
    },
  });
};