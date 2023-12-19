import { Tiptap } from "@/components/Tiptap";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, useActionData, useLoaderData } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectGroup,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast"


export default function Detail() {
  const { toast } = useToast()
  const data = useLoaderData()
  const success = useActionData()




  const [content, setContent] = useState(data.ememo.content);
  const [title, setTitle] = useState(data.ememo.title);
  const [reviewver, setReviewver] = useState(data.ememo.reviewer.toString());
  const [approver, setApprover] = useState(data.ememo.approver.toString());

  return (
    <div>
{ success ? "done properly" :""}
      <h3>Detail</h3>
      <Form method='post' className='px-8 pt-6 pb-8 mb-4' action={`/dashboard/ememo/${data.ememo.id}`}>
        <fieldset disabled={data.ememo.step != "Drafted"}>
          <Label htmlFor='email'>Title</Label>
          <Input
            type='text'
            name='title'
            value={title}
   onChange={(e) => setTitle(e.target.value)
   }
          />
             <input type='text' value={content} name='content'  readOnly/>

          <input type='hidden' value={content} name='content' readOnly={true} />
          <Tiptap setContent={setContent} content={content} />
          <div className='mt-4'>
            <Label htmlFor='email'>Reviewer</Label>
            <Select name='reviewer_id' value={reviewver}  onValueChange={(val) => setReviewver(val)
   }>
              <SelectTrigger className='w-[300px]'>
                <SelectValue placeholder='Theme' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Please select name</SelectLabel>
                  {data.user.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.fullname}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className='mt-4 mb-4'>
          <Label htmlFor='email'>Approver</Label>
          <Select name='approver_id'  value={approver} onValueChange={(val) => setApprover(val)
   }>
            <SelectTrigger className='w-[300px]'>
              <SelectValue placeholder='Theme' />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Please select name</SelectLabel>
                {data.user.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.fullname}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>


          <Button type='submit' className='w-full' name="intent" value="edit">
            Save
          </Button>
        </fieldset>
      </Form>
    </div>
  );
}
