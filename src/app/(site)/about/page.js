import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";
export const metadata = { title: "About Us" };

export default async function AboutPage() {
  const s = await getSettings();

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-center text-3xl font-semibold text-heading sm:text-4xl">
        About the Gallery
      </h1>
      <div className="prose-content mx-auto mt-8">
        <p>
          San Francisco Street Gallery is a contemporary fine art gallery located in
          the heart of historic Santa Fe, New Mexico. We represent a diverse group of
          established and emerging artists working across painting, sculpture, and mixed
          media.
        </p>
        <p>
          Our mission is to connect collectors and art lovers with exceptional original
          work, and to celebrate the vibrant creative community of the Southwest. Whether
          you are a seasoned collector or discovering fine art for the first time, we
          invite you to visit us and experience the collection in person.
        </p>
      </div>

      <div className="mt-10 rounded-lg border border-line bg-zinc-50 p-6 text-center">
        <h2 className="text-lg font-semibold text-heading">Visit Us</h2>
        {s.address && <p className="mt-2 text-body">{s.address}</p>}
        {s.phones?.office && <p className="text-body">Office: {s.phones.office}</p>}
        {s.email && (
          <p className="text-body">
            <a href={`mailto:${s.email}`} className="hover:text-heading">
              {s.email}
            </a>
          </p>
        )}
      </div>
    </div>
  );
}
