import { Link } from "react-router-dom";
import { FileText, Brain, BarChart3, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  { icon: FileText, title: "Submit Complaints", desc: "Report civic issues easily with location and description." },
  { icon: Brain, title: "AI Classification", desc: "Automatic department routing and priority detection." },
  { icon: BarChart3, title: "Admin Dashboard", desc: "Authorities view, manage, and resolve complaints." },
  { icon: Search, title: "Track Status", desc: "Citizens track complaint progress with their ID." },
];

export default function Index() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary py-24 text-primary-foreground">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(38_92%_50%/0.15),transparent_60%)]" />
        <div className="container relative text-center">
          <div className="mx-auto max-w-2xl">
            <span className="mb-4 inline-block rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
              AI-Powered Civic Platform
            </span>
            <h1 className="mb-6 font-display text-5xl font-bold leading-tight tracking-tight md:text-6xl">
              Smarter Cities Start with
              <span className="text-accent"> CivicAI</span>
            </h1>
            <p className="mb-8 text-lg text-primary-foreground/70">
              Report civic issues. AI categorizes and prioritizes them automatically. Authorities resolve them faster.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold">
                <Link to="/submit">
                  Report an Issue <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/track">Track Complaint</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container">
          <h2 className="mb-12 text-center font-display text-3xl font-bold">How It Works</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <div
                key={title}
                className="group rounded-xl border bg-card p-6 transition-all hover:shadow-lg hover:border-accent/40"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-display text-lg font-semibold">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted py-16">
        <div className="container text-center">
          <h2 className="mb-4 font-display text-2xl font-bold">Ready to make your city smarter?</h2>
          <p className="mb-6 text-muted-foreground">Submit your first complaint and see AI in action.</p>
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/submit">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
