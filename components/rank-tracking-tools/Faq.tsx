import { FAQS } from "./data";

export default function Faq() {
  return (
    <section id="faq" className="l2-faq">
      <div className="l2-wrap">
        <h2 className="l2-h2 l2-h2-flat">Questions people ask first</h2>
        <div className="l2-faq-grid">
          {FAQS.map((faq) => (
            <div key={faq.q} className="l2-faq-card">
              <div className="l2-faq-q">{faq.q}</div>
              <p className="l2-faq-a">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
