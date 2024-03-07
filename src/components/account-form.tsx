import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input"

const FormSchema = z.object({
    username: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
  })
  

export default function AccountForm() {
  return (
    <div>AccountForm</div>
  )
}
