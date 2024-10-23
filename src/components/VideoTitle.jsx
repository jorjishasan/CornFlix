import React from "react";

const VideoTitle = ({ title, description }) => {
  return (
    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent">
      <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto mt-[10%] max-w-xl text-white lg:mx-0 lg:mt-[20%]">
          <h1 className="text-center text-2xl font-bold sm:text-3xl md:text-4xl lg:text-left lg:text-5xl">
            {title}
          </h1>
          <p className="mt-4 hidden text-center md:block lg:text-left">
            {description}
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-4 lg:mt-6 lg:justify-start">
            <button className="rounded-md bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700">
              ▶️ Play
            </button>
            <button className="hidden rounded-md bg-gray-800/80 px-4 py-2 font-semibold text-white transition hover:bg-gray-700/80 lg:block">
              More Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoTitle;
