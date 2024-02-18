"use client";

//import Link from "next/link";
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

const FormSchema = z.object({
  vehicleType: z
    .string({
      required_error: "Please select a valid option.",
    })
    .refine((value) => value === "AUTO" || value === "MOTO", {
      message: "Vehicle type must be either 'auto' or 'motorcycle'.",
    }),

  plate: z
    .string()
    .min(3, {
      message: "Plates must be at least 3 characters.",
    })
    .max(7, {
      message: "Plates must be at most 7 characters.",
    }),
});

export default function SearchSection() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <section>
      <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0">
        Search Now!
      </h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="vehicleType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What kind of vehicle do you have?</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="AUTO">Auto</SelectItem>
                    <SelectItem value="MOTO">Motorcycle</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="plate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What is the plate of your dreams?</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Please type your plate"
                    {...field}
                    onChange={(e) => {
                      e.target.value = e.target.value.toUpperCase();
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </section>
  );
}
