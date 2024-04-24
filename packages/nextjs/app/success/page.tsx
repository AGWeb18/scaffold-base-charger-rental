"use client";

// Adjust the import path if necessary
export default function Success() {
  return (
    <>
      <div className="bg-gradient-to-r from-cyan-500 to-blue-200 flex items-center flex-col flex-grow pt-10 mx-15">
        <div className="flex flex-col bg-base-100 px-10 py-10 text-center items-center w-3/4 rounded-3xl">
          <h1>Success!</h1>
          <h3 className="text-xl font-bold">Thank you for the submission </h3>
        </div>
      </div>
    </>
  );
}
