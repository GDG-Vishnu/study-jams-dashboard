import { redirect } from "next/navigation";

export default function UpdateIndexPage() {
  // Redirect to the admin update leaderboard page
  redirect("/admin/updateLB");
}
