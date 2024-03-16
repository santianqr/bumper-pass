import { CircleUser, ChevronDown } from "lucide-react";
import { getServerAuthSession } from "@/server/auth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
//import { useSession } from "next-auth/react";

export async function HeaderAvatar() {
  const session = await getServerAuthSession();
  console.log(session);

  const userInitial = session?.user.name ? session.user.name[0] : null;

  return session ? (
    <Avatar className="block h-[2rem] w-[2rem]">
      <AvatarFallback className="text-foreground">{userInitial}</AvatarFallback>
    </Avatar>
  ) : (
    <div className="flex items-center text-primary">
      <CircleUser />
      <ChevronDown size={12} />
    </div>
  );
}
