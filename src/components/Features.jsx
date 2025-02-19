import { FaPlay, FaRobot, FaFilm } from "react-icons/fa";

const features = [
  { 
    icon: FaPlay, 
    title: "4K Streaming", 
    description: "Experience cinema-quality streaming with our Ultra HD content" 
  },
  { 
    icon: FaRobot, 
    title: "AI Powered", 
    description: "Get personalized recommendations powered by advanced AI" 
  },
  { 
    icon: FaFilm, 
    title: "Exclusive Content", 
    description: "Enjoy our original productions and exclusive releases" 
  },
];

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="rounded-lg bg-zinc-900 p-6">
    <div className="flex flex-col items-center gap-4 text-center">
      <div className="rounded-lg bg-zinc-800 p-3">
        <Icon className="h-6 w-6 text-red-500" />
      </div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  </div>
);

const Features = () => {
  return (
    <section className="bg-black py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold text-white md:text-4xl">
            Why ?
          </h2>
          <h3 className="mx-auto mb-12 max-w-2xl text-gray-400">
            Experience the future of streaming with our cutting-edge features
          </h3>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 