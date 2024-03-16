"use client";

import { Loader } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";

export default function DeleteForm() {
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();
  const deleteAccount = api.func.deleteAccount.useMutation({
    onSuccess: async () => {
      toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">Your account has been deleted.</code>
          </pre>
        ),
      });

      await signOut();
      router.push("/");
      router.refresh();
    },
  });

  function onClickDelete() {
    setShowConfirm(true);
  }

  function onClickCancel() {
    setShowConfirm(false);
  }

  function onClickYes() {
    const res = deleteAccount.mutate();
    console.log(res);
    setShowConfirm(false);
  }

  return (
    <div className="space-y-2">
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Delete account
      </h4>
      <Button
        type="submit"
        className="rounded-3xl bg-[#E62534] hover:bg-[#E62534]/90"
        disabled={deleteAccount.isLoading}
        onClick={onClickDelete}
      >
        {deleteAccount.isLoading ? (
          <Loader className="animate-spin" />
        ) : (
          "Delete"
        )}
      </Button>
      {showConfirm && (
        <div className="space-y-1">
          <p className="text-sm">
            All your Bumperpass data will be delete. Are you sure?
          </p>
          <div className="space-x-2">
            <Button
              onClick={onClickCancel}
              disabled={deleteAccount.isLoading}
              className="rounded-3xl bg-[#E62534] hover:bg-[#E62534]/90"
            >
              {deleteAccount.isLoading ? (
                <Loader className="animate-spin" />
              ) : (
                "Cancel"
              )}
            </Button>
            <Button
              onClick={onClickYes}
              disabled={deleteAccount.isLoading}
              className="rounded-3xl bg-[#F59F0F] hover:bg-[#F59F0F]/90"
            >
              {deleteAccount.isLoading ? (
                <Loader className="animate-spin" />
              ) : (
                "Yes"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
