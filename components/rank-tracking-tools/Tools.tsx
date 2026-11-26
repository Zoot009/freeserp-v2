import { TOOLS } from "./data";

export default function Tools() {
  return (
    <section id="tools" className="l2-tools">
      <div className="l2-wrap">
        <div className="l2-tools-head">
          <h2 className="l2-h2 l2-h2-flat">Everything, on any paid plan</h2>
          <p className="l2-tools-note">
            Google rank tracking is free. Any paid plan unlocks the rest.
          </p>
        </div>
        <div className="l2-tools-grid">
          {TOOLS.map((tool) => (
            <div key={tool.name} className="l2-tool">
              <div className="l2-tool-head">
                <span className="l2-tool-name">{tool.name}</span>
                <span className="l2-tool-cost l2-mono">{tool.cost}</span>
              </div>
              <p className="l2-tool-what">{tool.what}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
