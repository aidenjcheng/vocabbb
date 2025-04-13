import WritingChallenge from "@/components/writing-challenge";
import { getUser } from "@/queries/user";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getUser();
  if (!user) {
    redirect("/login");
  }
  return (
    <div className="max-w-3xl mx-auto">
      <WritingChallenge uuid={user.id} />
    </div>
  );
}
