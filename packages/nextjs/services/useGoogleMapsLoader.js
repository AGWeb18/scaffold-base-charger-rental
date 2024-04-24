// useGoogleMapsLoader.js
import { useJsApiLoader } from "@react-google-maps/api";

const libraries = ["places", "geometry"]; // Combine all the libraries you need throughout your app

const useGoogleMapsLoader = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  return { isLoaded, loadError };
};

export default useGoogleMapsLoader;
