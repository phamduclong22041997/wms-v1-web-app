<?php

namespace EFT\UtilityBundle\Lib;
use PhpOffice\PhpSpreadsheet\IOFactory; 

class ExcelUtility {

    /**
     * Read Data
     */
    public static function readFile($file) 
    {
        $ext = pathinfo($file->getClientOriginalName(), PATHINFO_EXTENSION);
        $reader = IOFactory::createReader(ucfirst($ext));
        $reader->setReadDataOnly(true);
        $spreadsheet = $reader->load($file->getRealPath());

        $sheetData = $spreadsheet->getActiveSheet()->toArray(null, true, true, true);
        return array(
            'rows' => $sheetData,
            'total' => count($sheetData)
        );
    }
    
}
