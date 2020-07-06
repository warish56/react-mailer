import { useCallback, useState } from "react";

const useExcelReader = () => {
  const [rows, updateRows] = useState([]);
  const [fileProcessing, updateFileProcessing] = useState(false);

  const resetFiles = useCallback(() => {
    updateRows([]);
    updateFileProcessing([]);
  }, []);

  const readFile = useCallback((file) => {
    updateFileProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      const workbook = window.XLSX.read(data, {
        type: "binary",
      });

      workbook.SheetNames.forEach((sheetName) => {
        // Here is your object
        const XL_row_object = window.XLSX.utils.sheet_to_row_object_array(
          workbook.Sheets[sheetName]
        );
        updateRows(XL_row_object);
        console.log(XL_row_object);
      });

      updateFileProcessing(false);
    };

    reader.readAsBinaryString(file);
  }, []);

  return {
    readExcelFile: readFile,
    rows,
    fileProcessing,
    resetFiles,
  };
};

export default useExcelReader;
