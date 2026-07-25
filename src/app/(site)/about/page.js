export const dynamic = "force-dynamic";
export const metadata = { title: "About Us" };

const TEAM = [
  {
    name: "Yasir Aijaz",
    role: "Managing Director",
    photo: "https://sfsgallery.com/wp-content/uploads/2026/06/yasri.jpg",
  },
  {
    name: "Shield Dux",
    role: "Gallery Manager",
    photo: "https://sfsgallery.com/wp-content/uploads/2026/06/shield.jpg",
  },
  {
    name: "Mark Malinowski",
    role: "Fine Art Sales Specialist",
    photo: "https://sfsgallery.com/wp-content/uploads/2026/06/mark.jpg",
  },
  {
    name: "Carrie Glassmeyer",
    role: "Fine Art Sales Specialist",
    photo: "https://sfsgallery.com/wp-content/uploads/2026/06/carrie.jpg",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <h1 className="mb-8 text-center text-3xl font-bold uppercase tracking-wide text-heading sm:text-4xl">
        About Us
      </h1>

      <div className="space-y-5 leading-8 text-body">
        <p>
          San Francisco Street Gallery is a prominent art gallery located on Santa Fe
          Plaza in the historic art city of Santa Fe, New Mexico. We showcase a diverse
          collection of artwork, blending traditional, modern, and contemporary styles
          from artists across the world. Our goal is to connect audiences with art that
          can inspire, create conversations, and bring people together. While we honor
          the rich Southwestern art tradition, our collection also includes a variety of
          other styles, colors, and mediums which allows us to offer a wide blend of
          genres while still celebrating the cultural spirit of New Mexico.
        </p>
        <p>
          Our team of experienced curators and art professionals are passionate about
          helping every visitor find art pieces that resonate with them. We work closely
          with more than sixty artists, both from New Mexico and around the world, to
          display a vibrant fine art collection. Every visit to our gallery offers a
          fresh and exciting opportunity to explore, experience, and engage with art in a
          meaningful way.
        </p>
        <p>
          Spanning 2,500 square feet, our gallery is thoughtfully designed to enhance the
          visual experience. Featuring bright track lighting, contemporary interiors, and
          a private viewing room allows our clients to appreciate works in an intimate
          and curated setting.
        </p>
        <p>
          San Francisco Street Gallery is located at 50 East San Francisco Street, Santa
          Fe, New Mexico, and is open seven days a week from 10 AM to 6 PM. Whether
          you&apos;re an art lover, a collector, or just exploring Santa Fe Plaza, we
          invite you to visit and discover something special in our gallery.
        </p>
      </div>

      <h2 className="mb-8 mt-14 text-center text-2xl font-bold text-heading">Our Team</h2>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {TEAM.map((m) => (
          <div key={m.name} className="text-center">
            <div className="aspect-[3/4] overflow-hidden rounded-lg bg-zinc-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.photo} alt={m.name} className="h-full w-full object-cover" />
            </div>
            <h3 className="mt-3 text-base font-bold text-heading">{m.name}</h3>
            <p className="text-sm text-body">{m.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
