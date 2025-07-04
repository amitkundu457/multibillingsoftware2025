"use client";
export default function CustomerSolution() {
  return (
    <div className="bg-gray-50 py-14 flex items-center justify-center justify-between">
      <div className="container mx-auto px-6 md:flex md:items-center md:justify-between space-y-6 md:space-y-0 justify-between ">
        {/* Left Section */}
        <div className="md:w-1/2 space-y-4 justify-between">
          <div class="flex items-center space-x-4 justify-between px-7">
            <img
              src="https://www.exclusife.com/newhome/images/logo-icon.png"
              alt="Logo"
              class="w-24 h-auto"
            />

            <h3 class="text-2xl font-semibold text-gray-800">
              Customer Engagement
            </h3>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-semibold text-gray-800"></h3>
            <p className="text-gray-600">
              Customer engagement improves customer loyalty (and ultimately
              sales). Engaged customers spend much more time and money with your
              brand than they do when disengaged.
            </p>
            <p className="text-gray-600">
              Engagement creates natural evangelists. Customer engagement
              provides real and lasting return for your organization
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

        {/* Right Section */}
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
