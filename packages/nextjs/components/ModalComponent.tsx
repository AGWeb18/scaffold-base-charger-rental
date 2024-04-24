/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useState } from "react";
import { Charger } from "../app/interfaces/ChargerInterface";
import { addHours, format, setHours, setMinutes } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAccount } from "wagmi";
import CheckoutComponent from "~~/components/CheckoutComponent";

interface ModalComponentProps {
  isVisible: boolean;
  onClose: () => void;
  charger: Charger | null;
}

const ModalComponent: React.FC<ModalComponentProps> = ({ isVisible, onClose, charger }) => {
  const { address: connectedAddress } = useAccount();

  const [numHours, setNumHours] = useState<number>(1);
  const [startDate, setStartDate] = useState<Date>(new Date()); // Initialized to a new Date object
  const [transactionMessage, setTransactionMessage] = useState<string>("");

  // This function will update when the user selects a start time
  const handleDateChange = (date: Date | null) => {
    setStartDate(date || new Date()); // Fallback to a new Date if null
  };

  const handleHourChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNumHours(parseInt(event.target.value, 10));
  };

  const [minTime, maxTime] = useMemo(() => {
    // Ensure startDate is a valid date object
    const validStartDate = startDate || new Date();
    const startOfDay = setHours(setMinutes(validStartDate, 0), 0);

    // Ensure that charger is not null and openHour and closeHour are defined
    if (charger && charger.open_hour !== undefined && charger.close_hour !== undefined) {
      return [setHours(startOfDay, charger.open_hour), setHours(startOfDay, charger.close_hour - numHours)];
    }
    // Return default times if charger is null or openHour/closeHour are not defined
    return [setHours(startOfDay, 0), setHours(startOfDay, 24 - numHours)];
  }, [charger, numHours, startDate]);

  const startTime = startDate ? format(startDate, "HH:mm") : "";
  const endTime = startDate ? format(addHours(startDate, numHours), "HH:mm") : "";
  const totalCost = charger ? parseFloat(charger.pricePerHour) * numHours : 0;

  if (!isVisible || charger === null) return null;

  return (
    <dialog open className="modal rounded-lg bg-blend-overlay bg-secondary bg-opacity-75">
      <div className="modal-box w-1/2 relative bg-white rounded-lg shadow-xl overflow-hidden">
        <button type="button" className="btn btn-sm btn-circle absolute right-2 top-2" onClick={onClose}>
          ✕
        </button>
        <div className="bg-primary text-white p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <h3 className="font-bold">{charger.location_name}</h3>
          <p className="font-bold">{`$${charger.pricePerHour} per hour`}</p>
          <p className="font-bold">{`Available from ${charger.open_hour}:00 to ${charger.close_hour}:00`}</p>
          <p className="font-bold">{`Hosted by User ID: ${charger.user_id.slice(13, 19)}`}</p>
        </div>

        <div className="p-2">
          <div className="mt-1">
            <label htmlFor="numHours" className=" mb-1 block text-sm font-medium text-gray-700">
              {`Duration (hours): ${numHours}`}
            </label>
            <input
              id="numHours"
              type="range"
              min="1"
              max="5"
              onChange={handleHourChange}
              value={numHours}
              className="range range-primary range-lg w-full h-6"
              step="1"
            />
            <div className="w-full flex justify-between text-xs px-2">
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="datepicker" className="block text-sm font-medium text-gray-700">
              Select Date and Start Time:
            </label>
            <div className="flex w-full h-full justify-center mt-1">
              <DatePicker
                aria-label="Select a date and time"
                id="startTimePicker"
                selected={startDate}
                onChange={handleDateChange}
                showTimeSelect
                inline // This will make the calendar always visible
                timeFormat="HH:mm"
                timeIntervals={15} // Show time in intervals of 15 minutes
                timeCaption="Time"
                dateFormat="MMMM d, yyyy h:mm aa" // Format for displaying date and time
                className="form-input w-full rounded-xl border-2"
              />
            </div>
          </div>

          {/* Sticky footer for total cost and checkout action */}
          <div className="flex flex-col mt-2 bg-white pt-2">
            <div className="flex items-center">
              <div className="text-sm">
                <p className="text-md font-semibold text-accent">Total Cost:</p>
                <p className="text-lg font-bold text-accent">{`$${totalCost.toFixed(2)}`}</p>
              </div>
              <div className="modal-action">
                <CheckoutComponent
                  aria-live="polite"
                  totalCost={totalCost.toFixed(2)}
                  chargerId={charger.charger_id} // Assuming `id` is the property name for charger's UUID
                  userId={String(connectedAddress)} // This is an example, adjust based on your actual user state management
                  numHours={numHours}
                  bookingDate={startDate.toISOString()} // Format as ISO string; adjust if your backend expects a different format
                />{" "}
              </div>
            </div>
          </div>
        </div>

        {transactionMessage && (
          <div
            className={`alert ${
              transactionMessage.includes("failed") ? "alert-error" : "alert-success"
            } rounded-md mt-4 p-3`}
          >
            {transactionMessage}
          </div>
        )}
      </div>
    </dialog>
  );
};

export default ModalComponent;
