"use client";
export default function Expan() {
  return (
    <div className="bg-gray-50 py-14 flex items-center justify-center">
      <div className="container mx-auto px-6 md:flex md:items-center md:justify-between space-y-6 md:space-y-0">
        {/* Left Section */}
        <div className="md:w-1/2 space-y-4">
          <div className="flex items-center space-x-4 justify-between px-7">
            <img
              src="https://www.exclusife.com/newhome/images/logo-icon.png" // Replace with your logo path
              alt="Logo"
              className="w-24 h-auto"
            />

            <h3 className="text-2xl font-semibold text-gray-800">Expansion</h3>
          </div>
          <div className="space-y-2">
            <p className="text-gray-600">
              Leverage Exclusífe&apos;s seamless data network of more than 9
              crore consumers.
            </p>
            <p className="text-gray-600">
              Target your local audience as per pin code, city, area, gender
              etc. and convert new leads for your business.
            </p>
          </div>
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
              e.target.style.textDecoration = "underline";
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

        {/* Right Section */}
        <div className="md:w-1/2">
          <img
            src="https://www.exclusife.com/newhome/images/expansion.jpg" // Replace with your image path
            alt="Customer Management"
            className="rounded-lg shadow-md"
          />
        </div>
      </div>
    </div>
  );
}
