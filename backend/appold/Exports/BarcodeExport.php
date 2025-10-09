<?php
namespace App\Exports;

use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use App\Models\Barcode;

class BarcodeExport implements FromCollection, WithHeadings
{
    protected $barcodes;

    public function __construct($barcodes)
    {
        $this->barcodes = $barcodes;
    }

    public function collection()
    {
        return $this->barcodes;
    }

    public function headings(): array
    {
        return ['ID', 'Barcode No', 'SKU', 'Item No', 'Design', 'Sale Rate', 'Date'];
    }
}
