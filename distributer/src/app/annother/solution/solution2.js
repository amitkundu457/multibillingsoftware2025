export default function SolutionSection2() {
  return (
    <div className="bg-gray-50 py-14 flex items-center justify-center">
      <div className=" mx-auto px-6 md:flex md:items-center md:justify-between space-y-6 md:space-y-0">
        {/* Left Section */}

        {/* Right Section */}
        <div className="md:w-1/2 space-y-4">
          <h2 className="text-xl font-semibold tracking-wide text-gray-500 uppercase">
            Retail Tech
          </h2>
          <h1 className="text-4xl font-bold text-gray-800">Solutions</h1>
          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-gray-800">
              Customer Management
            </h3>
            <p className="text-gray-600">
              Attracting new prospects and converting it into a sale doesn’t
              have to be complicated.
            </p>
            <p className="text-gray-600">
              Capture sophisticated customer information of all the online and
              offline customers at one place.
            </p>
          </div>
          <button className="mt-4 px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center">
            <span className="mr-2">→</span> I need this.. Yesterday!
          </button>
        </div>
        <div className="md:w-1/2">
          <img
            src="https://www.exclusife.com/newhome/images/marketing_new.jpg" // Replace with your image path
            alt="Customer Management"
            className="rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
}
