"use client";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import SyllabusCard from "@/components/SyllabusCard";
import syllabus from "@/syllabus.json";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <Header />

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                  Gen AI Study Jams
                </h1>
              </div>
            </div>
            <h2 className="text-xl md:text-2xl font-light text-gray-600 mb-4">
              Welcome to the Study Jams hub
            </h2>
           
            <div className="max-w-2xl mx-auto">
              <SearchBar
                value={""}
                onChange={() => {}}
                placeholder="Search (disabled)"
              />
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h3 className="text-2xl font-semibold mb-6">Syllabus</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(syllabus) &&
              syllabus.map((course, idx) => (
                <SyllabusCard
                  key={course.course_number ?? idx}
                  course={course as any}
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
