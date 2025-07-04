export default function Solution() {
    return (
      <div className="bg-gray-50 py-12 px-4 sm:px-8 lg:px-16 bg-[url('https://www.exclusife.com/newhome/images/ecosystem.png')]">
        {/* Title Section */}
        <div className="text-center mb-8">
          <p className="text-lg font-medium text-gray-500 uppercase">Exclusife</p>
          <h1 className="text-4xl font-extrabold text-gray-800">Ecosystem</h1>
        </div>
  
        {/* Circles Section */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-8 mb-12">
          {/* Circle 1 */}
          <div className="flex flex-col items-center justify-center w-40 h-40 bg-blue-700 text-white rounded-full">
            <p className="text-2xl font-bold">8000+</p>
            <p className="text-lg">Retailers</p>
          </div>
          {/* Circle 2 */}
          <div className="flex flex-col items-center justify-center w-40 h-40 bg-green-600 text-white rounded-full">
            <p className="text-2xl font-bold">25+</p>
            <p className="text-lg">Cities</p>
          </div>
          {/* Circle 3 */}
          <div className="flex flex-col items-center justify-center w-40 h-40 bg-red-500 text-white rounded-full">
            <p className="text-2xl font-bold">9 CR</p>
            <p className="text-lg">Consumers</p>
          </div>
        </div>
  
        {/* Categories Section */}
        <div className="text-center text-gray-800">
          <h2 className="text-lg font-bold mb-4">Across Categories & Cities</h2>
          <p className="text-gray-600 mb-2">
            <strong>Categories:</strong> Food, Beauty, Apparel, Jewellery, Electronics,
            and a lot more
          </p>
          <p className="text-gray-600">
            <strong>Cities:</strong> Delhi, Mumbai, Pune, Kolkata, Jaipur,
            Ahmedabad, Chennai, and a lot more
          </p>
        </div>
      </div>
    );
  }