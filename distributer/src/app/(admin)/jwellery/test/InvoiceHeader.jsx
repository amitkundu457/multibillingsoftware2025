const InvoiceHeader = () => {
    return (
        <div className="border-t border-r border-l border-gray-800 ">
            {/* Top Section */}
            <div className="flex justify-between items-start border-b border-gray-800 p-4">
                <div>
                    <div className="flex items-center space-x-4">
                        <img src="https://i.imgur.com/w8dR0Ys.png" className="w-[35%]" alt=""/>
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
                        <p>Invoice No:</p> <span className="font-semibold">BNCT1369</span>
                    </p>
                    <p className="text-sm">
                        <p>Invoice Date: </p><span className="font-semibold">20/12/2024, 10:43 AM</span>
                    </p>
                    <p className="text-sm">
                       <p> BIS No:</p> <span className="font-semibold">HM/C-5190067012</span>
                    </p>
                    <p className="text-sm">
                        <p>Gold Rate:</p> <span className="font-semibold">₹8000.00</span>
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="border-r border-gray-800 p-4">
                        <p className="font-bold">BILL TO:</p>
                        <p className="text-sm">Address:</p>
                        <p className="text-sm">Phone:</p>
                        <p className="text-sm">GSTIN:</p>
                    </div>
                    <div className=" p-4">
                        <p className="font-bold">SHIP TO:</p>
                        <p className="text-sm">Address:</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InvoiceHeader;
