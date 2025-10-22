import { redirect } from "next/navigation";

export default function SkillBadgesPage() {
  // Redirect to home — skill badges have been removed.
  redirect("/");
}
