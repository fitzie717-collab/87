
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Endorsement {
  id: string;
  creator: string;
  avatar: string;
  contentIdea: string;
  status: "In Progress" | "Planning" | "Approved" | "Needs Review" | "Pending";
  dueDate: string;
}

const initialEndorsementData: Endorsement[] = [
  {
    id: "end-1",
    creator: "InfluencerA",
    avatar: "/avatars/influencer-a.png",
    contentIdea: "Unboxing video for the new Summer Collection",
    status: "In Progress",
    dueDate: "2024-08-15",
  },
  {
    id: "end-2",
    creator: "UGC_CreatorX",
    avatar: "/avatars/ugc-creator-x.png",
    contentIdea: "A 'Day in the Life' video featuring our product",
    status: "Planning",
    dueDate: "2024-08-20",
  },
  {
    id: "end-3",
    creator: "InfluencerB",
    avatar: "/avatars/influencer-b.png",
    contentIdea: "How-to guide blog post",
    status: "Approved",
    dueDate: "2024-07-30",
  },
  {
    id: "end-4",
    creator: "CreatorZ",
    avatar: "/avatars/creator-z.png",
    contentIdea: "3-part TikTok series on product hacks",
    status: "Needs Review",
    dueDate: "2024-08-05",
  },
];

const getStatusVariant = (status: Endorsement["status"]) => {
  switch (status) {
    case "In Progress":
      return "default";
    case "Approved":
      return "secondary";
    case "Needs Review":
      return "destructive";
    case "Pending":
      return "outline";
    default:
      return "outline";
  }
};

export default function EndorsementsPage() {
  const [endorsements, setEndorsements] = useState(initialEndorsementData);
  const [isSending, setIsSending] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleNewEndorsement = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSending(true);

    const formData = new FormData(event.currentTarget);
    const newEndorsement: Endorsement = {
      id: `end-${endorsements.length + 1}`,
      creator: formData.get("creator-name") as string,
      contentIdea: formData.get("content-idea") as string,
      status: "Pending",
      dueDate: "TBD",
      avatar: `https://placehold.co/40x40.png`,
    };

    // Simulate API call
    setTimeout(() => {
      setEndorsements([newEndorsement, ...endorsements]);
      setIsSending(false);
      setIsDialogOpen(false);
    }, 1500);
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Creator Endorsements
        </h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>New Endorsement</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>New Endorsement Deal</DialogTitle>
              <DialogDescription>
                Contact a creator to start a new collaboration. This will
                simulate sending them an email.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleNewEndorsement}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="creator-name" className="text-right">
                    Creator
                  </Label>
                  <Input
                    id="creator-name"
                    name="creator-name"
                    placeholder="e.g., CreatorZ"
                    className="col-span-3"
                    required
                  />
                </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="creator-email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="creator-email"
                    name="creator-email"
                    type="email"
                    placeholder="e.g., creator@example.com"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="content-idea" className="text-right">
                    Content Idea
                  </Label>
                  <Input
                    id="content-idea"
                    name="content-idea"
                    placeholder="e.g., TikTok series on product hacks"
                    className="col-span-3"
                    required
                  />
                </div>
                 <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="message" className="text-right pt-2">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Hi! We'd love to collaborate on..."
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSending}>
                  {isSending ? (
                    <>
                      <Send className="mr-2 h-4 w-4 animate-pulse" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Invite
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Endorsement Workflow</CardTitle>
          <CardDescription>
            Manage and track your direct collaborations with creators.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Creator</TableHead>
                <TableHead>Content Idea</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {endorsements.map((endorsement) => (
                <TableRow key={endorsement.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage
                          src={endorsement.avatar}
                          data-ai-hint="profile picture"
                        />
                        <AvatarFallback>
                          {endorsement.creator.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{endorsement.creator}</span>
                    </div>
                  </TableCell>
                  <TableCell>{endorsement.contentIdea}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(endorsement.status)}>
                      {endorsement.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{endorsement.dueDate}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Review Content</DropdownMenuItem>
                        <DropdownMenuItem>Send Message</DropdownMenuItem>
                        <DropdownMenuItem>View Contract</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
