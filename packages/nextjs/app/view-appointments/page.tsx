/* eslint-disable prettier/prettier */
// pages/view-appointments.tsx
"use client";

import React, { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { supabase } from "../../services/supabaseClient";
import { Charger } from "../interfaces/ChargerInterface";

const ViewAppointments: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  // Correctly typing the useState hook with the Charger interface
  const [chargers, setChargers] = useState<Charger[]>([]);
  const [pastChargers, setPastChargers] = useState<Charger[]>([]);


  useEffect(() => {
    async function fetchData() {
      // Fetching current chargers
      const { data, error } = await supabase
        .from("fct_bookings")
        .select("*")
        .eq("user_id", connectedAddress);
  
      // Fetching past bookings
      const { data: pastData, error: pastDataError } = await supabase
        .from("fct_bookings")
        .select("*");
  
      if (error || pastDataError) {
        console.error("Fetch error:", error || pastDataError);
      } else {
        setChargers(data);
        setPastChargers(pastData);
      }
    }
  
    fetchData();
  }, [connectedAddress]); // Added connectedAddress as a dependency
  

  // Mapping through chargers to dynamically create table rows
  const rows = chargers.map((charger, index) => (
    <tr key={charger.charger_id}>
      <th>{index + 1}</th>
      <td>{charger.location_name}</td>
      <td>{charger.pricePerHour}</td>
      <td>{charger.approx_long}, {charger.approx_lat}</td>
      <td>{new Date(charger.created_at).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
    </tr>
  ));


    // Mapping through chargers to dynamically create table rows
  const PastBookingRows = pastChargers.map((pastChargers, index) => (
      <tr key={pastChargers.charger_id}>
        <th>{index + 1}</th>
        <td>{pastChargers.location_name}</td>
        <td>{pastChargers.pricePerHour}</td>
        <td>{pastChargers.approx_long}, {pastChargers.approx_lat}</td>
        <td>{new Date(pastChargers.created_at).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
      </tr>
    ));

  return (
    <>
      <div className="bg-gradient-to-r from-cyan-500 to-blue-200 h-100">
        <div className="flex items-center flex-col flex-grow pt-5">
          <h1 className="mb-5 text-5xl font-bold">Elektris</h1>
          <div className="card bg-base-100 shadow-2xl flex align-center justify-center w-3/4 m-10">
            <div className="card-body pb-10 mb-5">
            <h3 className="text-3xl font-bold">Upcoming Bookings</h3>
              <table className="table table-xs card rounded-2xl">
                <thead>
                  <tr>
                    <th>Charger ID</th>
                    <th>Location Name</th>
                    <th>Price Per Hour</th>
                    <th>Approximate Location</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {rows} {/* Dynamically generated rows */}
                </tbody>
              </table>
            </div>

              
          </div>


          <div className="card bg-base-100 shadow-2xl flex align-center justify-center w-3/4 m-10">
            <div className="card-body pb-10 mb-5">
            <h3 className="text-3xl font-bold">Past Bookings</h3>
              <table className="table table-xs card rounded-2xl">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Location Name</th>
                    <th>Price Per Hour</th>
                    <th>Approximate Location</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {PastBookingRows} {/* Dynamically generated rows for past bookings */}
                </tbody>
              </table>
            </div>

              
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewAppointments;
