import { useRef } from "react";
import { cn } from "@/lib/utils";
import Editor from "@/components/ui/editor/editor";
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
import { useToast } from "@/components/ui/use-toast";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useLoaderData, useSubmit } from "react-router-dom";
import { Trash2, FileText } from "lucide-react";
import BreadCrumb from "@/components/breadcrumb";

const MAX_FILE_SIZE = 2621440;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/pdf",
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
  final_approver_id: z.string({
    required_error: "Please select a final approver.",
  }),

  files: z
    .any()

});
type EmemoFormValues = z.infer<typeof formSchema>;

const breadcrumbItems = [{ title: "New", link: "/dashboard/profile" }];

export default function Submit() {

  const inputRef = useRef(null);
  const data = useLoaderData();
  const submit = useSubmit();
  const { toast } = useToast();

  const users = data;

  const defaultValues: Partial<EmemoFormValues> = {
    title: "",
    content: "",
    approver_id: undefined,
    reviewer_id: undefined,
    final_approver_id: undefined,
    // files: new File([], "")
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const fileNames = form.watch("files", null);
  const name: string[] = [];
  if (fileNames) {
    for (let i = 0; i < fileNames.length; i++) {
      name.push(fileNames[i].name);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const data = new FormData();
    // data.append("title", values.title);
    // data.append("content", values.content);
    // data.append("reviewer_id", values.reviewer_id);
    // data.append("approver_id", values.approver_id);
    Object.entries(values).forEach(([key, value]) => {
      data.append(key, value);
    });

    if (values.files) {
      console.log(values.files);
      if (values.files.length  > 5) {
        return form.setError("files", {
          type: "manual",
          message: `files upload allow 5 including uploaded files.`,
        });
      }

      for (let i = 0; i < values.files.length; i++) {
        data.append("files", values.files[i]);

        if (values.files[i].size > MAX_FILE_SIZE) {
          return form.setError("files", {
            type: "manual",
            message: `${values.files[i].name} is over limit`,
          });
        }

        if (!ACCEPTED_IMAGE_TYPES.includes(values.files[i].type)) {
          return form.setError("files", {
            type: "manual",
            message: `wrong file type`,
          });
        }
      }
    }




     // @ts-expect-error ignore //
    inputRef.current!.value = null;
    toast({
      title: "Saving",
      description: "we are updating and saving information",
    });


    // you must add encType: "multipart/form-data" for file upload to work
    submit(data, { method: "post", encType: "multipart/form-data" });
  }
  return (
<>
    <BreadCrumb items={breadcrumbItems} />
    <h2 className="text-3xl font-bold tracking-tight">

New Memo
</h2>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder='title' {...field} />
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
                <Editor content={''} onChange={field.onChange} editable={true}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="py-4 space-y-6">
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
                          // @ts-expect-error is ok
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
                               {/*// @ts-expect-error is ok */}
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
                               // @ts-expect-error is ok
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
                               {/*// @ts-expect-error is ok */}
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
          name='final_approver_id'
          render={({ field }) => (
            <FormItem className='flex flex-col'>
              <FormLabel>Final Approver</FormLabel>
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
                               // @ts-expect-error is ok
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
                               {/*// @ts-expect-error is ok */}
                      {users.map((user) => (
                        <CommandItem
                          value={user.label}
                          key={user.value}
                          onSelect={() => {
                            form.setValue("final_approver_id", user.value);
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
        </div>
        <FormField
          control={form.control}
          name='files'
          render={({ field }) => (
            <div className='grid w-full max-w-sm items-center gap-1.5'>
              <FormItem>
                <FormLabel>File</FormLabel>
                <FormControl>
                  <Input
                    ref={inputRef}
                    // accept=".jpg, .jpeg, .png, .svg, .gif, .mp4"
                    type='file'
                    multiple
                    onChange={(e) => {
                      field.onChange(e.target.files ? e.target.files : null);
                      // form.clearErrors("files")
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              {name.length > 0 &&
                name.map((file, id) => (
                  <div
                    key={id}
                    className='mb-2 mt-2 grid grid-cols-[25px_1fr] items-start'
                  >
                    <FileText className='w-5 h-5' />
                    <div className='space-y-1'>
                      <p className='text-sm font-medium leading-none'>{file}</p>
                    </div>
                  </div>
                ))}

              {form.watch().files ? (
                <Button
                  type='button'
                  variant='outline'
                  size='icon'
                  onClick={() => {
                    form.reset({
                      files: null,
                    });
                             {/*// @ts-expect-error is ok */}
                    inputRef.current!.value = null;
                  }}
                >
                  {" "}
                  <Trash2 className='w-4 h-4' />
                </Button>
              ) : (
                ""
              )}
            </div>
          )}
        />

        <Button type='submit' className='mt-4'>
          Submit
        </Button>
      </form>
    </Form>

    </>
  );
}
