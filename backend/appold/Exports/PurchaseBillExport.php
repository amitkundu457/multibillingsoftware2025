<?php

namespace App\Exports;

use App\Models\Order;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class PurchaseBillExport implements FromCollection, WithHeadings
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return Order::where('order_slip', 1)
            ->get()
            ->map(function ($order) {
                return [
                    'Bill No' => $order->billno,
                    'Gross Total' => $order->gross_total,
                    'Discount' => $order->discount,
                    'Total Price' => $order->total_price,
                    'Customer Name' => optional($order->users)->name ?? 'N/A',
                    'Date' => $order->date,
                    'Order Details' => implode(', ', $order->details->pluck('product_name')->toArray()),
                ];
            });
    }

    /**
     * Define the column headings for the export.
     */
    public function headings(): array
    {
        return [
            'Bill No',
            'Gross Total',
            'Discount',
            'Total Price',
            'Customer Name',
            'Date',
            'Order Details',
        ];
    }
}
