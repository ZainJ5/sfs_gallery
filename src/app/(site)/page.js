import { connectDB } from "@/lib/db";
import Slider from "@/models/Slider";
import { serialize } from "@/lib/serialize";
import HeroSlider from "./_components/HeroSlider";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  await connectDB();
  const slides = serialize(
    await Slider.find({ active: true }).sort({ order: 1, createdAt: 1 }).lean()
  );

  return <HeroSlider slides={slides} />;
}
