import { redirect } from "next/navigation";

export default function LoginRedirectPage() {
  // Server-side redirect to the admin login route
  redirect("/admin/login");
}
