"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";

type Lab = {
  lab_title: string;
  lab_link: string | null;
  solution_link?: string | null;
};

type Course = {
  course_number: string;
  course_title: string;
  course_page_link?: string | null;
  labs: Lab[];
};

export default function SyllabusCard({ course }: { course: Course }) {
  const [openAll, setOpenAll] = useState(false);
  return (
    <Card className="border-2 border-yellow-300 bg-white shadow-lg hover:shadow-xl hover:border-slate-400 transition-all duration-300">
      <CardHeader className="border-b-2 border-slate-200 pb-4 bg-gradient-to-r from-slate-50 to-white">
        <div className="flex flex-col items-start justify-between gap-6">
          <div className="flex justify-between space-y-1 w-full">
            <CardTitle className="text-lg font-semibold text-slate-900 tracking-tight">
              {course.course_title}
            </CardTitle>
            <CardDescription className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
              {course.course_number}
            </CardDescription>
          </div>
          <div className="flex items-center gap-3">
            {course.course_page_link && (
              <Link
                href={course.course_page_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-300 transition-all duration-200"
                >
                  <ExternalLink className="h-4 w-4 mr-1.5" />
                  Course Page
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setOpenAll((s) => !s)}
              className="border-2 border-slate-400 text-slate-800 hover:bg-slate-100 hover:text-slate-900 hover:border-slate-500 font-semibold transition-all duration-200"
            >
              {openAll ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-1.5" />
                  Collapse
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-1.5" />
                  View Labs
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-5 pb-5 bg-slate-50/30">
        {openAll ? (
          <div className="space-y-3">
            {course.labs?.map((lab, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center items-start justify-between py-3 px-4 border-2 border-slate-300 rounded-lg hover:border-slate-400 hover:bg-white hover:shadow-md transition-all duration-200 bg-white"
              >
                <span className="text-sm font-semibold text-slate-800 flex-1 min-w-0 truncate">
                  {lab.lab_title}
                </span>
                <div className="flex items-center gap-2 ml-0 sm:ml-4 flex-shrink-0 mt-3 sm:mt-0">
                  {lab.solution_link ? (
                    <a
                      href={lab.solution_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-2 border-green-600 text-green-700 hover:bg-green-50 hover:text-green-800 hover:border-green-700 font-semibold min-w-[80px] transition-all duration-200"
                      >
                        Solution
                      </Button>
                    </a>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled
                      className="text-slate-400 border-2 border-slate-200 min-w-[80px] bg-slate-50"
                    >
                      Solution
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="w-0 h-0"></p>
        )}
      </CardContent>
    </Card>
  );
}
