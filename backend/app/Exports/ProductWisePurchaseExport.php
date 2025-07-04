<?php

namespace App\Exports;

use App\Models\OrderDetail;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ProductWisePurchaseExport implements FromCollection, WithHeadings
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return OrderDetail::with(['order', 'product'])
            ->whereHas('order', function ($query) {
                $query->where('order_slip', 1);
            })
            ->get()
            ->map(function ($detail) {
                return [
                    'Product Name' => optional($detail->product)->name ?? 'N/A',
                    'Bill No' => optional($detail->order)->billno ?? 'N/A',
                    'Quantity' => $detail->quantity,
                    'Unit Price' => $detail->unit_price,
                    'Total Price' => $detail->quantity * $detail->unit_price,
                    'Customer Name' => optional($detail->order->users)->name ?? 'N/A',
                    'Purchase Date' => optional($detail->order)->date ?? 'N/A',
                ];
            });
    }

    /**
     * Define the column headings for the export.
     */
    public function headings(): array
    {
        return [
            'Product Name',
            'Bill No',
            'Quantity',
            'Unit Price',
            'Total Price',
            'Customer Name',
            'Purchase Date',
        ];
    }
}
