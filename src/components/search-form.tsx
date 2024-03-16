"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { HandIcon, HeartIcon, StarIcon, PlusIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
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
import { useState } from "react";
import { SearchAvailable } from "@/components/search-available";
import { SearchNotAvailable } from "@/components/search-not-available";

const emojis = ["🖐", "❤", "⭐", "➕"];

function countSymbols(s: string) {
  return [...s].length;
}

const FormSchema = z.object({
  vehicleType: z
    .string({
      required_error: "Please select a valid option.",
    })
    .refine((value) => value === "AUTO" || value === "MOTO", {
      message: "Vehicle type must be either 'auto' or 'motorcycle'.",
    }),

  state: z.string({ required_error: "Please select a valid option." }),

  personalizedPlate: z
    .string()
    .refine((value) => countSymbols(value) >= 2, {
      message: "Plates must be at least 2 characters.",
    })
    .refine((value) => countSymbols(value) <= 7, {
      message: "Plates must be at most 7 characters.",
    })
    .refine((value) => !value.includes("0"), {
      message: "The plate cannot contain the number 0.",
    })
    .refine(
      (value) => emojis.filter((emoji) => value.includes(emoji)).length <= 1,
      {
        message: "The plate cannot contain more than one emoji.",
      },
    )
    .refine((value) => !value.includes("//"), {
      message: "The plate cannot contain consecutive half spaces.",
    })
    .refine((value) => /^[a-zA-Z1-9🖐❤⭐➕/ ]*$/.test(value), {
      message:
        "The plate can only contain letters from the American alphabet, numbers from 1 to 9, one of the four emojis, spaces or half spaces.",
    }),
});

type ResponseData = {
  message: string;
  status: number;
};

export function SearchForm() {
  const [searchResponse, setSearchResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);

    const res = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const resSearch = (await res.json()) as ResponseData;
    setSearchResponse(resSearch.message);

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
    setIsLoading(false);
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      personalizedPlate: "",
      state: "CA",
      vehicleType: "AUTO",
    },
  });

  function onClear() {
    form.reset({
      personalizedPlate: "",
      state: "",
      vehicleType: "",
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="vehicleType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What kind of vehicle do you have?</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="CA">CA</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="personalizedPlate"
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

              <FormDescription className="flex items-center space-x-2">
                <span>Insert symbol</span>
                <HandIcon
                  onClick={() => field.onChange(field.value + "🖐")}
                  className="cursor-pointer"
                />
                <HeartIcon
                  onClick={() => field.onChange(field.value + "❤")}
                  className="cursor-pointer"
                />
                <StarIcon
                  onClick={() => field.onChange(field.value + "⭐")}
                  className="cursor-pointer"
                />
                <PlusIcon
                  onClick={() => field.onChange(field.value + "➕")}
                  className="cursor-pointer"
                />
              </FormDescription>
              <FormDescription>
                <span className={cn("text-[0.8rem] text-muted-foreground")}>
                  *Only certian specific types of plates allow including symbols
                </span>
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-center space-x-8">
          <Button type="submit" className="rounded-3xl" disabled={isLoading}>
            {isLoading ? <Loader className="animate-spin" /> : "Search"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="rounded-3xl"
            onClick={onClear}
          >
            Clear
          </Button>
        </div>
      </form>
      {searchResponse && (
        <div>
          {searchResponse === "OK" ? (
            <SearchAvailable />
          ) : (
            <SearchNotAvailable />
          )}
          
        </div>
      )}
    </Form>
  );
}
