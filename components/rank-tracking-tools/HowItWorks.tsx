import Image from "next/image";
import { STEPS } from "./data";

export default function HowItWorks() {
  return (
    <section id="how" className="l2-how">
      <div className="l2-wrap">
        <div className="l2-head-narrow">
          <div className="l2-eyebrow l2-mono">How it works</div>
          <h2 className="l2-h2">Four steps, about five minutes</h2>
        </div>
        <div className="l2-steps">
          {STEPS.map((step) => (
            <div key={step.n} className="l2-step">
              <Image
                src={step.shot}
                alt=""
                width={step.width}
                height={step.height}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
              />
              <div className="l2-step-body">
                <div className="l2-step-n l2-mono">{step.n}</div>
                <div className="l2-step-t">{step.title}</div>
                <p className="l2-step-p">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
