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
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  newsletter: z.boolean().default(true).optional(),
});

export default function NotificactionsForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      newsletter: true,
    },
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <div className="space-y-2">
          <h4 className="text-lg font-medium">Notifications</h4>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="newsletter"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-2 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel></FormLabel>
                    <FormDescription>
                      Receive newsletters, promotions and news from Bumperpass
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <p className="text-xs text-muted-foreground">
              Bumperpass will process your data to send information about our
              products, services, promotions, surveys and giveaways based on our
              legitimate interest, as well as news about artist you follow if
              you have given your consent to do so. Your data will not be
              communicated to third parties.
            </p>
          </div>
        </div>
        <Button
          type="submit"
          className="rounded-3xl bg-[#F59F0F] hover:bg-[#F59F0F]/90"
        >
          Submit
        </Button>
      </form>
    </Form>
  );
}
