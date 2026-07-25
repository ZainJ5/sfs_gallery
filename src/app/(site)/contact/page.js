import ContactPageForm from "../_components/ContactPageForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="bg-zinc-50">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h1 className="text-center text-3xl font-bold uppercase tracking-wide text-heading sm:text-4xl">
          Contact Us
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-center text-body">
          We are open 7 days a week Monday through Sunday from 10:00 AM - 06:00 PM.
        </p>
        <div className="mt-8 rounded-2xl bg-white p-6 shadow-lg sm:p-10">
          <ContactPageForm />
        </div>
      </div>
    </div>
  );
}
