"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
//import { cn } from "@/lib/utils";
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const FormSchema = z.object({
  plateLength: z.string({
    required_error: "Please select a valid option.",
  }),
  plateType: z.string({
    required_error: "Please select a valid option.",
  }),
  spaces: z.boolean().default(false),
  symbols: z.boolean().default(false),
  description: z
    .string()
    .min(20, {
      message: "Type at least 20 characters.",
    })
    .max(180, { message: "Type at most 180 characters." }),
});

type ResponseVg = {
  validPlates: string[];
  allPlates: string[];
};


type VGFormProps = {
  setResult: (result: ResponseVg) => void;
  setForm: (data: {
    plateLength: string;
    plateType: string;
    spaces: boolean;
    symbols: boolean;
    description: string;
  }) => void;
};



export default function VGForm({ setResult, setForm }: VGFormProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      spaces: false,
      symbols: false,
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    console.log(data);
    const response: Response = await fetch("/api/vg-main", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const responseData = (await response.json()) as ResponseVg;
    console.log(responseData.validPlates);
    setResult(responseData);
    setForm(data);
    setLoading(false);

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md p-4">
          <code className="text-black">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col items-stretch space-y-1 max-w-screen-sm"
      >
        <FormField
          control={form.control}
          name="plateLength"
          render={({ field }) => (
            <FormItem>
              <FormLabel></FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the number of characters" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="7">7</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="plateType"
          render={({ field }) => (
            <FormItem>
              <FormLabel></FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the type of characters" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="letters">Letters</SelectItem>
                  <SelectItem value="numbers">Numbers</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="spaces"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Include spaces?</FormLabel>
                <FormDescription>
                  You can include spaces/half space on your generations.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="symbols"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Include symbols?</FormLabel>
                <FormDescription>
                  You can include default DMV symbols allowed on your
                  generations.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel></FormLabel>
              <FormControl>
                <Textarea placeholder="Insert your type" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="self-end rounded-3xl bg-[#E62534] hover:bg-[#E62534]/90"
        >
          {loading ? <Loader className="animate-spin" /> : "Generate"}
        </Button>
      </form>
    </Form>
  );
}
