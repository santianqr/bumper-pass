"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/trpc/react";

const FormSchema = z.object({
  email: z.string({ required_error: "Please type a valid email." }).email(),
  name: z.string().min(2, { message: "Type at least 2 characters." }),
  state: z.string({ required_error: "Please select a valid option." }),
  phone: z.string().optional(),
  city: z.string().min(2, { message: "Type at least 2 characters." }),
  zipCode: z
    .string()
    .refine((value) => /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(value), {
      message: "Must be a valid zip code on USA.",
    }),
  currentPlate: z
    .string()
    .min(2, { message: "Type at least 2 characters." })
    .max(7, { message: "Type at most 7 characters." }),
  street: z.string().min(2, { message: "Type at least 2 characters." }),
});

type Props = {
  name: string | null;
  email: string | null;
  phone: string | null;
  state: string | null;
  city: string | null;
  street: string | null;
  zipCode: string | null;
  currentPlate: string | null;
};

export function AccountForm({ accountData }: { accountData: Props }) {
  console.log(accountData);
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: accountData.name ?? "",
      email: accountData.email ?? "",
      city: accountData.city ?? "",
      street: accountData.street ?? "",
      zipCode: accountData.zipCode ?? "",
      currentPlate: accountData.currentPlate ?? "",
      state: accountData.state ?? "",
      phone: accountData.phone ?? "",
    },
  });
  const updateUser = api.func.updateAccount.useMutation({
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
    const res = updateUser.mutate(data);
    console.log(res);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder={accountData.name ?? ""} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  disabled
                  placeholder={accountData.email ?? ""}
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input {...field} placeholder={accountData.phone ?? ""} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ca">CA</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input {...field} placeholder={accountData.city ?? ""} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Number & Name Street</FormLabel>
              <FormControl>
                <Input {...field} placeholder={accountData.street ?? ""} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Zip Code</FormLabel>
              <FormControl>
                <Input {...field} placeholder={accountData.zipCode ?? ""} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="currentPlate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Plate</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={accountData.currentPlate ?? ""}
                />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="self-end rounded-3xl bg-[#E62534] hover:bg-[#E62534]/90"
          disabled={updateUser.isLoading}
        >
          {updateUser.isLoading ? "Loading..." : "Save"}
        </Button>
      </form>
    </Form>
  );
}
