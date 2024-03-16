"use client";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function LogoutForm() {
  const router = useRouter();
  const handleCancel = () => {
    router.push("/");
  };

  return (
    <main>
      <Card className="mx-auto flex w-1/4 flex-col items-center">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Logout</CardTitle>
          <CardDescription>Are you sure you want to log out?</CardDescription>
        </CardHeader>
        <CardFooter>
          <div className="grid grid-cols-2 gap-4">
            <Button
              className="rounded-3xl bg-[#E62534] hover:bg-[#E62534]/90"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              className="rounded-3xl bg-[#F59F0F] hover:bg-[#F59F0F]/90"
              onClick={() => signOut()}
            >
              Yes, sing out
            </Button>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}
