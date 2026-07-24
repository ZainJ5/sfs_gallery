import { connectDB } from "@/lib/db";
import Message from "@/models/Message";
import { serialize } from "@/lib/serialize";
import { PageHeader } from "@/app/admin/_components/kit";
import MessagesList from "./MessagesList";
import { setRead, deleteMessage } from "./actions";

export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  await connectDB();
  const messages = serialize(await Message.find().sort({ createdAt: -1 }).lean());
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div>
      <PageHeader
        title="Messages"
        subtitle={`${messages.length} message${messages.length === 1 ? "" : "s"} · ${unread} unread`}
      />
      <MessagesList
        messages={messages}
        setRead={setRead}
        deleteMessage={deleteMessage}
      />
    </div>
  );
}
