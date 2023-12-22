import { Tiptap } from "@/components/Tiptap";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useLoaderData, useSubmit } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const MAX_FILE_SIZE = 100000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  content: z.string().min(2, {
    message: "Content must be at least 2 characters.",
  }),
  reviewer_id: z.string({
    required_error: "Please select a reviewer.",
  }),
  approver_id: z.string({
    required_error: "Please select a approver.",
  }),

  files: z
    .any()
    .refine(
      (files) => files?.length >= 1 || files?.length <= 5,
      "Image is required."
    )
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      ".jpg, .jpeg, .png and .webp files are accepted."
    ),

  // file: z
  //   .instanceof(File,{message:"Please add file"})
  //   .refine((files) => files.size <= MAX_FILE_SIZE, `Max file size is 1MB.`)
  //   .refine(
  //     (files) => ACCEPTED_IMAGE_TYPES.includes(files?.type),
  //     ".jpg, .jpeg, .png and .webp files are accepted."
  //   ).optional()
});
type EmemoFormValues = z.infer<typeof formSchema>;

export default function Submit() {
  const data = useLoaderData();
  const submit = useSubmit();
  const users = data;

  const defaultValues: Partial<EmemoFormValues> = {
    title: "",
    content: "",
    approver_id: undefined,
    reviewer_id: undefined,
    // file: new File([], ""),
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values.files);
    const data = new FormData();
    // data.append("file", values.file);
    // data.append("title", values.title);
    // data.append("content", values.content);
    // data.append("reviewer_id", values.reviewer_id);
    // data.append("approver_id", values.approver_id);

    Object.entries(values).forEach(([key, value]) => {
      data.append(key, value);
    });

    Object.entries(values.files).forEach(([key, value]) => {
      data.append("files", value);
    });


    // data.append("file", values.file[0]);
    // data.append("files", values.file[0]);
    // data.append("files", values.file[1]);
    // submit(data,{method:'post'})

    const reponse = await fetch(`/api/v1/ememo/create`, {
      method: "POST",
      credentials: "same-origin",
      headers: {
        "X-CSRFToken": cookies.get("csrftoken"),
      },
      body: data,
    });
    if (!reponse.ok) {
      console.log("something wrong");
    }
  }
  return (
    <div>
      <h3>Please submit contnet</h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder='shadcn' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='content'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Tiptap content={field.name} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='reviewer_id'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Reviewer</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        role='combobox'
                        className={cn(
                          "w-[200px] justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? users.find((user) => user.value === field.value)
                              ?.label
                          : "Select User"}
                        <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-[200px] p-0'>
                    <Command>
                      <CommandInput placeholder='Search language...' />
                      <CommandEmpty>No User found.</CommandEmpty>
                      <CommandGroup>
                        {users.map((user) => (
                          <CommandItem
                            value={user.label}
                            key={user.value}
                            onSelect={() => {
                              form.setValue("reviewer_id", user.value);
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                "mr-2 h-4 w-4",
                                user.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {user.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='approver_id'
            render={({ field }) => (
              <FormItem className='flex flex-col'>
                <FormLabel>Approver</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant='outline'
                        role='combobox'
                        className={cn(
                          "w-[200px] justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? users.find((user) => user.value === field.value)
                              ?.label
                          : "Select user"}
                        <CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className='w-[200px] p-0'>
                    <Command>
                      <CommandInput placeholder='Search language...' />
                      <CommandEmpty>No User found.</CommandEmpty>
                      <CommandGroup>
                        {users.map((user) => (
                          <CommandItem
                            value={user.label}
                            key={user.value}
                            onSelect={() => {
                              form.setValue("approver_id", user.value);
                            }}
                          >
                            <CheckIcon
                              className={cn(
                                "mr-2 h-4 w-4",
                                user.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {user.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='files'
            render={({ field }) => (
              <div className='grid w-full max-w-sm items-center gap-1.5'>
                <FormItem>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <Input
                      // accept=".jpg, .jpeg, .png, .svg, .gif, .mp4"
                      type='file'
                      multiple
                      onChange={(e) =>
                        field.onChange(e.target.files ? e.target.files : null)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
            )}
          />

          <Button type='submit'>Submit</Button>
        </form>
      </Form>
    </div>
  );
}
