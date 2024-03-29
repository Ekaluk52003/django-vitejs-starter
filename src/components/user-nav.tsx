import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form, useRouteLoaderData } from "react-router-dom";

import { IMAGES } from "@/images/Images";

export function UserNav() {

  const AuthUser = useRouteLoaderData("authloader");


  if (AuthUser) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
            <AvatarImage src={IMAGES.image1} alt="@shadcn" />
              <AvatarFallback>Hi</AvatarFallback>
            </Avatar>

          </Button>

        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                         {/*// @ts-expect-error is ok */}
                {AuthUser.fullname}

              </p>
              <p className="text-xs leading-none text-muted-foreground">
                         {/*// @ts-expect-error is ok */}
              {AuthUser.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
                {/*// @ts-expect-error is ok */}
          {AuthUser.is_staff ?
            <DropdownMenuItem>
             <a href="/admin/">Admin Page</a>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            :""}
            <DropdownMenuItem><Link to="/dashboard/profile">User Profile</Link>     <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut></DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem >
          <Form method='DELETE' action="/logout">
                <button type='submit'>Logout from Account</button>
              </Form>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}