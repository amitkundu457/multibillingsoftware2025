export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-6 flex items-center justify-between py-4">
        {/* Logo Section */}
        <div className="flex items-center space-x-2 margin-right:10px">
          <img
            src="https://www.exclusife.com/newhome/images/exclusife.png" // Replace with the path to your logo image
            alt="Logo"
            className="h-6"
          />
          {/* <h1 className="text-xl font-semibold text-gray-800">Exclusife</h1> */}
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-7 text-sm font-medium text-gray-600 heigh:">
          <a href="#" className="hover:text-gray-900">
            Features
          </a>
          <span>/</span>
          <a href="#" className="hover:text-gray-900">
            Solutions
          </a>
          <span>/</span>
          <a href="#" className="hover:text-gray-900">
            Products
          </a>
          <span>/</span>
          <a href="#" className="hover:text-gray-900">
            Ecosystem
          </a>
          <span>/</span>
          <a href="#" className="hover:text-gray-900">
            Clients
          </a>
        </nav>
      </div>
    </header>
  );
}
