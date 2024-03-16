"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
  FormControl,
} from "@/components/ui/form";
import Link from "next/link";
import { api } from "@/trpc/react";
import { toast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  email: z.string().email(),
});

export default function ForgotPassword() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { email: "" },
  });

  const forgotPassword = api.func.forgotPassword.useMutation({
    onSuccess: (data) => {
      toast({
        title: "You submitted the following values:",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">{JSON.stringify(data, null, 2)}</code>
          </pre>
        ),
      });
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const res = forgotPassword.mutate(data);
    console.log(res);
  }

  return (
    <main>
      <Card className="mx-auto max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Forgot password</CardTitle>
          <CardDescription>
            Enter your email below to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="self-end rounded-3xl bg-[#E62534] hover:bg-[#E62534]/90"
                disabled={forgotPassword.isLoading}
              >
                {forgotPassword.isLoading ? (
                  <Loader className="animate-spin" />
                ) : (
                  "Submit"
                )}
              </Button>
              <Link className="underline" href="/login">
                Back to login
              </Link>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
