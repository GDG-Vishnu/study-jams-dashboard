"use client";
import React, { useEffect, useState } from "react";
import Papa from "papaparse";

export default function DisplayPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    try {
      const type = localStorage.getItem("tableDataType");
      const rawData = localStorage.getItem("tableData");

      if (!rawData) {
        setData([]);
        return;
      }

      if (type === "csv") {
        const parsed = Papa.parse(rawData, { header: false });
        setData(Array.isArray(parsed.data) ? parsed.data : []);
      } else if (type === "xlsx") {
        try {
          const parsed = JSON.parse(rawData);
          setData(Array.isArray(parsed) ? parsed : []);
        } catch (e) {
          setData([]);
        }
      } else {
        // Unknown type, attempt JSON parse then fallback to CSV parse
        try {
          const parsed = JSON.parse(rawData);
          setData(Array.isArray(parsed) ? parsed : []);
        } catch (e) {
          const parsed = Papa.parse(rawData, { header: false });
          setData(Array.isArray(parsed.data) ? parsed.data : []);
        }
      }
    } catch (e) {
      console.error("Failed to load tableData from localStorage", e);
      setData([]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold mb-4">Uploaded File Content</h2>
        {data.length > 0 ? (
          <div className="overflow-x-auto">
            <table
              className="w-full border-collapse"
              style={{ borderCollapse: "collapse" }}
            >
              <thead>
                <tr>
                  {Array.isArray(data[0])
                    ? data[0].map((col: any, i: number) => (
                        <th
                          key={i}
                          className="border px-3 py-2 text-left bg-gray-100"
                        >
                          {col}
                        </th>
                      ))
                    : Object.keys(data[0]).map((col, i) => (
                        <th
                          key={i}
                          className="border px-3 py-2 text-left bg-gray-100"
                        >
                          {col}
                        </th>
                      ))}
                </tr>
              </thead>
              <tbody>
                {Array.isArray(data[0])
                  ? data.slice(1).map((row: any[], rowIndex: number) => (
                      <tr key={rowIndex} className="even:bg-gray-50">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="border px-3 py-2">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))
                  : data.map((row: Record<string, any>, rowIndex: number) => (
                      <tr key={rowIndex} className="even:bg-gray-50">
                        {Object.keys(row).map((k, cellIndex) => (
                          <td key={cellIndex} className="border px-3 py-2">
                            {row[k]}
                          </td>
                        ))}
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>
            No data found. Please upload a file first using the admin upload
            page.
          </p>
        )}
      </div>
    </div>
  );
}
