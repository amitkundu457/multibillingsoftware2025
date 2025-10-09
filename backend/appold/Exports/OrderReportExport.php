<?php
namespace App\Exports;

use App\Models\Order;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class OrderReportExport implements FromCollection, WithHeadings
{
    protected $orders;

    public function __construct($orders)
    {
        $this->orders = $orders;
    }

    public function collection()
    {
        return $this->orders->map(function ($order) {
            return [
                'Bill No' => $order->billno,
                'Gross Total' => $order->gross_total,
                'Discount' => $order->discount,
                'Total Price' => $order->total_price,
                'Customer ID' => $order->customer_id,
               
            
                'Date' => $order->date,
            ];
        });
    }

    public function headings(): array
    {
        return ['Bill No', 'Gross Total', 'Discount', 'Total Price', 'Customer ID', 'Date'];
    }
}

