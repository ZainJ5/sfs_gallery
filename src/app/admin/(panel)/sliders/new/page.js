import { PageHeader } from "@/app/admin/_components/kit";
import SliderForm from "../SliderForm";
import { createSlider } from "../actions";

export const dynamic = "force-dynamic";

export default function NewSliderPage() {
  return (
    <div>
      <PageHeader title="Add Slider" subtitle="Add a slide to the homepage hero carousel." />
      <SliderForm action={createSlider} />
    </div>
  );
}
