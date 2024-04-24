/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-non-null-assertion */

/* eslint-disable prettier/prettier */
"use client";

import React, { useState } from "react";
import { supabase } from "../../services/supabaseClient";
import { Charger } from "../interfaces/ChargerInterface";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import MapWithPins from "~~/components/MapWithPins";
import useGoogleMapsLoader from "../../services/useGoogleMapsLoader";


const Explore: NextPage = () => {
  const { address: connectedAddress } = useAccount(); // If connectedAddress is not used, consider removing it
  const [address, setAddress] = useState("");
  const [nearbyChargers, setNearbyChargers] = useState<Charger[]>([]);
  const [selectedCharger, setSelectedCharger] = useState<Charger | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isLoaded, loadError } = useGoogleMapsLoader();
  

  // Assuming you have imported the necessary types from the @types/googlemaps package
  const fetchChargers = async (searchAddress: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const geocoder = new google.maps.Geocoder();
      const results = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
        geocoder.geocode({ address: searchAddress }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK && results) {
            resolve(results);
          } else {
            reject(new Error(`Geocoding failed with status: ${status}`));
          }
        });
      });

      // Now 'results' is explicitly an array of GeocoderResult objects
      const userLocation = results[0].geometry.location;
      const { data: chargers, error: fetchError } = await supabase
        .from("dim_charger_locations")
        .select("*")
        .eq("is_available", true);

      if (fetchError) throw new Error(`Error fetching chargers: ${fetchError.message}`);

      const filteredChargers = chargers.filter((charger: Charger) => {
        const chargerLocation = new google.maps.LatLng(charger.precise_lat, charger.precise_long);
        const distance = google.maps.geometry.spherical.computeDistanceBetween(userLocation, chargerLocation);
        return distance < 10000; // e.g., 10km
      });

      setNearbyChargers(filteredChargers);
    } catch (error: unknown) {
      // Improved error handling
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for search button click
  const handleSearch = () => {
    if (address) fetchChargers(address);
  };

  // Render loading and error states
  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded || isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div className="bg-gradient-to-r from-cyan-500 to-blue-200 flex items-center flex-col flex-grow pt-10">
        <div className="px-5 mb-10">
          <h1 className="text-center">
            <span className="block text-4xl font-bold">Elektris</span>
            <span className="block text-2xl mb-2">Find a Charger In Your Area</span>
          </h1>
        </div>

        <div className="flex justify-center w-full px-5 pb-10">
          <MapWithPins chargers={nearbyChargers} setSelectedCharger={setSelectedCharger} selectedCharger={null} />
          
        </div>
      </div>
    </>
  );
};

export default Explore;
