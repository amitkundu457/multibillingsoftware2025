"use client";

export default function RetailSolution() {
  return (
    <>
      <div className="bg-gray-50 py-14 flex items-center justify-center">
        <div className="container mx-auto px-6">
          {/* Heading Section */}
          <div className="text-center mb-12">
            <h2 className="text-xl font-semibold tracking-wide text-gray-500">
              Retail Tech
            </h2>
            <h1 className="text-4xl font-bold text-gray-800 mt-4">Solutions</h1>
          </div>

          {/* Main Content Section with Image and Text */}
          <div className="md:flex md:items-center md:space-x-8 space-y-6 md:space-y-0 justify-between px-7">
            {/* Left Section - Image */}
            <div className="md:w-1/2 flex justify-center px-7">
              <img
                src="https://www.exclusife.com/newhome/images/generate-leads_new.jpg" // Replace with your image path
                alt="Customer Management"
                className="rounded-lg shadow-md"
              />
            </div>

            {/* Right Section - Text and Logo */}
            <div className="md:w-1/2 space-y-6">
              <div className="flex items-center space-x-4 justify-between">
                <h3 className="text-2xl font-semibold text-gray-800">
                  Customer Management
                </h3>
                <img
                  src="https://www.exclusife.com/newhome/images/logo-icon.png" // Replace with your logo path
                  alt="Logo"
                  className="w-24 h-auto"
                />
              </div>
              <p className="text-gray-600">
                Attracting new prospects and converting them into a sale doesn’t
                have to be complicated.
              </p>
              <p className="text-gray-600">
                Capture sophisticated customer information of all the online and
                offline customers in one place.
              </p>

              {/* Button */}
              <button
                style={{
                  padding: "10px 20px",
                  fontSize: "16px",
                  color: "#333",
                  backgroundColor: "#fff",
                  borderRadius: "30px",
                  border: "1px solid #333",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.3s ease-in-out",
                }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = "#0d6efd";
                  e.target.style.color = "#000";
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = "#fff";
                  e.target.style.color = "#333";
                }}
              >
                <span style={{ marginRight: "8px" }}>→</span> I need this..
                Yesterday!
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
