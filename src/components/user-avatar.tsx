import { CircleUser, ChevronDown } from "lucide-react";
import { getServerAuthSession } from "@/server/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function UserAvatar() {
  const session = await getServerAuthSession();
  return (
    <div>
      {session ? (
        <Avatar className="ml-2 hidden h-[2rem] w-[2rem] sm:block">
          <AvatarImage src="https://github.com/santianqr.png" alt="@shadcn" />
          <AvatarFallback>SQ</AvatarFallback>
        </Avatar>
      ) : (
        <div className="flex items-center">
          <CircleUser />
          <ChevronDown size={12} />
        </div>
      )}
    </div>
  );
}
