// "use client"
// import React, { useState, useEffect } from 'react';
// import Papa from 'papaparse';
// import { 
//   Trophy, 
//   Medal, 
//   Award, 
//   Users, 
//   Calendar, 
//   Target, 
//   Star,
//   ExternalLink,
//   TrendingUp,
//   BookOpen,
//   Brain,
//   Gamepad2,
//   Search,
//   CheckCircle,
//   XCircle,
//   BarChart3,
//   User,
//   Mail,
//   Link,
//   Activity,
//   ChevronDown,
//   Download,
//   Filter
// } from 'lucide-react';

// // Define TypeScript interfaces
// interface ReportData {
//   id: number;
//   userName: string;
//   userEmail: string;
//   profileUrl: string;
//   profileStatus: string;
//   accessCodeRedemption: string;
//   milestoneEarned: string;
//   skillBadgesCount: number;
//   skillBadgeNames: string[];
//   arcadeGamesCount: number;
//   arcadeGameNames: string[];
//   triviaGamesCount: number;
//   triviaGameNames: string[];
//   labFreeCourseCount: number;
//   labFreeCourseNames: string[];
//   totalBadges: number;
// }

// interface LeaderboardEntry {
//   rank: number;
//   userName: string;
//   userEmail: string;
//   totalBadges: number;
//   skillBadges: number;
//   arcadeGames: number;
//   triviaGames: number;
//   labFreeCourses: number;
// }

// const DailyReportPage: React.FC = () => {
//   const [reportData, setReportData] = useState<ReportData[]>([]);
//   const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [selectedView, setSelectedView] = useState<'overview' | 'detailed'>('overview');
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     const parseCsvFile = async () => {
//       try {
//         // Try to fetch the actual CSV file first
//         const response = await fetch('/report.csv');
//         if (response.ok) {
//           const csvContent = await response.text();
//           Papa.parse(csvContent, {
//             header: true,
//             skipEmptyLines: true,
//             dynamicTyping: false,
//             delimitersToGuess: [',', '\t', '|', ';'],
//             complete: (results) => {
//               const parsedData: ReportData[] = results.data.map((row: any, index: number) => {
//                 // Clean headers by trimming whitespace
//                 const cleanRow: any = {};
//                 Object.keys(row).forEach(key => {
//                   cleanRow[key.trim()] = row[key];
//                 });

//                 return {
//                   id: index + 1,
//                   userName: cleanRow['User Name'] || '',
//                   userEmail: cleanRow['User Email'] || '',
//                   profileUrl: cleanRow['Google Cloud Skills Boost Profile URL'] || '',
//                   profileStatus: cleanRow['Profile URL Status'] || '',
//                   accessCodeRedemption: cleanRow['Access Code Redemption Status'] || '',
//                   milestoneEarned: cleanRow['Milestone Earned'] || 'None',
//                   skillBadgesCount: parseInt(cleanRow['# of Skill Badges Completed']) || 0,
//                   skillBadgeNames: cleanRow['Names of Completed Skill Badges']
//                     ? cleanRow['Names of Completed Skill Badges'].split(' | ').filter((name: string) => name.trim())
//                     : [],
//                   arcadeGamesCount: parseInt(cleanRow['# of Arcade Games Completed']) || 0,
//                   arcadeGameNames: cleanRow['Names of Completed Arcade Games']
//                     ? cleanRow['Names of Completed Arcade Games'].split(' | ').filter((name: string) => name.trim())
//                     : [],
//                   triviaGamesCount: parseInt(cleanRow['# of Trivia Games Completed']) || 0,
//                   triviaGameNames: cleanRow['Names of Completed Trivia Games']
//                     ? cleanRow['Names of Completed Trivia Games'].split(' | ').filter((name: string) => name.trim())
//                     : [],
//                   labFreeCourseCount: parseInt(cleanRow['# of Lab-free Courses Completed']) || 0,
//                   labFreeCourseNames: cleanRow['Names of Completed Lab-free Courses']
//                     ? cleanRow['Names of Completed Lab-free Courses'].split(' | ').filter((name: string) => name.trim())
//                     : [],
//                   totalBadges:
//                     (parseInt(cleanRow['# of Skill Badges Completed']) || 0) +
//                     (parseInt(cleanRow['# of Arcade Games Completed']) || 0) +
//                     (parseInt(cleanRow['# of Trivia Games Completed']) || 0) +
//                     (parseInt(cleanRow['# of Lab-free Courses Completed']) || 0),
//                 };
//               }).filter(user => user.userName); // Filter out empty rows

//               setReportData(parsedData);
//               generateLeaderboard(parsedData);
//             },
//             //@ts-ignore
//             error: (error) => {
//               console.error('Error parsing CSV:', error);
//               loadMockData();
//             },
//           });
//         } else {
//           throw new Error('CSV file not found');
//         }
//       } catch (error) {
//         console.error('Error fetching CSV:', error);
//         loadMockData();
//       } finally {
//         setLoading(false);
//       }
//     };

//     const loadMockData = () => {
//       // Mock data for demonstration when CSV is not available
//       const mockData: ReportData[] = [
//         {
//           id: 1,
//           userName: "Alice Johnson",
//           userEmail: "alice.johnson@email.com",
//           profileUrl: "https://www.cloudskillsboost.google/public_profiles/alice-johnson",
//           profileStatus: "All Good",
//           accessCodeRedemption: "Redeemed",
//           milestoneEarned: "Advanced Milestone",
//           skillBadgesCount: 15,
//           skillBadgeNames: ["Create and Manage Cloud Resources", "Perform Foundational Infrastructure Tasks", "Set Up and Configure a Cloud Environment", "Deploy and Manage Cloud Environments", "Build and Secure Networks"],
//           arcadeGamesCount: 8,
//           arcadeGameNames: ["Level 3: GenAI", "The Arcade Trivia October 2024", "The Arcade Base Camp"],
//           triviaGamesCount: 12,
//           triviaGameNames: ["Cloud Study Jam Trivia", "Generative AI Trivia", "Cloud Security Trivia"],
//           labFreeCourseCount: 6,
//           labFreeCourseNames: ["Google Cloud Computing Foundations: Cloud Computing Fundamentals", "Google Cloud Computing Foundations: Infrastructure"],
//           totalBadges: 41
//         },
//         {
//           id: 2,
//           userName: "Bob Smith",
//           userEmail: "bob.smith@email.com",
//           profileUrl: "https://www.cloudskillsboost.google/public_profiles/bob-smith",
//           profileStatus: "All Good",
//           accessCodeRedemption: "Redeemed",
//           milestoneEarned: "Intermediate Milestone",
//           skillBadgesCount: 12,
//           skillBadgeNames: ["Create and Manage Cloud Resources", "Perform Foundational Infrastructure Tasks", "Set Up and Configure a Cloud Environment"],
//           arcadeGamesCount: 5,
//           arcadeGameNames: ["The Arcade Base Camp", "Level 1: GenAI"],
//           triviaGamesCount: 8,
//           triviaGameNames: ["Cloud Study Jam Trivia", "Generative AI Trivia"],
//           labFreeCourseCount: 4,
//           labFreeCourseNames: ["Google Cloud Computing Foundations: Cloud Computing Fundamentals"],
//           totalBadges: 29
//         },
//         {
//           id: 3,
//           userName: "Carol Davis",
//           userEmail: "carol.davis@email.com",
//           profileUrl: "https://www.cloudskillsboost.google/public_profiles/carol-davis",
//           profileStatus: "Profile Incomplete",
//           accessCodeRedemption: "Not Redeemed",
//           milestoneEarned: "Beginner Milestone",
//           skillBadgesCount: 8,
//           skillBadgeNames: ["Create and Manage Cloud Resources", "Perform Foundational Infrastructure Tasks"],
//           arcadeGamesCount: 3,
//           arcadeGameNames: ["The Arcade Base Camp"],
//           triviaGamesCount: 5,
//           triviaGameNames: ["Cloud Study Jam Trivia"],
//           labFreeCourseCount: 2,
//           labFreeCourseNames: ["Google Cloud Computing Foundations: Cloud Computing Fundamentals"],
//           totalBadges: 18
//         },
//         {
//           id: 4,
//           userName: "David Wilson",
//           userEmail: "david.wilson@email.com",
//           profileUrl: "https://www.cloudskillsboost.google/public_profiles/david-wilson",
//           profileStatus: "All Good",
//           accessCodeRedemption: "Redeemed",
//           milestoneEarned: "Advanced Milestone",
//           skillBadgesCount: 18,
//           skillBadgeNames: ["Create and Manage Cloud Resources", "Perform Foundational Infrastructure Tasks", "Set Up and Configure a Cloud Environment", "Deploy and Manage Cloud Environments", "Build and Secure Networks", "Manage Data with Google Cloud", "Engineer Data for Predictive Modeling"],
//           arcadeGamesCount: 10,
//           arcadeGameNames: ["Level 3: GenAI", "The Arcade Trivia October 2024", "The Arcade Base Camp", "Level 2: GenAI"],
//           triviaGamesCount: 15,
//           triviaGameNames: ["Cloud Study Jam Trivia", "Generative AI Trivia", "Cloud Security Trivia", "Data Analytics Trivia"],
//           labFreeCourseCount: 8,
//           labFreeCourseNames: ["Google Cloud Computing Foundations: Cloud Computing Fundamentals", "Google Cloud Computing Foundations: Infrastructure", "Google Cloud Computing Foundations: Networking & Security"],
//           totalBadges: 51
//         },
//         {
//           id: 5,
//           userName: "Emma Brown",
//           userEmail: "emma.brown@email.com",
//           profileUrl: "https://www.cloudskillsboost.google/public_profiles/emma-brown",
//           profileStatus: "All Good",
//           accessCodeRedemption: "Redeemed",
//           milestoneEarned: "Intermediate Milestone",
//           skillBadgesCount: 6,
//           skillBadgeNames: ["Create and Manage Cloud Resources", "Perform Foundational Infrastructure Tasks"],
//           arcadeGamesCount: 4,
//           arcadeGameNames: ["The Arcade Base Camp", "Level 1: GenAI"],
//           triviaGamesCount: 7,
//           triviaGameNames: ["Cloud Study Jam Trivia", "Generative AI Trivia"],
//           labFreeCourseCount: 3,
//           labFreeCourseNames: ["Google Cloud Computing Foundations: Cloud Computing Fundamentals"],
//           totalBadges: 20
//         }
//       ];

//       setReportData(mockData);
//       generateLeaderboard(mockData);
//     };

//     const generateLeaderboard = (data: ReportData[]) => {
//       const leaderboard: LeaderboardEntry[] = data
//         .map((user) => ({
//           rank: 0,
//           userName: user.userName,
//           userEmail: user.userEmail,
//           totalBadges: user.totalBadges,
//           skillBadges: user.skillBadgesCount,
//           arcadeGames: user.arcadeGamesCount,
//           triviaGames: user.triviaGamesCount,
//           labFreeCourses: user.labFreeCourseCount,
//         }))
//         .sort((a, b) => b.totalBadges - a.totalBadges)
//         .map((user, index) => ({ ...user, rank: index + 1 }));

//       setLeaderboardData(leaderboard);
//     };

//     parseCsvFile();
//   }, []);

//   // Enhanced dropdown component with hover effects
//   const StyledDropdown = ({ items, count, type, color }: { 
//     items: string[], 
//     count: number, 
//     type: string, 
//     color: string
//   }) => {
//     const [isOpen, setIsOpen] = useState(false);

//     const colorClasses = {
//       blue: {
//         bg: 'from-blue-500 to-blue-600',
//         hover: 'hover:border-blue-200',
//         text: 'text-blue-700'
//       },
//       green: {
//         bg: 'from-green-500 to-green-600',
//         hover: 'hover:border-green-200',
//         text: 'text-green-700'
//       },
//       purple: {
//         bg: 'from-purple-500 to-purple-600',
//         hover: 'hover:border-purple-200',
//         text: 'text-purple-700'
//       },
//       orange: {
//         bg: 'from-orange-500 to-orange-600',
//         hover: 'hover:border-orange-200',
//         text: 'text-orange-700'
//       }
//     };

//     const currentColor = colorClasses[color as keyof typeof colorClasses] || colorClasses.blue;

//     return (
//       <div className="relative">
//         <div 
//           className={`
//             flex items-center justify-between px-4 py-3 rounded-xl border-2 border-gray-100
//             ${currentColor.hover} transition-all duration-200 cursor-pointer
//             bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-white
//             shadow-sm hover:shadow-md
//           `}
//           onMouseEnter={() => setIsOpen(true)}
//           onMouseLeave={() => setIsOpen(false)}
//         >
//           <div className="flex items-center gap-3">
//             <div className={`
//               px-3 py-1 rounded-full text-xs font-bold text-white
//               bg-gradient-to-r ${currentColor.bg}
//             `}>
//               {count}
//             </div>
//             <span className="text-sm font-medium text-gray-700">{type}</span>
//           </div>
//           <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
//         </div>
        
//         {items.length > 0 && (
//           <div 
//             className={`
//               absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 z-20 
//               max-h-64 overflow-y-auto transition-all duration-200 transform
//               ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}
//             `}
//             onMouseEnter={() => setIsOpen(true)}
//             onMouseLeave={() => setIsOpen(false)}
//           >
//             {items.map((item: string, index: number) => (
//               <div 
//                 key={index} 
//                 className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 first:rounded-t-xl last:rounded-b-xl transition-colors duration-150"
//               >
//                 <div className="flex items-center gap-2">
//                   <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-400 to-purple-500"></div>
//                   {item}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     );
//   };

//   const filteredData = reportData.filter(
//     (row) =>
//       row.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       row.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Calculate comprehensive statistics
//   const stats = {
//     totalUsers: reportData.length,
//     totalBadges: reportData.reduce((sum, user) => sum + user.totalBadges, 0),
//     activeUsers: reportData.filter(user => user.totalBadges > 0).length,
//     avgBadgesPerUser: reportData.length > 0 
//       ? Math.round(reportData.reduce((sum, user) => sum + user.totalBadges, 0) / reportData.length * 10) / 10 
//       : 0,
//     totalSkillBadges: reportData.reduce((sum, user) => sum + user.skillBadgesCount, 0),
//     totalArcadeGames: reportData.reduce((sum, user) => sum + user.arcadeGamesCount, 0),
//     totalTriviaGames: reportData.reduce((sum, user) => sum + user.triviaGamesCount, 0),
//     totalLabFreeCourses: reportData.reduce((sum, user) => sum + user.labFreeCourseCount, 0),
//     profilesComplete: reportData.filter(user => user.profileStatus === "All Good").length,
//     accessCodesRedeemed: reportData.filter(user => user.accessCodeRedemption === "Yes").length,
//     advancedMilestones: reportData.filter(user => user.milestoneEarned === "Ultimate Milestone").length,
//     intermediateMilestones: reportData.filter(user => user.milestoneEarned === "Milestone 2").length,
//     beginnerMilestones: reportData.filter(user => user.milestoneEarned === "Milestone 1").length
//   };

//   const getRankIcon = (rank: number) => {
//     switch (rank) {
//       case 1: return <Trophy className="w-8 h-8 text-yellow-500" />;
//       case 2: return <Medal className="w-8 h-8 text-gray-400" />;
//       case 3: return <Award className="w-8 h-8 text-amber-600" />;
//       default: 
//         return (
//           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
//             {rank}
//           </div>
//         );
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     return status === "Yes" || status === "All Good" ? 
//       <CheckCircle className="w-4 h-4 text-green-500" /> : 
//       <XCircle className="w-4 h-4 text-red-500" />;
//   };

//   const getMilestoneColor = (milestone: string) => {
//     switch (milestone) {
//       case 'Advanced Milestone': return 'bg-purple-100 text-purple-700 border-purple-200';
//       case 'Intermediate Milestone': return 'bg-blue-100 text-blue-700 border-blue-200';
//       case 'Beginner Milestone': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
//       default: return 'bg-gray-100 text-gray-700 border-gray-200';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
//           <p className="text-gray-600 font-medium">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
//       {/* Modern Header */}
//       <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-40">
//         <div className="max-w-7xl mx-auto px-6 py-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
//                 Google Cloud Skills Boost
//               </h1>
//               <p className="text-lg text-gray-600 mt-1 font-medium">Cohort 2 Analytics Dashboard</p>
//               <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
//                 <Calendar className="w-4 h-4" />
//                 <span>Last updated: {new Date().toLocaleDateString('en-US', { 
//                   weekday: 'long', 
//                   year: 'numeric', 
//                   month: 'long', 
//                   day: 'numeric' 
//                 })}</span>
//               </div>
//             </div>
//             <div className="flex gap-3">
//               <button 
//                 onClick={() => setSelectedView('overview')}
//                 className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
//                   selectedView === 'overview' 
//                     ? 'bg-blue-500 text-white shadow-lg' 
//                     : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
//                 }`}
//               >
//                 <BarChart3 className="w-4 h-4" />
//                 Overview
//               </button>
//               <button 
//                 onClick={() => setSelectedView('detailed')}
//                 className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
//                   selectedView === 'detailed' 
//                     ? 'bg-blue-500 text-white shadow-lg' 
//                     : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
//                 }`}
//               >
//                 <Filter className="w-4 h-4" />
//                 Detailed View
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-8">
//         {/* Modern Statistics Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//           <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalUsers}</p>
//                 <p className="text-gray-600 font-medium">Total Participants</p>
//               </div>
//               <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
//                 <Users className="w-6 h-6 text-blue-600" />
//               </div>
//             </div>
//             <div className="mt-4 flex items-center gap-2">
//               <div className="flex-1 bg-gray-200 rounded-full h-2">
//                 <div 
//                   className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
//                   style={{ width: `${(stats.activeUsers / stats.totalUsers) * 100}%` }}
//                 ></div>
//               </div>
//               <span className="text-xs text-gray-500">{Math.round((stats.activeUsers / stats.totalUsers) * 100)}% active</span>
//             </div>
//           </div>

//           <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-3xl font-bold text-gray-900 mb-1">{stats.totalBadges}</p>
//                 <p className="text-gray-600 font-medium">Total Badges</p>
//               </div>
//               <div className="p-3 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl">
//                 <Trophy className="w-6 h-6 text-yellow-600" />
//               </div>
//             </div>
//             <div className="mt-4 text-sm text-gray-500">
//               Avg: {stats.avgBadgesPerUser} badges per user
//             </div>
//           </div>

//           <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-3xl font-bold text-gray-900 mb-1">{stats.activeUsers}</p>
//                 <p className="text-gray-600 font-medium">Active Learners</p>
//               </div>
//               <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl">
//                 <Target className="w-6 h-6 text-green-600" />
//               </div>
//             </div>
//             <div className="mt-4 text-sm text-gray-500">
//               {stats.profilesComplete} profiles complete
//             </div>
//           </div>

//           <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-3xl font-bold text-gray-900 mb-1">{stats.accessCodesRedeemed}</p>
//                 <p className="text-gray-600 font-medium">Access Codes</p>
//               </div>
//               <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl">
//                 <Star className="w-6 h-6 text-purple-600" />
//               </div>
//             </div>
//             <div className="mt-4 text-sm text-gray-500">
//               {Math.round((stats.accessCodesRedeemed / stats.totalUsers) * 100)}% redemption rate
//             </div>
//           </div>
//         </div>

//         {selectedView === 'overview' ? (
//           <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
//             {/* Enhanced Leaderboard */}
//             <div className="lg:col-span-2">
//               <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden">
//                 <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
//                   <div className="flex items-center gap-3">
//                     <Trophy className="w-6 h-6" />
//                     <h3 className="text-xl font-bold">Top Performers</h3>
//                   </div>
//                   <p className="text-blue-100 mt-1">Based on total badges earned</p>
//                 </div>
                
//                 <div className="p-6 space-y-4">
//                   {leaderboardData.slice(0, 5).map((entry) => (
//                     <div
//                       key={entry.rank}
//                       className={`
//                         p-4 rounded-xl border-2 transition-all duration-200 hover:scale-[1.02] cursor-pointer
//                         ${entry.rank === 1 ? 'border-yellow-200 bg-gradient-to-r from-yellow-50 to-amber-50 shadow-lg' :
//                           entry.rank === 2 ? 'border-gray-200 bg-gradient-to-r from-gray-50 to-slate-50 shadow-md' :
//                           entry.rank === 3 ? 'border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 shadow-md' :
//                           'border-gray-100 bg-white hover:shadow-md'
//                         }
//                       `}
//                     >
//                       <div className="flex items-center justify-between mb-3">
//                         <div className="flex items-center gap-3">
//                           {getRankIcon(entry.rank)}
//                           <div>
//                             <p className="font-semibold text-gray-900">{entry.userName}</p>
//                             <p className="text-sm text-gray-500 flex items-center gap-1">
//                               <Mail className="w-3 h-3" />
//                               {entry.userEmail}
//                             </p>
//                           </div>
//                         </div>
//                         <div className="text-right">
//                           <p className="text-2xl font-bold text-gray-900">{entry.totalBadges}</p>
//                           <p className="text-xs text-gray-500">total badges</p>
//                         </div>
//                       </div>
                      
//                       <div className="grid grid-cols-4 gap-2">
//                         <div className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-lg">
//                           <Award className="w-3 h-3 text-blue-600" />
//                           <span className="text-xs font-medium text-blue-700">{entry.skillBadges}</span>
//                         </div>
//                         <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-lg">
//                           <Gamepad2 className="w-3 h-3 text-green-600" />
//                           <span className="text-xs font-medium text-green-700">{entry.arcadeGames}</span>
//                         </div>
//                         <div className="flex items-center gap-1 bg-purple-100 px-2 py-1 rounded-lg">
//                           <Brain className="w-3 h-3 text-purple-600" />
//                           <span className="text-xs font-medium text-purple-700">{entry.triviaGames}</span>
//                         </div>
//                         <div className="flex items-center gap-1 bg-orange-100 px-2 py-1 rounded-lg">
//                           <BookOpen className="w-3 h-3 text-orange-600" />
//                           <span className="text-xs font-medium text-orange-700">{entry.labFreeCourses}</span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Enhanced Summary Cards */}
//             <div className="lg:col-span-3 space-y-6">
//               <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg p-6">
//                 <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
//                   <BarChart3 className="w-5 h-5 text-blue-600" />
//                   Progress Breakdown
//                 </h3>
//                 <div className="grid grid-cols-2 gap-6">
//                   <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-xl border border-blue-200">
//                     <div className="flex items-center justify-between mb-3">
//                       <Award className="w-8 h-8 text-blue-600" />
//                       <span className="text-2xl font-bold text-blue-700">{stats.totalSkillBadges}</span>
//                     </div>
//                     <p className="text-sm text-blue-700 font-medium mb-2">Skill Badges Earned</p>
//                     <div className="w-full bg-blue-200 rounded-full h-2">
//                       <div 
//                         className="bg-blue-500 h-2 rounded-full transition-all duration-500"
//                         style={{ width: `${(stats.totalSkillBadges / stats.totalBadges) * 100}%` }}
//                       ></div>
//                     </div>
//                     <p className="text-xs text-blue-600 mt-1">
//                       {Math.round((stats.totalSkillBadges / stats.totalBadges) * 100)}% of total badges
//                     </p>
//                   </div>
                  
//                   <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-xl border border-green-200">
//                     <div className="flex items-center justify-between mb-3">
//                       <Gamepad2 className="w-8 h-8 text-green-600" />
//                       <span className="text-2xl font-bold text-green-700">{stats.totalArcadeGames}</span>
//                     </div>
//                     <p className="text-sm text-green-700 font-medium mb-2">Arcade Games Completed</p>
//                     <div className="w-full bg-green-200 rounded-full h-2">
//                       <div 
//                         className="bg-green-500 h-2 rounded-full transition-all duration-500"
//                         style={{ width: `${(stats.totalArcadeGames / stats.totalBadges) * 100}%` }}
//                       ></div>
//                     </div>
//                     <p className="text-xs text-green-600 mt-1">
//                       {Math.round((stats.totalArcadeGames / stats.totalBadges) * 100)}% of total badges
//                     </p>
//                   </div>

//                   <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-xl border border-purple-200">
//                     <div className="flex items-center justify-between mb-3">
//                       <Brain className="w-8 h-8 text-purple-600" />
//                       <span className="text-2xl font-bold text-purple-700">{stats.totalTriviaGames}</span>
//                     </div>
//                     <p className="text-sm text-purple-700 font-medium mb-2">Trivia Games Completed</p>
//                     <div className="w-full bg-purple-200 rounded-full h-2">
//                       <div 
//                         className="bg-purple-500 h-2 rounded-full transition-all duration-500"
//                         style={{ width: `${(stats.totalTriviaGames / stats.totalBadges) * 100}%` }}
//                       ></div>
//                     </div>
//                     <p className="text-xs text-purple-600 mt-1">
//                       {Math.round((stats.totalTriviaGames / stats.totalBadges) * 100)}% of total badges
//                     </p>
//                   </div>

//                   <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-xl border border-orange-200">
//                     <div className="flex items-center justify-between mb-3">
//                       <BookOpen className="w-8 h-8 text-orange-600" />
//                       <span className="text-2xl font-bold text-orange-700">{stats.totalLabFreeCourses}</span>
//                     </div>
//                     <p className="text-sm text-orange-700 font-medium mb-2">Lab-free Courses</p>
//                     <div className="w-full bg-orange-200 rounded-full h-2">
//                       <div 
//                         className="bg-orange-500 h-2 rounded-full transition-all duration-500"
//                         style={{ width: `${(stats.totalLabFreeCourses / stats.totalBadges) * 100}%` }}
//                       ></div>
//                     </div>
//                     <p className="text-xs text-orange-600 mt-1">
//                       {Math.round((stats.totalLabFreeCourses / stats.totalBadges) * 100)}% of total badges
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg p-6">
//                 <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
//                   <Activity className="w-5 h-5 text-green-600" />
//                   Engagement & Milestones
//                 </h3>
//                 <div className="space-y-6">
//                   <div className="grid grid-cols-2 gap-6">
//                     <div className="space-y-3">
//                       <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
//                         <div className="flex items-center gap-2">
//                           <CheckCircle className="w-4 h-4 text-green-600" />
//                           <span className="text-gray-700 font-medium">Profiles Complete</span>
//                         </div>
//                         <span className="font-bold text-green-600">
//                           {stats.profilesComplete} / {stats.totalUsers}
//                         </span>
//                       </div>
//                       <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border border-blue-200">
//                         <div className="flex items-center gap-2">
//                           <Star className="w-4 h-4 text-blue-600" />
//                           <span className="text-gray-700 font-medium">Access Codes</span>
//                         </div>
//                         <span className="font-bold text-blue-600">
//                           {stats.accessCodesRedeemed} / {stats.totalUsers}
//                         </span>
//                       </div>
//                     </div>

//                     <div className="space-y-3">
//                       <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border border-purple-200">
//                         <div className="flex items-center gap-2">
//                           <Trophy className="w-4 h-4 text-purple-600" />
//                           <span className="text-gray-700 font-medium">Advanced</span>
//                         </div>
//                         <span className="font-bold text-purple-600">{stats.advancedMilestones}</span>
//                       </div>
//                       <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
//                         <div className="flex items-center gap-2">
//                           <Medal className="w-4 h-4 text-yellow-600" />
//                           <span className="text-gray-700 font-medium">Intermediate</span>
//                         </div>
//                         <span className="font-bold text-yellow-600">{stats.intermediateMilestones}</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
//                     <h4 className="font-semibold text-gray-900 mb-3">Milestone Distribution</h4>
//                     <div className="space-y-2">
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm text-gray-600">Advanced Milestones</span>
//                         <div className="flex items-center gap-2">
//                           <div className="w-32 bg-gray-200 rounded-full h-2">
//                             <div 
//                               className="bg-purple-500 h-2 rounded-full transition-all duration-500"
//                               style={{ width: `${(stats.advancedMilestones / stats.totalUsers) * 100}%` }}
//                             ></div>
//                           </div>
//                           <span className="text-sm font-medium text-gray-700 min-w-[40px]">
//                             {Math.round((stats.advancedMilestones / stats.totalUsers) * 100)}%
//                           </span>
//                         </div>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm text-gray-600">Intermediate Milestones</span>
//                         <div className="flex items-center gap-2">
//                           <div className="w-32 bg-gray-200 rounded-full h-2">
//                             <div 
//                               className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
//                               style={{ width: `${(stats.intermediateMilestones / stats.totalUsers) * 100}%` }}
//                             ></div>
//                           </div>
//                           <span className="text-sm font-medium text-gray-700 min-w-[40px]">
//                             {Math.round((stats.intermediateMilestones / stats.totalUsers) * 100)}%
//                           </span>
//                         </div>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm text-gray-600">Beginner Milestones</span>
//                         <div className="flex items-center gap-2">
//                           <div className="w-32 bg-gray-200 rounded-full h-2">
//                             <div 
//                               className="bg-green-500 h-2 rounded-full transition-all duration-500"
//                               style={{ width: `${(stats.beginnerMilestones / stats.totalUsers) * 100}%` }}
//                             ></div>
//                           </div>
//                           <span className="text-sm font-medium text-gray-700 min-w-[40px]">
//                             {Math.round((stats.beginnerMilestones / stats.totalUsers) * 100)}%
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           /* Detailed Table View */
//           <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-200/50 shadow-lg overflow-hidden">
//             <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
//               <div className="flex items-center justify-between mb-4">
//                 <h3 className="text-xl font-bold flex items-center gap-2">
//                   <Filter className="w-5 h-5" />
//                   Detailed Progress Report
//                 </h3>
//                 <div className="flex items-center gap-2 text-blue-100">
//                   <Users className="w-4 h-4" />
//                   <span className="text-sm">{filteredData.length} participants</span>
//                 </div>
//               </div>
//               <div className="relative">
//                 <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-200" />
//                 <input
//                   type="text"
//                   placeholder="Search by name or email..."
//                   className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 focus:bg-white/30 transition-all duration-200"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </div>
            
//             <div className="overflow-x-auto">
//               <div className="inline-block min-w-full align-middle">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
//                         Participant
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
//                         Profile
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
//                         Status
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
//                         Access Code
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
//                         Milestone
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
//                         Total Badges
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider min-w-[200px]">
//                         Skill Badges
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider min-w-[200px]">
//                         Arcade Games
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider min-w-[200px]">
//                         Trivia Games
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider min-w-[220px]">
//                         Lab-free Courses
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {filteredData.map((user) => (
//                       <tr key={user.id} className="hover:bg-blue-50 transition-colors duration-150">
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center gap-3">
//                             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
//                               {user.userName.charAt(0).toUpperCase()}
//                             </div>
//                             <div className="min-w-0">
//                               <p className="font-semibold text-gray-900 truncate">{user.userName}</p>
//                               <p className="text-sm text-gray-500 flex items-center gap-1 truncate">
//                                 <Mail className="w-3 h-3 flex-shrink-0" />
//                                 <span className="truncate">{user.userEmail}</span>
//                               </p>
//                             </div>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <a 
//                             href={user.profileUrl} 
//                             target="_blank" 
//                             rel="noopener noreferrer"
//                             className="inline-flex items-center gap-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors duration-150 text-sm font-medium"
//                           >
//                             <ExternalLink className="w-4 h-4" />
//                             View Profile
//                           </a>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className={`
//                             inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium
//                             ${user.profileStatus === 'All Good' 
//                               ? 'bg-green-100 text-green-700 border border-green-200' 
//                               : 'bg-red-100 text-red-700 border border-red-200'
//                             }
//                           `}>
//                             {getStatusIcon(user.profileStatus)}
//                             <span className="truncate">{user.profileStatus}</span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className={`
//                             inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium
//                             ${user.accessCodeRedemption === 'Yes' 
//                               ? 'bg-green-100 text-green-700 border border-green-200' 
//                               : 'bg-red-100 text-red-700 border border-red-200'
//                             }
//                           `}>
//                             {getStatusIcon(user.accessCodeRedemption)}
//                             <span className="truncate">{user.accessCodeRedemption}</span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className={`
//                             px-3 py-2 rounded-full text-sm font-medium text-center border
//                             ${getMilestoneColor(user.milestoneEarned)}
//                           `}>
//                             <span className="truncate">{user.milestoneEarned}</span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <div className="flex items-center gap-2">
//                             <div className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold text-lg">
//                               {user.totalBadges}
//                             </div>
//                             <Trophy className="w-5 h-5 text-yellow-500 flex-shrink-0" />
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="w-48">
//                             <StyledDropdown
//                               items={user.skillBadgeNames}
//                               count={user.skillBadgesCount}
//                               type="Skills"
//                               color="blue"
//                             />
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="w-48">
//                             <StyledDropdown
//                               items={user.arcadeGameNames}
//                               count={user.arcadeGamesCount}
//                               type="Games"
//                               color="green"
//                             />
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="w-48">
//                             <StyledDropdown
//                               items={user.triviaGameNames}
//                               count={user.triviaGamesCount}
//                               type="Trivia"
//                               color="purple"
//                             />
//                           </div>
//                         </td>
//                         <td className="px-6 py-4">
//                           <div className="w-52">
//                             <StyledDropdown
//                               items={user.labFreeCourseNames}
//                               count={user.labFreeCourseCount}
//                               type="Courses"
//                               color="orange"
//                             />
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
            
//             {filteredData.length === 0 && (
//               <div className="text-center py-16">
//                 <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
//                   <Search className="w-10 h-10 text-gray-400" />
//                 </div>
//                 <p className="text-gray-500 text-xl font-medium">No participants found</p>
//                 <p className="text-gray-400 text-sm mt-2">Try adjusting your search terms or check the data.</p>
//               </div>
//             )}
            
//             {filteredData.length > 0 && (
//               <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
//                 <div className="flex items-center justify-between text-sm text-gray-600">
//                   <p>
//                     Showing <span className="font-medium text-gray-900">{filteredData.length}</span> of{' '}
//                     <span className="font-medium text-gray-900">{reportData.length}</span> participants
//                   </p>
//                   <div className="flex items-center gap-4">
//                     <p>Total badges: <span className="font-bold text-blue-600">{stats.totalBadges}</span></p>
//                     <p>Average: <span className="font-bold text-green-600">{stats.avgBadgesPerUser}</span></p>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DailyReportPage;