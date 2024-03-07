"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { set, z } from "zod";
import { Loader } from "lucide-react";

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
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

const FormSchema = z
  .object({
    email: z.string({ required_error: "Please type a valid email." }).email(),
    password: z
      .string()
      .refine(
        (value) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[^\s]{8,}$/.test(
            value,
          ),
        {
          message:
            "Password must have 8 characters, one mayus, one symbol and one number.",
        },
      ),
    firstName: z.string().min(2, { message: "Type at least 2 characters." }),
    state: z.string({ required_error: "Please select a valid option." }),
    unitNumber: z.string().optional(),
    vin: z
      .string({ required_error: "Must be just numbers." })
      .min(3, { message: "Type just 3 numbers." })
      .max(3, { message: "Type just 3 numbers." }),
    phone: z.string().optional(),
    confirmPassword: z.string(),
    middleName: z.string().optional(),
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
    lastName: z.string().min(2, { message: "Type at least 2 characters." }),
    numberNameStreet: z
      .string()
      .min(2, { message: "Type at least 2 characters." }),
    terms: z.boolean({
      required_error: "Please accept the terms and conditions.",
    }),
    suscribe: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  });

export default function SignUp() {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
    setLoading(false);
  }

  return (
    <Form {...form}>
      <div className="space-y-6">
        <div>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Create and account and
          </h3>
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            start enjoying our services!
          </h3>
        </div>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {" "}
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Create password*</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name*</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>State*</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
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
              name="unitNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apartment/Unit Number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>3 Last digits of VIN*</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                    <Input {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password*</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="middleName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Middle Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
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
                  <FormLabel>City*</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Zip Code*</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                  <FormLabel>Current Plate*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numberNameStreet"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number & Name Street*</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="terms"
              render={({ field }) => (
                <FormItem>
                  <div className="flex space-x-1 items-center">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal underline decoration-1 underline-offset-4 decoration-foreground">Accept terms and conditions</FormLabel>
                    <FormDescription></FormDescription>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="suscribe"
              render={({ field }) => (
                <FormItem>
                  <div className="flex space-x-1 items-center">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">Suscribe newsletter</FormLabel>
                    <FormDescription></FormDescription>
                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="self-end rounded-3xl bg-[#E62534] hover:bg-[#E62534]/90"
          >
            {loading ? <Loader className="animate-spin" /> : "Register"}
          </Button>
        </form>
      </div>
    </Form>
  );
}
