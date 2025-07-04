"use client";
export default function OmMarketing() {
  return (
    <div className="bg-gray-50 py-14 flex items-center justify-center">
      <div className="container mx-auto px-6 md:flex md:items-center md:justify-between space-y-6 md:space-y-0">
        {/* Left Section */}
        <div className="md:w-1/2">
          <img
            src="https://www.exclusife.com/newhome/images/sales_new.jpg" // Replace with your image path
            alt="Customer Management"
            className="rounded-lg shadow-md"
          />
        </div>

        {/* Right Section */}
        <div className="md:w-1/2 space-y-4">
          <div class="flex items-center space-x-4">
            <h3 class="text-2xl font-semibold text-gray-800">
              Omni Channel Marketing
            </h3>
            <img
              src="https://www.exclusife.com/newhome/images/logo-icon.png" // Replace with your logo path
              alt="Logo"
              class="w-24 h-auto"
            />
          </div>
          <div className="space-y-2">
            <p className="text-gray-600">
              Leverage the power of digital all the channels possible starting
              from SMS to Social or WhatsApp.
            </p>
            <p className="text-gray-600">
              Reach out to them with appropriate die of communication they
              prefer and talk to your brand.
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
  );
}
