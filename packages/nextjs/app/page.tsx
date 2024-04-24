"use client";

import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
// import { useAccount } from "wagmi";
import { CurrencyDollarIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

// import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  // const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="bg-primary">
        <div className="flex items-center flex-col flex-grow pt-5">
          <h1 className="mb-5 text-5xl font-bold">Elektris</h1>
          <Image src="/EVHero.png" width={400} height={500} alt="Elektris Hero" className="rounded-3xl" />
          <div className="hero-content text-center">
            <div className="max-w-md">
              <p className="mb-5 text-xl">
                Transform your EV charger into a passive income stream, accelerate the transition to green
                transportation, and enjoy lower vehicle operating costs—all with minimal effort.{" "}
              </p>

              <Link href="/list-charger" passHref className="link">
                <button className="btn btn-secondary">Get Started</button>
              </Link>
            </div>
          </div>

          <div className="flex-grow w-full mt-16 px-8 py-12">
            <div className="flex justify-center items-stretch gap-12 flex-col sm:flex-row">
              <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
                <CurrencyDollarIcon className="h-10 w-10 fill-secondary" />
                <p className="flex-1">
                  <Link href="/list-charger" passHref className="link">
                    List your EV Charger
                  </Link>{" "}
                  to earn extra income.
                </p>
              </div>
              <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center max-w-xs rounded-3xl">
                <MagnifyingGlassIcon className="h-10 w-10 fill-secondary" />
                <p className="flex-1">
                  <Link href="/explore" passHref className="link">
                    Explore
                  </Link>{" "}
                  a network of EV Chargers
                </p>
              </div>
            </div>
          </div>

          <div className="divider"></div>

          <div className="justify-center mx-2 py-12 w-full">
            <div className="bg-base-100 shadow-xl">
              <div className="flex flex-col justify-center m-5 w-full text-center align-center">
                <h2 className="text-4xl font-bold">How It Works</h2>
                <div className="flex flex-wrap mx-2">
                  <div className="w-full sm:w-1/2 px-2 bg-base-100 shadow-xl">
                    <figure className="px-10 pt-10">
                      <Image src="/ListChargerImage.png" className="rounded-xl" width={300} height={100} alt="Shoes" />
                    </figure>
                    <div className="card-body items-center text-center">
                      <h2 className="card-title mt-5">For Charger Owners: List Your Charger</h2>
                      <p>
                        Have a Level 2 Charger? Make it work for you! Join our network by listing your charger and start
                        earning. Our platform connects you with EV drivers in need of charging, turning your investment
                        into a continuous revenue stream. Its simple to get started, and youre in full control of your
                        availability and rates.
                      </p>
                      <div className="w-full sm:w-1/2 px-2 card-actions">
                        <Link href="/list-charger" passHref className="link">
                          <button className="btn btn-primary">List</button>
                        </Link>{" "}
                      </div>
                    </div>
                  </div>
                  <div className="card w-96 bg-base-100 shadow-xl">
                    <figure className="px-10 pt-10">
                      <Image
                        src="/Charger.png"
                        className="rounded-xl"
                        width={300}
                        height={100}
                        alt="Picture of the author"
                      />
                    </figure>
                    <div className="card-body items-center text-center">
                      <h2 className="card-title">For Drivers: Find a Charge</h2>
                      <p>
                        Say goodbye to range anxiety. Our extensive network of privately-owned chargers puts the power
                        back in your journey, making it easy to find a charge wherever you go. Whether youre planning a
                        long trip or need a quick top-up, access our platform to locate and use a Level 2 Charger near
                        you. Seamless, hassle-free, and designed with your convenience in mind.
                      </p>
                      <div className="card-actions">
                        <Link href="/explore" passHref className="link">
                          <button className="btn btn-primary">Explore</button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
