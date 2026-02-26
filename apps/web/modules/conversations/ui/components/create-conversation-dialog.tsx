"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { PlusIcon } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export function CreateConversationDialog() {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const createConversation = useMutation(api.conversations.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !customerName.trim()) return;

    await createConversation({
      title: title.trim(),
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim() || undefined,
    });

    setTitle("");
    setCustomerName("");
    setCustomerEmail("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          {t.conversations.newConversation}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.conversations.newConversation}</DialogTitle>
          <DialogDescription>
            {t.conversations.startNew}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="title">{t.conversations.titleLabel}</Label>
            <Input
              id="title"
              placeholder={t.conversations.titlePlaceholder}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="customerName">{t.conversations.customerName}</Label>
            <Input
              id="customerName"
              placeholder={t.conversations.customerNamePlaceholder}
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="customerEmail">{t.conversations.customerEmail}</Label>
            <Input
              id="customerEmail"
              type="email"
              placeholder={t.conversations.customerEmailPlaceholder}
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              {t.common.cancel}
            </Button>
            <Button type="submit" disabled={!title.trim() || !customerName.trim()}>
              {t.common.create}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
