"use client"

import React from "react";
import InvoiceHeader from "./InvoiceHeader";
import InvoiceTable from "./InvoiceTable";
import InvoiceFooter from "./InvoiceFooter";

const Test = () => {
    return (
        <div className="max-w-[60rem] mx-auto bg-white p-6 shadow-md">
            <InvoiceHeader />
            <InvoiceTable />
            <InvoiceFooter />
        </div>
    );
};

export default Test;
