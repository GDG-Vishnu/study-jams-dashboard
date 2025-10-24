"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Award,
  Trophy,
} from "lucide-react";

// dynamic import for xlsx to keep bundle small
async function parseXLSX(
  arrayBuffer: ArrayBuffer
): Promise<{ headers: string[]; data: Record<string, string>[] }> {
  const XLSX = await import("xlsx");
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const firstSheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheetName];
  const json = XLSX.utils.sheet_to_json<Record<string, any>>(sheet, {
    defval: "",
  });
  if (!Array.isArray(json) || json.length === 0)
    return { headers: [], data: [] };
  const headers = Object.keys(json[0]);
  const data: Record<string, string>[] = json.map((row) => {
    const out: Record<string, string> = {};
    headers.forEach((h) => {
      out[h] = row[h] != null ? String(row[h]) : "";
    });
    return out;
  });
  return { headers, data };
}

const FileUploadPreview = () => {
  const router = useRouter();
  const { isAdmin } = useAuth();
  useEffect(() => {
    if (!isAdmin) router.push("/admin/login");
  }, [isAdmin]);
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [previewData, setPreviewData] = useState<Record<string, string>[]>([]);
  const [fullRows, setFullRows] = useState<Record<string, string>[]>([]);
  const [rawCsvText, setRawCsvText] = useState<string | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (
      droppedFile &&
      (droppedFile.name.endsWith(".xlsx") || droppedFile.name.endsWith(".csv"))
    ) {
      setFile(droppedFile);
      processFile(droppedFile);
    } else {
      setError("Please drop a valid XLSX or CSV file.");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (
      selectedFile &&
      (selectedFile.name.endsWith(".xlsx") ||
        selectedFile.name.endsWith(".csv"))
    ) {
      setFile(selectedFile);
      processFile(selectedFile);
    } else {
      setError("Please select a valid XLSX or CSV file.");
    }
  };

  const parseCSV = (
    text: string
  ): { headers: string[]; data: Record<string, string>[] } => {
    const lines = text.split("\n").filter((line: string) => line.trim());
    if (lines.length === 0) return { headers: [], data: [] };

    const headers: string[] = lines[0]
      .split(",")
      .map((h: string) => h.trim().replace(/^"|"$/g, ""));
    const data: Record<string, string>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values: string[] = lines[i]
        .split(",")
        .map((v: string) => v.trim().replace(/^"|"$/g, ""));
      const row: Record<string, string> = {};
      headers.forEach((header: string, index: number) => {
        row[header] = values[index] || "";
      });
      data.push(row);
    }

    return { headers, data };
  };

  const processFile = async (selectedFile: File) => {
    setLoading(true);
    setError(null);
    setPreviewData([]);
    setHeaders([]);

    try {
      if (selectedFile.name.endsWith(".csv")) {
        const text = await selectedFile.text();
        setRawCsvText(text);
        const { headers: csvHeaders, data: csvData } = parseCSV(text);
        setHeaders(csvHeaders);
        setFullRows(csvData);
        setPreviewData(csvData.slice(0, 3));
      } else if (
        selectedFile.name.endsWith(".xlsx") ||
        selectedFile.name.endsWith(".xls")
      ) {
        // Parse XLSX using the xlsx library (client-side)
        try {
          const arrayBuffer = await selectedFile.arrayBuffer();
          const parsed = await parseXLSX(arrayBuffer);
          setHeaders(parsed.headers);
          setFullRows(parsed.data);
          setPreviewData(parsed.data.slice(0, 3));
          setRawCsvText(null);
        } catch (err) {
          console.error("Failed to parse XLSX", err);
          setError("Failed to parse XLSX file.");
        }
      } else {
        setError("Unsupported file type");
      }
    } catch (err) {
      setError("Failed to process file. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (index: number): string => {
    switch (index) {
      case 0:
        return "from-yellow-400 to-yellow-600";
      case 1:
        return "from-gray-400 to-gray-600";
      case 2:
        return "from-orange-400 to-orange-600";
      default:
        return "from-blue-400 to-blue-600";
    }
  };

  const getRankBg = (index: number): string => {
    switch (index) {
      case 0:
        return "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300";
      case 1:
        return "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300";
      case 2:
        return "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300";
      default:
        return "bg-white border-gray-200";
    }
  };

  const [publishStatus, setPublishStatus] = useState<string | null>(null);

  const handleUploadAndView = () => {
    if (fullRows.length === 0) return;
    try {
      if (rawCsvText) {
        localStorage.setItem("tableDataType", "csv");
        localStorage.setItem("tableData", rawCsvText);
      } else {
        // For parsed XLSX data, save JSON string of the sheet rows
        localStorage.setItem("tableDataType", "xlsx");
        localStorage.setItem("tableData", JSON.stringify(fullRows));
      }
      router.push("/display");
    } catch (e) {
      console.warn("Failed to store table data in localStorage", e);
    }
  };

  const publishToLeaderboard = async () => {
    if (fullRows.length === 0) return;
    setPublishStatus("publishing");
    try {
      const res = await fetch("/api/leaderboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows: fullRows }),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setPublishStatus("success");
        // Notify other open tabs (report page) that leaderboard was updated so they can re-fetch
        try {
          if (typeof BroadcastChannel !== "undefined") {
            const bc = new BroadcastChannel("leaderboard_updates");
            bc.postMessage({ type: "leaderboard:updated", ts: Date.now() });
            bc.close();
          } else {
            // fallback for older browsers / contexts
            localStorage.setItem("leaderboard_updated", Date.now().toString());
          }
        } catch (e) {
          // no-op if notification fails
          console.warn("notify failed", e);
        }
      } else {
        setPublishStatus("error");
        console.error("Publish failed", json);
      }
    } catch (err) {
      setPublishStatus("error");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl shadow-lg mb-4">
            <FileSpreadsheet className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            File Upload & Preview
          </h1>
          <p className="text-gray-600 text-lg">
            Upload your XLSX or CSV file to preview the first 3 entries
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-200">
          <div
            className={`border-2 border-dashed rounded-2xl p-12 transition-all duration-300 ${
              isDragging
                ? "border-blue-500 bg-blue-50 scale-105"
                : "border-gray-300 hover:border-blue-400 bg-gray-50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-center">
              <div
                className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-300 ${
                  isDragging ? "bg-blue-500 scale-110" : "bg-blue-100"
                }`}
              >
                <Upload
                  className={`h-10 w-10 ${
                    isDragging ? "text-white" : "text-blue-600"
                  }`}
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {isDragging
                  ? "Drop your file here"
                  : "Drag and drop your file here"}
              </h3>
              <p className="text-gray-500 mb-6">or</p>
              <label className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold cursor-pointer hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-lg">
                <span>Browse Files</span>
                <input
                  type="file"
                  accept=".xlsx,.csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <p className="text-sm text-gray-400 mt-4">
                Supports XLSX and CSV files (Max 10MB)
              </p>
            </div>

            {file && !loading && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-center gap-3 bg-green-50 rounded-xl p-4 border border-green-200">
                  <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB •{" "}
                      {file.type || "Unknown type"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {loading && (
            <div className="mt-6 text-center">
              <div className="inline-flex items-center gap-3 bg-blue-50 rounded-xl px-6 py-3 border border-blue-200">
                <svg
                  className="animate-spin h-5 w-5 text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="text-blue-700 font-medium">
                  Processing file...
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 flex items-center gap-3 text-red-700 bg-red-50 border border-red-200 rounded-xl p-4">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}
        </div>

        {/* Preview Section */}
        {previewData.length > 0 && (
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="h-6 w-6 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Top 3 Members Preview
              </h2>
              <span className="ml-auto px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full">
                {previewData.length} entries
              </span>
            </div>

            <div className="space-y-4">
              {previewData.map((member, index) => (
                <div
                  key={index}
                  className={`rounded-2xl border-2 p-6 transition-all hover:shadow-lg ${getRankBg(
                    index
                  )}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${getRankColor(
                          index
                        )} text-white font-bold text-xl shadow-lg`}
                      >
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                          {member[headers[0]] || member.Name || "N/A"}
                          {index === 0 && (
                            <Trophy className="h-5 w-5 text-yellow-600" />
                          )}
                        </h3>
                        <p className="text-gray-600 flex items-center gap-2 mt-1">
                          <Mail className="h-4 w-4" />
                          {member[headers[1]] || member.Email || "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-4">
                    {headers.slice(2).map((header, headerIndex) => (
                      <div
                        key={headerIndex}
                        className="bg-white/50 rounded-lg p-3 border border-gray-200"
                      >
                        <p className="text-xs text-gray-500 font-medium mb-1 truncate">
                          {header}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {member[header] || "N/A"}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <button
                      onClick={publishToLeaderboard}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Publish to Leaderboard
                    </button>
                    {publishStatus === "publishing" && (
                      <div className="text-sm text-gray-500">Publishing...</div>
                    )}
                    {publishStatus === "success" && (
                      <div className="text-sm text-green-600">Published ✔</div>
                    )}
                    {publishStatus === "error" && (
                      <div className="text-sm text-red-600">Publish failed</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadPreview;
