"use client";

import { useAccount } from "wagmi";

// Adjust the import path if necessary
export default function About() {
  useAccount();

  return (
    <>
      <div className="bg-gradient-to-r from-cyan-500 to-blue-200 flex items-center flex-col flex-grow pt-10 mx-15">
        <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center w-3/4 rounded-3xl">
          <h2>Written by a Human</h2>
          <p>
            I was driving home from the gym when I saw a family in an Electric Vehicle with their hazards on in a mall
            parking lot. I asked them if they needed help and they politely declined. As I pulled in my driveway and
            plugged my EV into my charger, I realized theres no easy way to offer a electric vehicle charging service
            from your own driveway.{" "}
          </p>
          <br />
          <br />
          <h3 className="text-xl font-bold">That is where the idea of Elektris came from. </h3>
          <div className="divider"></div>

          <h2>Written By AI:</h2>
          <div className="flex-1">
            <p>
              This project is a decentralized application (dApp) that connects electric vehicle (EV) owners with private
              EV charger owners. Utilizing Ethereums Layer 2 scaling solutions for efficient, low-cost transactions,
              platform aims to create a peer-to-peer network where individuals can list their personal EV chargers for
              for others to rent. Key components include:
            </p>
            <ul>
              <li>
                <strong>Blockchain Integration:</strong>
                <p>
                  For secure, transparent transactions and to maintain a trustless environment. It leverages smart
                  contracts for listing, booking, and payment processes, ensuring integrity and automation of
                  interactions between users.
                </p>
              </li>
              <li>
                <strong>Geohashing and Privacy:</strong>
                <p>
                  To address privacy concerns associated with listing personal charging stations, the project employs
                  geohashing. This technique converts precise geolocations into a short string code, providing a balance
                  between privacy and utility by allowing charger locations to be stored on the blockchain without
                  exposing exact addresses.
                </p>
              </li>
              <li>
                <strong>Off-Chain Data Management:</strong>
                <p>
                  Precise location details and potentially sensitive user data are managed off-chain, in a secure
                  database. This approach ensures that while the blockchain facilitates trust and transactional
                  integrity, personal privacy is safeguarded.
                </p>
              </li>
              <li>
                <strong>Integration with Mapping Services:</strong>
                <p>
                  For user convenience, the dApp integrates with mapping services like Google Maps, enabling users to
                  find nearby chargers easily and receive directions. This feature, while intuitive, emphasizes privacy
                  and data security, revealing precise charger locations only upon booking confirmation.
                </p>
              </li>
              <li>
                <strong>Income Generation for Charger Owners:</strong>
                <p>
                  By listing their chargers, individuals can generate passive income, contributing to the platforms
                  appeal. It not only incentivizes the expansion of EV charging infrastructure but also promotes the use
                  of renewable energy sources by making charging more accessible.
                </p>
              </li>
              <li>
                <strong>Sustainability and Community Building:</strong>
                <p>
                  The project supports the growth of the EV market by enhancing charging infrastructure accessibility.
                  It fosters a community of EV enthusiasts and environmental advocates, aligning economic incentives
                  with sustainability goals.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
