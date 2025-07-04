// components/Footer.js
export default function FooterSection() {
  return (
    <footer className="bg-gray-100 text-sm">
      <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div>
          <h3 className="font-semibold mb-4">PRODUCTS</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-blue-600 hover:underline">
                CRM
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline">
                Marketing Automation
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline">
                Sales
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">SOLUTIONS</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-blue-600 hover:underline">
                Generate Leads
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline">
                Generate Sales
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline">
                Control Costs
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline">
                Ring-Fencing
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">SUPPORT</h3>
          <ul className="space-y-2">
            <li>
              <a href="#" className="text-blue-600 hover:underline">
                Help Centre
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline">
                Contact Support
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline">
                About Exclusife
              </a>
            </li>
            <li>
              <a href="#" className="text-blue-600 hover:underline">
                Careers
              </a>
            </li>
          </ul>
        </div>

        {/* New column for Logo */}
        <div className="flex justify-center items-center">
          <img
            src="https://www.exclusife.com/newhome/images/logo-icon.png"
            alt="Company Logo"
            className="max-w-full h-auto"
          />
        </div>
      </div>

      {/* Updated Powered by GOFRUGAL section with black background */}
      <div className="bg-black text-white mt-6 py-4 text-center">
        <p>
          Powered by{" "}
          <a href="#" className="text-white-600 hover:underline">
            GOFRUGAL
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
