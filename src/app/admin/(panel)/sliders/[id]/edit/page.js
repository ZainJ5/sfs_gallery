import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import Slider from "@/models/Slider";
import { serialize } from "@/lib/serialize";
import { PageHeader } from "@/app/admin/_components/kit";
import DeleteButton from "@/app/admin/_components/DeleteButton";
import SliderForm from "../../SliderForm";
import { updateSlider, deleteSlider } from "../../actions";

export const dynamic = "force-dynamic";

export default async function EditSliderPage({ params }) {
  const { id } = await params;
  await connectDB();

  let doc = null;
  try {
    doc = await Slider.findById(id).lean();
  } catch {
    doc = null;
  }
  if (!doc) notFound();

  const initial = serialize(doc);

  return (
    <div>
      <PageHeader
        title="Edit Slider"
        action={<DeleteButton action={deleteSlider} id={id} redirectAfter="/admin/sliders" />}
      />
      <SliderForm action={updateSlider.bind(null, id)} initial={initial} />
    </div>
  );
}
