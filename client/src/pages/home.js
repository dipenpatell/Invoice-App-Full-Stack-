import React, { useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { useEffect } from "react";

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [invoiceFieds, setinvoiceFieds] = useState({});
  console.log("Current cookies:", document.cookie);
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:8080/stock", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        });
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setProducts(result.stock);
          } else {
            console.error("Error fetching data:", result.message);
          }
        } else {
          console.error("Error fetching data:", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      }

    };

    fetchData();
  }, []);
  const handleFileUpload = (event) => {
    const file = event.target.files[0];

    if (!file) {
      console.warn("No file selected.");
      return;
    }

    const fileName = file.name.toLowerCase();
    const reader = new FileReader();

    reader.onload = (e) => {
      const fileContent = e.target.result;

      if (fileName.endsWith(".csv")) {
        // Parse CSV file
        Papa.parse(fileContent, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            console.log("Parsed CSV:", results.data);
            // setProducts(results.data);
          },
          error: (error) => {
            console.error("Error parsing CSV file:", error);
          },
        });
      } else if (fileName.endsWith(".xlsx") || fileName.endsWith(".xls")) {
        // Parse Excel file
        const workbook = XLSX.read(fileContent, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        console.log("Parsed Excel:", parsedData);
        handleExcelData(parsedData);
        // setProducts(parsedData);
      } else {
        console.error(
          "Unsupported file type. Please upload a CSV or Excel file."
        );
      }
    };

    // Read file as text (CSV) or binary (Excel)
    if (fileName.endsWith(".csv")) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  };
  const handleExcelData = async (data) => {
    const fields = [
      "PartType",
      "PartDescription",
      "ProductInfo",
      "Color",
      "Quantity",
      "PartNumber",
      "SingleP",
      "BulkP",
    ];
    const finalData = [];
    const rowData = {};

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      let isEmptyRow = true;

      for (let j = 0; j < fields.length; j++) {
        const cell = row[j];
        if (cell !== null && cell !== undefined && cell !== "") {
          rowData[fields[j]] = cell;
          isEmptyRow = false;
        }
      }

      if (!isEmptyRow) {
        finalData.push({ ...rowData });
      }
    }

    console.log("Processed Excel Data:", finalData);

    // let PartType = {};
    // finalData.forEach((e) => {
    //   if (!PartType[e.PartType]) {
    //     PartType[e.PartType] = {};
    //   }
    //   if (!PartType[e.PartType][e.PartDescription]) {
    //     PartType[e.PartType][e.PartDescription] = {};
    //   }
    //   if (!PartType[e.PartType][e.PartDescription][e.ProductInfo]) {
    //     PartType[e.PartType][e.PartDescription][e.ProductInfo] = {};
    //   }
    //   if (!PartType[e.PartType][e.PartDescription][e.ProductInfo][e.Color]) {
    //     PartType[e.PartType][e.PartDescription][e.ProductInfo][e.Color] = {};
    //   }
    //   PartType[e.PartType][e.PartDescription][e.ProductInfo][e.Color] = {
    //     Quantity: e.Quantity,
    //     PartNumber: e.PartNumber,
    //     SingleP: e.SingleP,
    //     BulkP: e.BulkP,
    //   };
    // });

    // console.log("PartType:", Object.keys(PartType).map(e => {
    //   return {
    //     name: e,
    //     info: PartType[e]
    //   }
    // }));

    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:8080/admin/stock-add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(finalData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log(result);
      if (result.success) {
        // seterrorMsg(result.message);
      } else {
        // seterrorMsg(result.message);
      }
      // localStorage.setItem("token", JSON.stringify(result));
    } else {
      console.error("Error:", response.statusText);
    }
    setProducts(finalData);
  };

  return (
    <div className="bg-zinc-900 flex h-screen flex-col gap-5 p-5">
      <div className="flex justify-between w-full">
        <button
          onClick={() => document.getElementById("fileInput").click()}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Import File
        </button>
        <input
          type="file"
          id="fileInput"
          onChange={handleFileUpload}
          className="hidden"
        />
        <button
          onClick={() => {
            localStorage.setItem("token", "");
            window.location.reload();
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <h4 className="text-2xl text-white">Stock</h4>
      <div className="overflow-auto scrollbar-hide p-5 rounded-md bg-zinc-800">
        <table class="table-auto">
          <thead>
            <tr>
              <th>Part Type</th>
              <th>Part Description</th>
              <th>Product Info</th>
              <th>Color</th>
              <th>Quantity</th>
              <th>Part Number</th>
              <th>Single Price</th>
              <th>Bulk Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={index}>
                <td>{product.PartType}</td>
                <td>{product.PartDescription}</td>
                <td>{product.ProductInfo}</td>
                <td>{product.Color}</td>
                <td>{product.Quantity}</td>
                <td>{product.PartNumber}</td>
                <td>{product.SingleP}</td>
                <td>{product.BulkP}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HomePage;
