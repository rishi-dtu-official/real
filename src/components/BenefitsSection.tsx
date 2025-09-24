import { BarChart, Globe, Languages, TrendingUp } from "lucide-react";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: BarChart,
      title: "Amplify Insights",
      description: "Unlock data-driven decisions with comprehensive analytics, revealing key opportunities for strategic regional growth."
    },
    {
      icon: Globe,
      title: "Control Your Global Presence", 
      description: "Manage and track satellite offices, ensuring consistent performance and streamlined operations everywhere."
    },
    {
      icon: Languages,
      title: "Remove Language Barriers",
      description: "Adapt to diverse markets with built-in localization for clear communication and enhanced user experience."
    },
    {
      icon: TrendingUp,
      title: "Visualize Growth",
      description: "Generate precise, visually compelling reports that illustrate your growth trajectories across all regions."
    }
  ];

  return (
    <section id="benefits" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16">
          <p className="text-sm uppercase tracking-wider text-primary mb-8">Benefits</p>
          <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-8">
            We've cracked the code.
          </h2>
          <p className="text-xl text-muted-foreground">
            Area provides real insights, without the data overload.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="space-y-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;