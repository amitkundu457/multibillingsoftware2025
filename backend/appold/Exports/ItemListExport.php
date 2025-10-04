<?php
namespace App\Exports;

use App\Models\ItemList;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class ItemListExport implements FromCollection, WithHeadings
{
    /**
     * Retrieve all item list records.
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return ItemList::all()->map(function ($item) {
            return [
                'ID' => $item->id,
                'Item Name' => $item->name,
                'Item Code' => $item->code,
                'Rate' => $item->rate,
                'HSN' => $item->hsn,
                'Image URL' => $item->image ?? 'N/A',
            ];
        });
    }

    /**
     * Define column headings.
     * @return array
     */
    public function headings(): array
    {
        return [
            'ID',
            'Item Name',
            'Item Code',
            'Rate',
            'HSN',
           
        ];
    }
}
