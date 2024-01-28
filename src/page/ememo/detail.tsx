// import { Tiptap } from "@/components/Tiptap";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useState, useCallback } from "react";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import Step from "@/components/step";
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
  Form as ShadForm,
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
  Form,
} from "react-router-dom";
import {
  Trash2,
  FileText,
  ArrowBigRightDash,
  ArrowBigLeftDash,
  Tags,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import Editor from "@/components/ui/editor/editor";

const MAX_FILE_SIZE = 2621440;
// const ACCEPTED_IMAGE_TYPES = [
//   "image/jpeg",
//   "image/jpg",
//   "image/png",
//   "image/webp",
// ];

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

  files: z.any(),
});

type EmemoFormValues = z.infer<typeof formSchema>;

export default function Detail() {
  const [, setCopied] = useState(false);

  const onCopy = useCallback(() => {
    setCopied(true);
    toast({
      title: "Link Copie",
    });
  }, []);

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

  const AssignToUserId = ememo.assignnee ? ememo.assignnee.id : "No Assignee";
  const AssignToUserFullname = ememo.assignnee
    ? ememo.assignnee.fullname
    : "No Assignee";
  // @ts-expect-error ignore //
  const Author = AuthUser.id == ememo.author.id;
  // @ts-expect-error ignore //
  const Authorize = AuthUser.id == AssignToUserId;
  const CanReject = (Authorize && ememo.step != "Drafted") || Author;

  const defaultValues: Partial<EmemoFormValues> = {
    title: ememo.title,
    content: ememo.content,
    approver_id: ememo.approver.id.toString(),
    final_approver_id: ememo.final_approver.id.toString(),
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

        // if (!ACCEPTED_IMAGE_TYPES.includes(values.files[i].type)) {
        //   return form.setError("files", {
        //     type: "manual",
        //     message: `wrong file type`,
        //   });
        // }
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

  return (
    <div>
      <div className='flex items-center justify-between'>
        <h2 className='text-3xl font-bold tracking-tight'>
          Ememo {ememo.number}
        </h2>
        <div>
          <FileText className='inline-flex w-3 h-3' />
          <a
            href={`/api/v1/pdf/report/${ememo.number}`}
            className='text-sm leading-none'
            target="_blank" rel="noopener noreferrer"
          >
            Export PDF
          </a>
        </div>
      </div>

      <ShadForm {...form}>
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
                <FormLabel>Content </FormLabel>
                <FormControl>
                  <Editor
                    content={ememo.content}
                    onChange={field.onChange}
                    editable={ ememo.step == "Drafted" && Authorize}
                  />

                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <div>
              {" "}
              <Card className='w-full my-4 rounded-sm'>
                <CardHeader>
                  <CardTitle>Step</CardTitle>
                  <div>Created by author: {ememo.author.fullname}</div>
                  Assign to : {AssignToUserFullname}
                  <div className='mt-4 text-sm font-medium leading-none'>
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
                                  <CaretSortIcon className='w-4 h-4 ml-2 opacity-50 shrink-0' />
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
                                  <CaretSortIcon className='w-4 h-4 ml-2 opacity-50 shrink-0' />
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
                    <FormField
                      control={form.control}
                      name='final_approver_id'
                      render={({ field }) => (
                        <FormItem className='flex flex-col my-6'>
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
                                    ? users.find(
                                        // @ts-expect-error is ok
                                        (user) => user.value === field.value
                                      )?.label
                                    : "Select user"}
                                  <CaretSortIcon className='w-4 h-4 ml-2 opacity-50 shrink-0' />
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
                                          "final_approver_id",
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
                      <div className='grid items-center w-full max-w-sm'>
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
                  <div className='mt-4 text-sm font-medium leading-none'>
                    Uploaded Files
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    Below are the files uploaded
                  </p>
                  {medias.length > 0 &&
                    // @ts-expect-error is ok
                    medias.map((media, id) => (
                      <div key={id} className='mt-2 mb-2'>
                        <div className='flex items-center space-y-1'>

                          <a
                            href={`/api/v1/ememo/presigned_media/${media.filename}`}
                            className='text-sm font-medium leading-none'
                            target="_blank" rel="noopener noreferrer"
                          >
                            {media.filename}
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
                          <CopyToClipboard

                            onCopy={onCopy}
                            text={`https://django-ememo.fly.dev/api/v1/ememo/presigned_media/${media.filename}`}
                          >
                            <button type='button'>
                              <div className='flex align-baseline ml-2'>
                                <Tags />
                                <span className='text-xs self-center'>copy link</span>
                              </div>
                            </button>
                          </CopyToClipboard>
                        </div>
                      </div>
                    ))}
                  <div className='max-w-sm pt-6 mt-4 text-sm font-medium leading-none border-t'>
                    Pending Uploaded
                  </div>
                  <p className='text-sm text-muted-foreground'>
                    Below are the files pedning upload
                  </p>
                  {name.length > 0 &&
                    name.map((file, id) => (
                      <div
                        key={id}
                        className='flex items-center mt-2 space-y-1'
                      >
                        <FileText className='w-5 h-5' />
                        <div className='flex items-center space-y-1'>
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
                          { /*// @ts-expect-error is ok */ }
                          inputRef.current!.value = null;
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
                <div className='mt-4 text-sm font-medium leading-none'>
                  Created at :
                  <span className='text-sm text-muted-foreground'>
                    {createdAt}
                  </span>
                </div>
                <div className='mt-4 text-sm font-medium leading-none'>
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
                    <div className='mt-4 text-sm font-medium leading-none'>
                      Details: {log.description}
                    </div>
                    <div className='mt-4 text-sm font-medium leading-none'>
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
            {ememo.step == "Drafted" && ememo.assignnee.id == AuthUser.id && (
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
          </div>
        </form>
      </ShadForm>

      <div className='flex justify-between mt-4'>
        {CanReject &&  (
          <AlertDialog open={open2} onOpenChange={setOpen2}>
            <AlertDialogTrigger className='secondary'>
              <ArrowBigLeftDash className='inline-flex text-red-500 self-baseline' />
              <span className='text-red-500'>Reject</span>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you absolutely sure to reject?
                </AlertDialogTitle>
                <Form method='put'>
                  <Input
                    placeholder='for your comment to reject'
                    name='comment'
                    id='reject'
                  />
                  <Button
                    type='submit'
                    variant='destructive'
                    name='intent'
                    value='reject'
                    className='w-full mt-2'
                    onClick={() => {
                      setOpen2(false);
                    }}
                  >
                    Reject
                  </Button>
                </Form>
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
              {ememo.step == "Reject"? "Resubmit": "Process Next"}

              <ArrowBigRightDash className='inline-flex self-baseline' />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you absolutely sure to approve?
                </AlertDialogTitle>
                <Form method='put'>
                  <Input
                    placeholder='for your comment to approve'
                    name='comment'
                    id='approve'
                  />

                  <Button
                    type='submit'
                    name='intent'
                    value='approve'
                    className='w-full mt-2'
                    onClick={() => {
                      setOpen(false);
                    }}
                  >
                    Approve
                  </Button>
                </Form>
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
    </div>
  );
}
