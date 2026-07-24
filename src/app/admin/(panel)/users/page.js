import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Subscriber from "@/models/Subscriber";
import { serialize } from "@/lib/serialize";
import { PageHeader } from "@/app/admin/_components/kit";
import UsersClient from "./UsersClient";
import { saveUser, deleteUser, deleteSubscriber } from "./actions";

export const dynamic = "force-dynamic";

export default async function UserDataPage() {
  await connectDB();
  const [users, subscribers] = await Promise.all([
    User.find().sort({ createdAt: 1 }).select("name email role createdAt").lean(),
    Subscriber.find().sort({ createdAt: -1 }).lean(),
  ]);

  return (
    <div>
      <PageHeader
        title="User Data"
        subtitle="Manage admin accounts and newsletter subscribers."
      />
      <UsersClient
        users={serialize(users)}
        subscribers={serialize(subscribers)}
        saveUser={saveUser}
        deleteUser={deleteUser}
        deleteSubscriber={deleteSubscriber}
      />
    </div>
  );
}
