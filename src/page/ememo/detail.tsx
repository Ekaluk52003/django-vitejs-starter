import { Tiptap } from "@/components/Tiptap";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import Step from "@/components/step";
import { useState } from "react";
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
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Loader2, CalendarClock, Contact } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import dayjs from "dayjs";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  useLoaderData,
  useSubmit,
  useFetcher,
  useNavigation,
  useRouteLoaderData,

} from "react-router-dom";
import {
  Trash2,
  FileText,
  ArrowBigRightDash,
  ArrowBigLeftDash,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const MAX_FILE_SIZE = 2621440;
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

  files: z.any(),
});

type EmemoFormValues = z.infer<typeof formSchema>;

export default function Detail() {

  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const inputRef = useRef(null);
  const data = useLoaderData();
  const fetcher = useFetcher();
  const submit = useSubmit();
  const { toast } = useToast();
  const navigation = useNavigation();
  const busy = navigation.state === "submitting";
  // @ts-expect-error ignore //
  const users = data.user;
  // @ts-expect-error ignore //
  const ememo = data.ememo;
  // @ts-expect-error ignore //
  const medias = data.medias;
  // @ts-expect-error ignore //
  const logs = data.logs;
  const AuthUser = useRouteLoaderData("authloader");
console.log("ASDASD", AuthUser)
  const AssignToUserId = ememo.assignnee ? ememo.assignnee.id : "No Assignee";
  const AssignToUserFullname = ememo.assignnee ? ememo.assignnee.fullname : "No Assignee";
  // @ts-expect-error ignore //
  const Authorize = AuthUser.id ==  AssignToUserId;
  const CanReject =  Authorize && ememo.step != "Drafted"

  const defaultValues: Partial<EmemoFormValues> = {
    title: ememo.title,
    content: ememo.content,
    approver_id: ememo.approver.id.toString(),
    reviewer_id: ememo.reviewer.id.toString(),

    // files: new File([], "")
  };

  const createdAt = dayjs(ememo.created_at).format("dddd, MMMM D, YYYY, HH:mm");
  const updatedAt = dayjs(ememo.updated_at).format("dddd, MMMM D, YYYY, HH:mm");

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
    Object.entries(values).forEach(([key, value]) => {
      data.append(key, value);
    });

    if (values.files) {
      console.log(values.files);
      if (values.files.length + medias.length > 5) {
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

    toast({
      title: "Saving",
      description: "we are updating and saving information",
    });

    submit(data, {
      method: "PUT",
      encType: "multipart/form-data",
    });
    // @ts-expect-error ignore //
    inputRef.current!.value = null;
  }
  console.log("adasdasdasddsadsdaasdasdasdasdasd")
  return (
    <div>

      <h2 className='text-3xl font-bold tracking-tight'>
        Ememo {ememo.number}👋
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='mb-6'>
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
          </div>
          <FormField
            control={form.control}
            name='content'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Tiptap content={ememo.content} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <div>
              {" "}
              <Card className='w-full rounded-sm my-4'>
                <CardHeader>
                  <CardTitle>Step</CardTitle>
                  <div>Created by author: {ememo.author.fullname}</div>
                  Assign to : {AssignToUserFullname}
                  <div className='text-sm font-medium leading-none mt-4'>
                    <Step step={ememo.step} />
                  </div>
                  <CardTitle>User Details</CardTitle>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name='reviewer_id'
                      render={({ field }) => (
                        <FormItem className='flex flex-col my-6'>
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
                                    ? users.find(
                                        // @ts-expect-error ignore //
                                        (user) => user.value === field.value
                                      )?.label
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
                                        form.setValue(
                                          "reviewer_id",
                                          user.value
                                        );
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
                        <FormItem className='flex flex-col my-6'>
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
                                    ? users.find(
                                        // @ts-expect-error is ok
                                        (user) => user.value === field.value
                                      )?.label
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
                                        form.setValue(
                                          "approver_id",
                                          user.value
                                        );
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
                  </CardContent>
                </CardHeader>
              </Card>
            </div>
            <div>
              {" "}
              <Card className='w-full rounded-sm'>
                <CardHeader>
                  <CardTitle>Files</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name='files'
                    render={({ field }) => (
                      <div className='grid w-full max-w-sm items-center'>
                        <FormItem>
                          <FormLabel>Files</FormLabel>
                          <FormControl>
                            <Input
                              ref={inputRef}
                              // accept=".jpg, .jpeg, .png, .svg, .gif, .mp4"
                              type='file'
                              multiple
                              onChange={(e) => {
                                field.onChange(
                                  e.target.files ? e.target.files : null
                                );
                                // form.clearErrors("files")
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            **Maximum Files Upload 5 files
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      </div>
                    )}
                  />
                  <div className='text-sm font-medium leading-none mt-4'>
                    Uploaded Files
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    Below are the files uploaded
                  </p>
                  {medias.length > 0 &&
                    // @ts-expect-error is ok
                    medias.map((media, id) => (
                      <div key={id} className='mb-2 mt-2'>
                        <div className='space-y-1 flex items-center'>
                          <FileText className='w-5 h-5' />
                          <a
                            href={media.file_url}
                            className='text-sm font-medium leading-none'
                          >
                            {media.file_url}
                          </a>

                          <button
                            type='submit'
                            onClick={() => {
                              fetcher.submit(null, {
                                method: "DELETE",
                                action: `/remove-file/${media.id}`,
                              });
                            }}
                          >
                            <Trash2 className='w-5 h-5' />
                          </button>
                        </div>
                      </div>
                    ))}
                  <div className='text-sm font-medium leading-none mt-4 border-t max-w-sm pt-6'>
                    Pending Uploaded
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    Below are the files pedning upload
                  </p>
                  {name.length > 0 &&
                    name.map((file, id) => (
                      <div
                        key={id}
                        className='space-y-1 flex items-center mt-2'
                      >
                        <FileText className='w-5 h-5' />
                        <div className='space-y-1 flex items-center'>
                          <p className='text-sm font-medium leading-none'>
                            {file}
                          </p>
                        </div>
                      </div>
                    ))}
                  {form.watch().files ? (
                    <div>
                      <Button
                        className='mt-4'
                        type='button'
                        variant='outline'
                        onClick={() => {
                          form.reset({
                            files: null,
                          });
                          {
                             /*// @ts-expect-error is ok */
                          }
                          inputRef.current!. value = null;
                        }}
                      >
                        Remove files
                      </Button>
                    </div>
                  ) : (
                    ""
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
          <div className='mt-4'>
            <Card className='w-full'>
              <CardHeader>
                <CardTitle>Time</CardTitle>
                <div className='text-sm font-medium leading-none mt-4'>
                  Created at :
                  <span className='text-sm text-muted-foreground'>
                    {createdAt}
                  </span>
                </div>
                <div className='text-sm font-medium leading-none mt-4'>
                  Updated at :
                  <span className='text-sm text-muted-foreground'>
                    {updatedAt}
                  </span>
                </div>
              </CardHeader>
              <CardContent></CardContent>
            </Card>
          </div>
          <div className='mt-4'>
            <Card className='w-full'>
              <CardHeader>
                <CardTitle>Logs</CardTitle>
                {/*// @ts-expect-error is ok */}
                {logs.map((log) => (
                  <div key={log.id}>
                    <div className='text-sm font-medium leading-none mt-4'>
                      Details: {log.description}
                    </div>
                    <div className='text-sm font-medium leading-none mt-4'>
                      Comment: {log.comment || "-"}
                    </div>
                    <div>
                      {" "}
                      <Contact className='inline-flex w-4 mr-2' />
                      {log.logBy.fullname}
                    </div>
                    <div>{log.logBy.jobtitle}</div>
                    <div>
                      {" "}
                      <CalendarClock className='inline-flex w-4 mr-2' />
                      {dayjs(log.created_at).format(
                        "ddd, MMMM D, YYYY, HH:mm a"
                      )}
                    </div>
                  </div>
                ))}
              </CardHeader>
              <CardContent></CardContent>
            </Card>
          </div>

          <div className='flex justify-between mt-2'>
            {/*// @ts-expect-error is ok */}
            {ememo.step == "Drafted" &&
              ememo.assignnee.id == AuthUser.id && (
                <>
                  {busy ? (
                    <Button disabled>
                      <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                      Please wait
                    </Button>
                  ) : (
                    <Button type='submit'>Save Edit</Button>
                  )}
                </>
              )}

            {CanReject &&  (
              <AlertDialog open={open2} onOpenChange={setOpen2}>
                <AlertDialogTrigger className='secondary'>

                  <ArrowBigLeftDash className='self-baseline inline-flex text-red-500' />
                  <span className='text-red-500'>Reject</span>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure to reject?
                    </AlertDialogTitle>
                    <fetcher.Form method='put' action={`/reject/${ememo.id}`}>
                      <Input
                        placeholder='for your comment'
                        name='comment'
                        id='comment'
                      />
                      <Button
                        type='submit'
                        className='mt-4 w-full'
                        onClick={() => {
                          setOpen2(false);
                        }}
                      >
                        Reject
                      </Button>
                    </fetcher.Form>
                    <AlertDialogDescription>
                      This action cannot be recall
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            {Authorize && (
              <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogTrigger className='secondary'>
                  {" "}
                  <ArrowBigRightDash className='self-baseline inline-flex' />
                  Process Next
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure to approve?
                    </AlertDialogTitle>
                    <fetcher.Form method='put' action={`/approve/${ememo.id}`}>
                      <Input
                        placeholder='for your comment'
                        name='comment'
                        id='comment'
                      />
                      <Button
                        type='submit'
                        className='mt-4 w-full'
                        onClick={() => {
                          setOpen(false);
                        }}
                      >
                        Approve
                      </Button>
                    </fetcher.Form>
                    <AlertDialogDescription>
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
