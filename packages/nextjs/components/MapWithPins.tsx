/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient";
import { GoogleMap, MarkerF, useJsApiLoader } from "@react-google-maps/api";
import ModalComponent from "../components/ModalComponent";
import { Charger }  from "../../nextjs/app/interfaces/ChargerInterface";
import useGoogleMapsLoader from "../services/useGoogleMapsLoader";
import Autocomplete from "react-google-autocomplete";


const mapContainerStyle = {
  height: "60vh",
  width: "100%",
  borderRadius: "10px",
  borderWidth: "1px",
  borderColor: "black",
};

const center = {
  lat: 44.32933489719813,
  lng: -78.7230982496161,
};
interface MapWithPinsProps {
  chargers: Charger[];
  setSelectedCharger: React.Dispatch<React.SetStateAction<Charger | null>>;
  selectedCharger: Charger | null; // This prop type definition is optional if you decide not to pass it from Explore
}



const MapWithPins: React.FC<MapWithPinsProps> = () => {
  const [chargers, setChargers] = useState<Charger[]>([]);
  const [selectedCharger, setSelectedCharger] = useState<Charger | null>(null);
  const { isLoaded, loadError } = useGoogleMapsLoader();
  const [fullAddress, setFullAddress] = useState("");
  const [preciseLat, setPreciseLat] = useState("");
  const [preciseLng, setPreciseLng] = useState("");
  const [approxLat, setApproxLat] = useState("");
  const [approxLng, setApproxLng] = useState("");
  const [location, setLocation] = useState<string>();
  const [mapCenter, setMapCenter] = useState({ lat: 44.32933489719813, lng: -78.7230982496161 });

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from("dim_charger_locations") // Adjust table name if necessary
        .select("*")
        .eq("is_available", true);
      if (error) {
        console.error(error);
      } else {
        const chargersWithNumbers = data.map((charger: any) => ({
          ...charger,
          precise_lat: parseFloat(charger.precise_lat),
          precise_long: parseFloat(charger.precise_long),
          approx_lat:parseFloat(charger.approx_lat),
          approx_long: parseFloat(charger.approx_long),

        }));
        setChargers(chargersWithNumbers); // Update state with converted data
      }
    }

    fetchData();
  }, []);

  const center = {
    lat: 44.32933489719813,
    lng: -78.7230982496161,
  };

  
  // Create a bounding box with sides ~10km away from the center point
  const defaultBounds = {
    north: center.lat + 0.1,
    south: center.lat - 0.1,
    east: center.lng + 0.1,
    west: center.lng - 0.1,
  };

  const options = {
    bounds: defaultBounds,
    componentRestrictions: { country: "ca" },
    fields: ["address_components", "geometry"],
    strictBounds: false,
    types: ["address"], // This ensures that the autocomplete suggestions are addresses
  };


// ======================= FUNCTIONS ==========================

  function prepareCoordinates(lat: number, lng: number) {
    // Precise coordinates as they are
    const preciseLat = lat;
    const preciseLng = lng;
  
    // Approximate coordinates by reducing precision
    // Here we choose 3 decimal places (~111 meters) for approximation
    const approxLat = parseFloat(lat.toFixed(3));
    const approxLng = parseFloat(lng.toFixed(3));
  
    return { preciseLat, preciseLng, approxLat, approxLng };
  }
  

  const handlePlaceSelected = (
    place: google.maps.places.PlaceResult, 
    ref?: React.RefObject<HTMLInputElement>, 
    autocompleteRef?: React.RefObject<google.maps.places.Autocomplete>
  ) => {
    if (!place.geometry || !place.geometry.location) {
      console.error("Place has no location.");
      return;
    }
  
    // Successfully retrieved place object
  
    let fullAddress = "";
  
    // Check for formatted_address
    if (place.formatted_address) {
      fullAddress = place.formatted_address;
    } else {
      // Parse the full address manually if formatted_address is not available
      const addressComponents = place.address_components;
      if (addressComponents) {
            // Define the indexes of the elements you want to include
            const selectedIndexes = [1, 2, 3, 4];

            // Filter the address components to only include those at the specified indexes
            const selectedComponents = addressComponents.filter((component, index) => selectedIndexes.includes(index));

            // Map the filtered components to their short_name and join them into a string
            const addressParts = selectedComponents.map(component => component.short_name);
            const fullAddress = addressParts.join(" ");
            
                // Update the state with the full address
            setFullAddress(fullAddress);
            // Extract latitude and longitude using the functions provided by the geometry.location object
            const latitude = place.geometry.location.lat();
            const longitude = place.geometry.location.lng();
          
                // Update the map center state
            setMapCenter({ lat: latitude, lng: longitude });
    
            const { preciseLat, preciseLng, approxLat, approxLng } = prepareCoordinates(latitude, longitude);
            setPreciseLat(String(preciseLat));
            setPreciseLng(String(preciseLng));
            setApproxLat(String(approxLat));
            setApproxLng(String(approxLng));


            console.log(`Full Address: ${fullAddress}, Precise Lat: ${preciseLat}, Precise Lng: ${preciseLng}, Approx Lat: ${approxLat}, Approx Lng: ${approxLng}`);
          
        } else {
        fullAddress = "No address found";
      }
    }
  

    // Handle the coordinates as needed
  };
  
  const handleMarkerClick = (charger: Charger) => {
    setSelectedCharger(charger);
  };


  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps</div>;

  return (
    <>
  <div className="flex flex-col w-3/4 items-center justify-center">
    <div className="w-full max-w-xs mb-4"> {/* Adjust max width as necessary */}
      <Autocomplete
        apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        options={options}
        onPlaceSelected={handlePlaceSelected}
        defaultValue={location}
        placeholder="Search for chargers"
        className="input input-bordered w-full text-center"
      />

    </div>

    <div className="flex-grow w-full"> 
      <div style={mapContainerStyle} className="w-full h-60vh mb-4"> 
        <GoogleMap mapContainerStyle={mapContainerStyle} center={mapCenter} zoom={12}>
          {chargers.map((charger) => (
            <MarkerF
              key={charger.charger_id}
              position={{ lat: charger.approx_lat, lng: charger.approx_long }}
              title={charger.location_name}
              onClick={() => handleMarkerClick(charger)}
            />
          ))}
        </GoogleMap>
      </div>
      {selectedCharger && (
        <ModalComponent
          isVisible={!!selectedCharger}
          onClose={() => setSelectedCharger(null)}
          charger={selectedCharger}
        />
      )}
    </div>
  </div>
</>

  );
};

export default MapWithPins;
