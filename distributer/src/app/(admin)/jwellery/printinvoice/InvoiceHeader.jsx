const InvoiceHeader = ({data,logoUrl}) => {
    return (
        <div className="border-t border-r border-l border-gray-800 ">
            {/* Top Section */}
            <div className="flex justify-between items-start border-b border-gray-800 p-4">
                <div>
                    <div className="flex items-center space-x-4">
                        <img src={logoUrl} className="w-[35%]" alt=""/>
                        <div><h1 className="text-2xl font-bold text-red-700 font-poppins">RETAILJI</h1>

                            <h1 className="text-2xl font-bold text-red-600 ">JEWELLERY</h1>
                            <p className="text-sm font-semibold">Address: KOLKATA</p>
                        </div>

                    </div>

                </div>
                <div className="text-right">
                <p className="text-sm">GSTIN: <span className="font-semibold">N/A</span></p>
                    <p className="text-sm">Mobile:</p>
                    <p className="text-sm">Email:</p>
                </div>
            </div>

            {/* Middle Section */}
            <div className=" ">
                <div className=" grid grid-cols-4 gap-6 border-b border-gray-800 p-4">
                    <p className="text-sm">
                        <p>Invoice No:</p> <span className="font-semibold">{data.billno}</span>
                    </p>
                    <p className="text-sm">
                        <p>Invoice Date: </p><span className="font-semibold">{data.date}</span>
                    </p>
                    <p className="text-sm">
                        <p> BIS No:</p> <span className="font-semibold">HM/C-5190067012</span>
                    </p>
                    <p className="text-sm">
                        <p>Gold Rate:</p> <span className="font-semibold">₹8000.00</span>
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {/* Bill To Section */}
                    <div className="border-r border-gray-800 p-4">
                        <p className="font-bold">BILL TO:</p>
                        {data.users.customers.map((customer) => (
                            <div key={customer.id}>
                                <p className="text-sm">Name: {data.users.name}</p>
                                <p className="text-sm">Address: {customer.address || "N/A"}</p>
                                <p className="text-sm">Phone: {customer.phone || "N/A"}</p>
                                <p className="text-sm">GSTIN: {customer.gstin || "N/A"}</p>
                            </div>
                        ))}
                    </div>

                    {/* Ship To Section */}
                    <div className="p-4">
                        <p className="font-bold">SHIP TO:</p>
                        {data.users.customers.map((customer) => (
                            <div key={customer.id}>
                                <p className="text-sm">Address: {customer.address || "N/A"}</p>
                                <p className="text-sm">Pincode: {customer.pincode || "N/A"}</p>
                                <p className="text-sm">State: {customer.state || "N/A"}</p>
                                <p className="text-sm">Country: {customer.country || "N/A"}</p>
                            </div>
                        ))}
                    </div>
                </div>


            </div>
        </div>
    );
};

export default InvoiceHeader;
