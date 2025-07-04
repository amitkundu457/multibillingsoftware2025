export default function NextBanner() {
  const features = [
    {
      icon: "https://www.exclusife.com/newhome/images/leads.png", // Replace with actual image URL
      title: "GET NEW CUSTOMERS",
    },
    {
      icon: "https://www.exclusife.com/newhome/images/automate.png", // Replace with actual image URL
      title: "ENGAGE YOUR CUSTOMER",
    },
    {
      icon: "https://www.exclusife.com/newhome/images/contactless.png", // Replace with actual image URL
      title: "CONTACTLESS TRANSACTIONS",
    },
    {
      icon: "https://www.exclusife.com/newhome/images/engage.png", // Replace with actual image URL
      title: "WHATSAPP ECOMMERCE",
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-8 px-6 py-8">
      {features.map((feature, index) => (
        <div
          key={index}
          className="relative flex items-center w-56 bg-transparent border border-[rgba(51,51,153,0.1)] rounded-lg shadow-md"
          style={{
            borderBottomWidth: "10px",
            borderBottomColor: "#333399",
          }}
        >
          {/* Icon Section */}
          <div className="flex items-center justify-center w-14 h-14">
            <img
              src={feature.icon}
              alt={feature.title}
              className="h-10 w-10 object-contain"
            />
          </div>

          {/* Title Section */}
          <div className="text-gray-800 text-sm font-semibold text-left pl-2">
            {feature.title}
          </div>
        </div>
      ))}
    </div>
  );
}
