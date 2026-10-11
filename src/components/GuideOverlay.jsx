export default function GuideOverlay() {
  return (
    <>
      <canvas id="world" aria-hidden="true" />
      <div id="bot-ui">
        <div className="speech">
          <span className="speaker">YOUR GUIDE</span>
          <span id="speech-text">
            Hi, I’m your guide. Let me show you around.
          </span>
        </div>
        <button
          id="bot-hit"
          aria-label="Ask your guide for a fun fact"
          title="Click your guide for a fun fact"
        ></button>
      </div>
      <div id="webgl-fallback" hidden>
        YOUR GUIDE <span>◉ ◉</span>
      </div>
    </>
  );
}
