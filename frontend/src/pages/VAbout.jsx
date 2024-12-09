import React from "react";

function VAbout() {
  return (
    <>
      {" "}
      <div className="container mx-auto px-4 py-8 font-poppins bg-[url('/img/bg/list-bg.jpg')] bg-cover bg-center text-black">
        <h1 className="text-3xl font-bold mb-4 font-jost underline">
          About Us
        </h1>

        <div className="flex flex-wrap mb-8">
          {/* Creator pictures */}
          <div className="w-full md:w-1/3 mb-4">
            <img
              src="/img/Developer/chirag.jpg"
              alt="Creator 1"
              className="rounded-full w-32 h-32 mx-auto mb-2"
            />
            <p className="text-center text-bold">Chirag Bhargava</p>
            <p className="text-center">(Frontend Developer)</p>
          </div>
          <div className="w-full md:w-1/3 mb-4">
            <img
              src="/img/Developer/navneet.jpg"
              alt="Creator 2"
              className="rounded-full w-32 h-32 mx-auto mb-2"
            />
            <p className="text-center text-bold">Navneet Mathur</p>
            <p className="text-center">(Frontend Developer)</p>
          </div>
          <div className="w-full md:w-1/3 mb-4">
            <img
              src="/img/Developer/rahul.jpg"
              alt="Creator 3"
              className="rounded-full w-32 h-32 mx-auto mb-2"
            />
            <p className="text-center text-bold">Rahul Dhakad</p>
            <p className="text-center">(Backend Developer)</p>
          </div>
        </div>

        {/* About website */}
        <div className="p-4 text-3xl font-caveat  font-bold text-justify">
          <p>
            This website helps local people book all wedding resources. We
            provide a platform where users can find various vendors for their
            wedding needs, including Venue, Attire Retailer, Caterer,
            Entertainment, Florist/Decorator, Wedding Planner/Coordinator,
            Baker, Transportation, Jeweler, and Designer. Users can easily
            browse through the available vendors and book them for their wedding
            events.
          </p>
          {/* Add more paragraphs or content as needed */}
        </div>
      </div>
    </>
  );
}

export default VAbout;
