import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { projects } from "../data/projects";

/** Starts a single scene after React commits the page. Returns unmount cleanup. */
export function createPortfolioExperience(root) {
  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => [...root.querySelectorAll(selector)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const mix = (a, b, t) => a + (b - a) * t;
  const ease = (t) => t * t * (3 - 2 * t);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const abort = new AbortController();
  const listen = (target, type, handler, options = {}) =>
    target.addEventListener(type, handler, {
      ...options,
      signal: abort.signal,
    });
  let frameId = 0;
  let stopped = false;
  let environmentTarget;
  let w = innerWidth,
    h = innerHeight,
    mobile = w <= 760,
    scroll = scrollY,
    mouse = { x: 0, y: 0 },
    hoverBot = false,
    hoverCard = false,
    funUntil = 0;
  let section = 0,
    activeProject = 0,
    lastSpeech = "",
    speechTarget = "",
    speechShown = "",
    stageProgress = 0,
    renderer;
  const sections = $$("main>section"),
    reveals = $$(".reveal"),
    cards = $$(".project-card");
  const speeches = [
    "Hi, I’m your guide. Let me show you around.",
    "This is Huzaifa. He turns AI ideas into working applications.",
    projects[0].speech,
    "Here’s what he builds with. From Python to full-stack AI.",
    "A foundation in AI. A journey shaped by building.",
    "Want to work together? Let’s make your next idea real.",
  ];
  const facts = [
    "Huzaifa works with six programming languages. Python, C++, Java, Rust, R and Julia.",
    "Seven projects. One common thread: turning ideas into working software.",
    "I’m your guide. Scroll backward and I’ll retrace our steps.",
    "Huzaifa is based in Islamabad and open to global collaboration.",
  ];
  let factIndex = 0;
  listen($("#bot-hit"), "mouseenter", () => (hoverBot = true));
  listen($("#bot-hit"), "mouseleave", () => (hoverBot = false));
  listen($("#bot-hit"), "click", () => {
    funUntil = performance.now() + 6500;
    setSpeech(facts[factIndex++ % facts.length]);
  });
  cards.forEach((c) => {
    listen(c, "mouseenter", () => (hoverCard = true));
    listen(c, "mouseleave", () => (hoverCard = false));
    listen(c, "focus", () => (hoverCard = true));
    listen(c, "blur", () => (hoverCard = false));
  });
  listen(
    window,
    "pointermove",
    (e) => {
      mouse.x = (e.clientX / w) * 2 - 1;
      mouse.y = (e.clientY / h) * 2 - 1;
    },
    { passive: true },
  );
  listen(window, "scroll", () => (scroll = scrollY), { passive: true });
  $$(".magnetic").forEach((a) => {
    listen(a, "pointermove", (e) => {
      if (reduce || mobile) return;
      const r = a.getBoundingClientRect();
      a.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.13}px,${(e.clientY - r.top - r.height / 2) * 0.2}px)`;
    });
    listen(a, "pointerleave", () => (a.style.transform = ""));
  });
  $$(".project-pagination button").forEach((b) =>
    listen(b, "click", () => {
      const sec = $("#work");
      window.scrollTo({
        top:
          sec.offsetTop +
          (Number(b.dataset.index) / 6) * (sec.offsetHeight - h),
        behavior: reduce ? "instant" : "smooth",
      });
    }),
  );
  function setSpeech(text) {
    if (text === lastSpeech) return;
    lastSpeech = text;
    speechTarget = text;
    speechShown = "";
    if (reduce) {
      speechShown = text;
      $("#speech-text").textContent = text;
    } else $("#speech-text").textContent = "";
  }
  setSpeech(speeches[0]);
  let typeClock = 0;
  function pageUpdate(now) {
    w = innerWidth;
    h = innerHeight;
    mobile = w <= 760;
    const center = scroll + h * 0.38;
    section = 0;
    sections.forEach((s, i) => {
      if (s.offsetTop <= center) section = i;
    });
    const sec = sections[section];
    stageProgress = clamp((center - sec.offsetTop) / sec.offsetHeight);
    const wp = clamp(
      (scroll - $("#work").offsetTop) /
        Math.max(1, $("#work").offsetHeight - h),
    );
    if (!mobile && !reduce) {
      const track = $("#project-track"),
        viewport = $(".project-viewport");
      track.style.transform = `translateX(${-wp * (track.scrollWidth - viewport.clientWidth)}px)`;
      activeProject = Math.min(6, Math.round(wp * 6));
      cards.forEach((c, i) => {
        const d = i - wp * 6;
        c.style.transform = reduce
          ? "none"
          : `rotateY(${clamp(d, -1, 1) * -4}deg)`;
      });
    } else {
      let best = Infinity;
      cards.forEach((c, i) => {
        let d = Math.abs(c.getBoundingClientRect().top - h * 0.22);
        if (d < best) {
          best = d;
          activeProject = i;
        }
      });
    }
    $("#project-counter").textContent = `0${activeProject + 1} — 07`;
    $$(".project-pagination button").forEach((b, i) => {
      b.classList.toggle("active", i === activeProject);
      b.setAttribute("aria-current", i === activeProject ? "true" : "false");
    });
    $$(".section-dots a").forEach((a, i) => {
      a.classList.toggle("active", i === section);
      a.setAttribute("aria-current", i === section ? "location" : "false");
    });
    $("#progress").style.transform =
      `scaleX(${clamp(scroll / (document.documentElement.scrollHeight - h))})`;
    if (now > funUntil)
      setSpeech(
        section === 2 ? projects[activeProject].speech : speeches[section],
      );
    if (now - typeClock > 22 && speechShown.length < speechTarget.length) {
      speechShown = speechTarget.slice(0, speechShown.length + 2);
      $("#speech-text").textContent = speechShown;
      typeClock = now;
    }
    reveals.forEach((el, i) => {
      if (reduce) return;
      const r = el.getBoundingClientRect(),
        p = clamp((h * 0.94 - r.top) / (h * 0.23));
      el.style.opacity = p;
      el.style.transform = `translateY(${(1 - ease(p)) * 24}px)`;
    });
    $$("[data-count]").forEach((el) => {
      const rect = el.getBoundingClientRect(),
        p = reduce ? 1 : clamp((h * 0.9 - rect.top) / 170);
      el.textContent = Math.round(Number(el.dataset.count) * ease(p));
    });
    const jr = $(".timeline").getBoundingClientRect();
    $("#timeline-fill").style.transform =
      `scaleY(${reduce ? 1 : clamp((h * 0.7 - jr.top) / jr.height)})`;
    const cp = clamp(
      (scroll + h * 0.7 - $("#contact").offsetTop) / Math.max(1, h * 0.7),
    );
    $("#email-button").style.boxShadow = reduce
      ? "none"
      : `0 0 0 ${Math.sin(cp * Math.PI) * 10}px rgba(101,151,255,${Math.sin(cp * Math.PI) * 0.15})`;
  }
  // Reusable 3D character: independent head, eye, arm, hand, base and prop groups.
  const mats = {
    body: new THREE.MeshStandardMaterial({
      color: 0xdce4ef,
      metalness: 0.35,
      roughness: 0.23,
    }),
    dark: new THREE.MeshStandardMaterial({
      color: 0x080f1c,
      metalness: 0.65,
      roughness: 0.15,
    }),
    edge: new THREE.MeshStandardMaterial({
      color: 0x46546a,
      metalness: 0.72,
      roughness: 0.28,
    }),
    blue: new THREE.MeshStandardMaterial({
      color: 0x6597ff,
      emissive: 0x3b82f6,
      emissiveIntensity: 0.8,
      metalness: 0.3,
      roughness: 0.3,
    }),
    paper: new THREE.MeshStandardMaterial({
      color: 0xe6eafa,
      roughness: 0.6,
      metalness: 0.1,
    }),
  };
  function rounded(w, h, d, r, mat) {
    const s = new THREE.Shape();
    const x = -w / 2,
      y = -h / 2;
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y);
    s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r);
    s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h);
    s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r);
    s.quadraticCurveTo(x, y, x + r, y);
    const g = new THREE.ExtrudeGeometry(s, {
      depth: d,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.035,
      bevelThickness: 0.035,
      curveSegments: 8,
    });
    g.translate(0, 0, -d / 2);
    return new THREE.Mesh(g, mat);
  }
  function ball(radius, mat) {
    return new THREE.Mesh(new THREE.SphereGeometry(radius, 24, 16), mat);
  }
  function tube(a, b, r, mat) {
    const dir = new THREE.Vector3().subVectors(b, a);
    const obj = new THREE.Mesh(
      new THREE.CylinderGeometry(r, r, dir.length(), 10),
      mat,
    );
    obj.position.copy(a).add(b).multiplyScalar(0.5);
    obj.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir.normalize(),
    );
    return obj;
  }
  function ring(radius, mat, thick = 0.025) {
    return new THREE.Mesh(new THREE.TorusGeometry(radius, thick, 10, 72), mat);
  }
  function add(parent, obj, x = 0, y = 0, z = 0) {
    obj.position.set(x, y, z);
    parent.add(obj);
    return obj;
  }
  function arm(side) {
    const g = new THREE.Group();
    g.position.set(side * 0.6, 0.06, 0);
    add(g, ball(0.115, mats.edge));
    const upper = add(g, ball(1, mats.body), side * 0.02, -0.24, 0);
    upper.scale.set(0.105, 0.28, 0.13);
    const joint = add(g, ball(0.095, mats.edge), side * 0.04, -0.48, 0);
    const hand = add(g, ball(1, mats.body), side * 0.05, -0.65, 0.015);
    hand.scale.set(0.12, 0.17, 0.12);
    add(g, ball(0.06, mats.body), side * -0.05, -0.6, 0.08);
    return g;
  }
  function createBot() {
    const root = new THREE.Group();
    const body = add(root, ball(1, mats.body), 0, -0.12, 0);
    body.scale.set(0.55, 0.57, 0.36);
    add(root, rounded(0.26, 0.07, 0.03, 0.03, mats.dark), 0, 0.02, 0.365);
    add(root, rounded(0.12, 0.025, 0.025, 0.008, mats.blue), 0, 0.025, 0.39);
    add(
      root,
      new THREE.Mesh(
        new THREE.CylinderGeometry(0.14, 0.18, 0.16, 24),
        mats.edge,
      ),
      0,
      0.49,
      0,
    );
    const head = add(root, new THREE.Group(), 0, 0.92, 0);
    add(head, rounded(1.44, 0.83, 0.72, 0.27, mats.body));
    add(head, rounded(1.3, 0.63, 0.1, 0.23, mats.dark), 0, -0.015, 0.418);
    const eyes = [
      add(
        head,
        rounded(0.12, 0.215, 0.025, 0.055, mats.blue),
        -0.27,
        0.015,
        0.491,
      ),
      add(
        head,
        rounded(0.12, 0.215, 0.025, 0.055, mats.blue),
        0.27,
        0.015,
        0.491,
      ),
    ];
    const happy = new THREE.Group();
    [-0.27, 0.27].forEach((x) => {
      const arc = new THREE.Mesh(
        new THREE.TorusGeometry(0.095, 0.018, 8, 24, Math.PI),
        mats.blue,
      );
      add(happy, arc, x, 0, 0.499);
    });
    head.add(happy);
    happy.visible = false;
    const sensor = add(head, ball(0.026, mats.blue), 0, 0.47, 0.08);
    [-1, 1].forEach((side) => {
      const ear = add(
        head,
        new THREE.Mesh(
          new THREE.CylinderGeometry(0.11, 0.11, 0.06, 24),
          mats.edge,
        ),
        side * 0.765,
        0,
        0,
      );
      ear.rotation.z = Math.PI / 2;
    });
    const left = arm(-1),
      right = arm(1);
    root.add(left, right);
    add(root, rounded(0.51, 0.12, 0.38, 0.055, mats.edge), 0, -0.66, 0);
    add(root, rounded(0.28, 0.025, 0.2, 0.01, mats.blue), 0, -0.745, 0);
    const base = add(
      root,
      ring(
        0.67,
        new THREE.MeshStandardMaterial({
          color: 0x668dce,
          emissive: 0x234578,
          emissiveIntensity: 0.3,
          transparent: true,
          opacity: 0.22,
        }),
        0.008,
      ),
      0,
      -1.05,
      0,
    );
    base.rotation.x = Math.PI / 2;
    const props = new THREE.Group();
    root.add(props);
    const card = new THREE.Group();
    add(card, rounded(0.63, 0.82, 0.055, 0.045, mats.paper));
    add(card, ball(0.09, mats.blue), 0, 0.15, 0.05);
    for (let i = 0; i < 3; i++)
      add(
        card,
        rounded(0.36 - i * 0.07, 0.03, 0.015, 0.005, mats.edge),
        0,
        -0.07 - i * 0.11,
        0.05,
      );
    props.add(card);
    const magnifier = new THREE.Group();
    add(magnifier, ring(0.26, mats.body, 0.04));
    add(
      magnifier,
      new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.055, 0.4, 10),
        mats.dark,
      ),
      0,
      -0.43,
      0,
    );
    props.add(magnifier);
    const laptop = new THREE.Group();
    const screen = add(
      laptop,
      rounded(1.15, 0.75, 0.08, 0.07, mats.edge),
      0,
      0.3,
      0,
    );
    add(laptop, rounded(0.99, 0.59, 0.02, 0.04, mats.dark), 0, 0.3, 0.065);
    for (let i = 0; i < 4; i++)
      add(
        laptop,
        rounded(
          0.64 - i * 0.07,
          0.025,
          0.025,
          0.005,
          i % 2 ? mats.body : mats.blue,
        ),
        -0.09,
        0.48 - i * 0.11,
        0.09,
      );
    const keyboard = add(
      laptop,
      rounded(1.15, 0.7, 0.065, 0.04, mats.edge),
      0,
      -0.09,
      0.32,
    );
    keyboard.rotation.x = Math.PI / 2;
    props.add(laptop);
    const envelope = new THREE.Group();
    add(envelope, rounded(0.95, 0.63, 0.055, 0.06, mats.paper));
    envelope.add(
      tube(
        new THREE.Vector3(-0.43, 0.26, 0.07),
        new THREE.Vector3(0, -0.02, 0.07),
        0.012,
        mats.edge,
      ),
      tube(
        new THREE.Vector3(0.43, 0.26, 0.07),
        new THREE.Vector3(0, -0.02, 0.07),
        0.012,
        mats.edge,
      ),
    );
    props.add(envelope);
    const icons = new THREE.Group();
    ["Py", "AI", "ML"].forEach((label, i) => {
      const cvs = document.createElement("canvas");
      cvs.width = 128;
      cvs.height = 128;
      const ctx = cvs.getContext("2d");
      ctx.fillStyle = "#111c2d";
      ctx.fillRect(0, 0, 128, 128);
      ctx.strokeStyle = "#6597ff";
      ctx.lineWidth = 4;
      ctx.strokeRect(4, 4, 120, 120);
      ctx.fillStyle = "#a9c6ff";
      ctx.font = "500 44px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(label, 64, 79);
      const t = new THREE.CanvasTexture(cvs);
      t.colorSpace = THREE.SRGBColorSpace;
      const m = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.35, 0.07),
        new THREE.MeshStandardMaterial({ map: t, roughness: 0.6 }),
      );
      icons.add(m);
    });
    props.add(icons);
    return {
      root,
      head,
      eyes,
      happy,
      left,
      right,
      base,
      card,
      magnifier,
      laptop,
      envelope,
      icons,
    };
  }
  const POSES = {
    wave: { l: -0.18, r: 2.5, head: 0 },
    point: { l: -0.35, r: 1.55, head: -0.2 },
    "hold-card": { l: -0.5, r: 1.25, head: 0.1 },
    magnifier: { l: -0.2, r: 2, head: -0.28 },
    "thumbs-up": { l: -0.2, r: 1.95, head: 0.12 },
    typing: { l: -0.8, r: 0.8, head: 0.1 },
    envelope: { l: -0.9, r: 0.9, head: 0 },
    goodbye: { l: -0.3, r: 2.5, head: 0 },
  };
  function poseFor(i, p) {
    if (i === 0) return "wave";
    if (i === 1) return "hold-card";
    if (i === 2) return ["point", "magnifier", "thumbs-up"][activeProject % 3];
    if (i === 3) return "typing";
    if (i === 4) return "point";
    return p < 0.45 ? "envelope" : "goodbye";
  }
  const scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(32, w / h, 0.1, 100);
  camera.position.z = 12;
  scene.add(new THREE.HemisphereLight(0xc6d9ff, 0x13151c, 2));
  const key = new THREE.DirectionalLight(0xffffff, 3.5);
  key.position.set(-4, 5, 7);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x5689ff, 5);
  rim.position.set(4, 2, -3);
  scene.add(rim);
  const bot = createBot();
  scene.add(bot.root);
  // Each project has its own geometric 3D study, rendered in the same WebGL context.
  function interfaceTexture(type) {
    const canvas = document.createElement("canvas");
    canvas.width = 1440;
    canvas.height = 850;
    const c = canvas.getContext("2d");
    const bg = "#0c111b",
      panel = "#141e2e",
      line = "#2a3c56",
      blue = "#8cb6ff",
      text = "#d9e5f7",
      muted = "#788eab";
    const box = (x, y, w, h, fill = panel, r = 14) => {
      c.fillStyle = fill;
      c.beginPath();
      c.roundRect(x, y, w, h, r);
      c.fill();
    };
    const txt = (t, x, y, size = 22, color = text) => {
      c.fillStyle = color;
      c.font = `${size >= 36 ? "500" : "400"} ${size}px Arial`;
      c.fillText(t, x, y);
    };
    const stroke = (x1, y1, x2, y2, color = line, width = 1) => {
      c.strokeStyle = color;
      c.lineWidth = width;
      c.beginPath();
      c.moveTo(x1, y1);
      c.lineTo(x2, y2);
      c.stroke();
    };
    box(0, 0, 1440, 850, bg, 20);
    box(0, 0, 1440, 65, "#172133", 0);
    [0, 1, 2].forEach((i) => {
      c.fillStyle = ["#657c9c", "#8097b4", "#aec1da"][i];
      c.beginPath();
      c.arc(27 + i * 25, 32, 6, 0, Math.PI * 2);
      c.fill();
    });
    txt("WORKSPACE / INTERFACE CONCEPT", 1060, 40, 15, muted);
    const name = {
      orbit: "PACE",
      core: "AURIX",
      book: "StudyFlow",
      wave: "Voice analysis",
      network: "Student wellbeing",
      blocks: "Transaction ledger",
      globe: "Travel Expert",
    }[type];
    txt(name, 44, 117, 29);
    txt("OVERVIEW", 44, 203, 15, blue);
    ["Workspace", "Activity", "Settings"].forEach((t, i) =>
      txt(t, 44, 254 + i * 48, 19, muted),
    );
    stroke(235, 65, 235, 850);
    txt(name, 285, 135, 42);
    txt(
      {
        orbit: "Generate. Review. Refine.",
        core: "Your on-device command center.",
        book: "One document. New ways to learn.",
        wave: "Listen beyond the surface.",
        network: "Understanding behavioral patterns.",
        blocks: "Every transaction leaves a trace.",
        globe: "A journey that fits you.",
      }[type],
      285,
      178,
      20,
      muted,
    );
    if (type === "orbit") {
      box(285, 220, 820, 420);
      txt("CODING WORKSPACE", 313, 264, 17, blue);
      txt("Create a document processing pipeline", 313, 315, 25);
      const code = [
        "def process_document(source):",
        "    pages = extract_text(source)",
        "    chunks = split_into_sections(pages)",
        "    return summarize(chunks)",
      ];
      code.forEach((t, i) =>
        txt(t, 318, 388 + i * 43, 24, i === 0 ? blue : "#a2b8d4"),
      );
      box(1140, 220, 260, 196);
      txt("ACTOR", 1167, 260, 17, blue);
      txt("Draft generation", 1167, 308, 22);
      box(1140, 445, 260, 196);
      txt("CRITIC", 1167, 486, 17, blue);
      txt("Review & refine", 1167, 534, 22);
      box(285, 677, 1115, 100);
      txt("Describe what you want to build...", 318, 737, 24, muted);
    }
    if (type === "core") {
      box(285, 220, 650, 430);
      txt("READY WHEN YOU ARE", 315, 265, 17, blue);
      c.strokeStyle = "#80aef0";
      c.lineWidth = 2;
      for (let i = 0; i < 4; i++) {
        c.beginPath();
        c.ellipse(610, 440, 70 + i * 24, 100 - i * 9, i * 0.65, 0, Math.PI * 2);
        c.stroke();
      }
      txt("How can I help?", 477, 604, 27);
      ["Applications", "Files & notes", "Voice & audio"].forEach((t, i) => {
        box(975, 220 + i * 151, 425, 126);
        txt(t, 1004, 265 + i * 151, 24);
        txt("LOCAL WORKSPACE", 1004, 304 + i * 151, 14, muted);
      });
      box(285, 684, 1115, 89);
      txt("Type a command or use your voice...", 315, 738, 24, muted);
    }
    if (type === "book") {
      box(285, 220, 505, 421);
      txt("YOUR DOCUMENT", 316, 264, 17, blue);
      txt("Introduction to Neural Networks", 316, 316, 24);
      for (let i = 0; i < 7; i++)
        box(317, 357 + i * 31, 420 - (i % 3) * 45, 7, "#344760", 3);
      ["Summary", "Quiz", "Flashcards", "Video lesson"].forEach((t, i) => {
        box(835 + (i % 2) * 292, 220 + Math.floor(i / 2) * 221, 270, 196);
        txt(
          String(i + 1).padStart(2, "0"),
          860 + (i % 2) * 292,
          268 + Math.floor(i / 2) * 221,
          17,
          blue,
        );
        txt(t, 860 + (i % 2) * 292, 341 + Math.floor(i / 2) * 221, 25);
      });
      box(285, 677, 1115, 98);
      txt("Ask a question about your document...", 315, 735, 24, muted);
    }
    if (type === "wave") {
      box(285, 220, 1115, 295);
      txt("AUDIO SIGNAL", 317, 260, 17, blue);
      for (let i = 0; i < 130; i++) {
        const ht =
          12 + Math.sin(i * 0.5) ** 2 * 115 * Math.sin((i / 130) * Math.PI);
        box(320 + i * 8, 369 - ht / 2, 3, ht, blue, 2);
      }
      txt("00:00", 317, 479, 17, muted);
      txt("AUDIO INPUT", 1258, 479, 15, muted);
      box(285, 550, 538, 212);
      box(861, 550, 539, 212);
      txt("Detection pipeline", 315, 594, 23);
      txt("Audio → Log-Mel → ResNet", 315, 652, 25, blue);
      txt("Support assistant", 890, 594, 23);
      txt("Questions, answers & escalation", 890, 652, 23, muted);
    }
    if (type === "network") {
      box(285, 220, 690, 540);
      txt("BEHAVIORAL GROUPING", 318, 266, 17, blue);
      for (let group = 0; group < 3; group++) {
        for (let i = 0; i < 38; i++) {
          const x = 440 + group * 145 + Math.sin(i * 2.4) * 90 * (i / 38),
            y =
              440 +
              Math.sin(group * 2) * 90 +
              Math.cos(i * 2.4) * 100 * (i / 38);
          c.fillStyle = ["#b9cce8", "#7baafb", "#47658f"][group];
          c.beginPath();
          c.arc(x, y, 4, 0, Math.PI * 2);
          c.fill();
        }
      }
      txt("ILLUSTRATIVE CLUSTER VIEW", 317, 725, 14, muted);
      ["Social engagement", "Academic habits", "Wellbeing indicators"].forEach(
        (t, i) => {
          box(1010, 220 + i * 187, 390, 160);
          txt(t, 1035, 268 + i * 187, 24);
          txt("Survey-based features", 1035, 316 + i * 187, 18, muted);
        },
      );
    }
    if (type === "blocks") {
      box(285, 220, 1115, 535);
      txt("TRANSACTION HISTORY", 318, 268, 17, blue);
      ["REFERENCE", "TRANSACTION", "STATUS", "INTEGRITY"].forEach((t, i) =>
        txt(t, 319 + i * 270, 328, 15, muted),
      );
      for (let i = 0; i < 5; i++) {
        stroke(319, 354 + i * 73, 1365, 354 + i * 73);
        txt("TX / 00" + (i + 1), 319, 403 + i * 73, 20);
        txt("Account transfer", 589, 403 + i * 73, 20);
        txt("Sample record", 859, 403 + i * 73, 19, muted);
        txt("Merkle hash", 1129, 403 + i * 73, 19, blue);
      }
    }
    if (type === "globe") {
      box(285, 220, 1115, 115);
      txt("Nature", 317, 266, 24);
      txt("YOUR INTEREST", 317, 302, 14, muted);
      txt("Mild climate", 640, 266, 24);
      txt("YOUR PREFERENCE", 640, 302, 14, muted);
      txt("Moderate", 1040, 266, 24);
      txt("YOUR BUDGET", 1040, 302, 14, muted);
      ["Hunza", "Kyoto", "Interlaken"].forEach((t, i) => {
        let x = 285 + i * 378;
        box(x, 370, 354, 389);
        txt("0" + (i + 1), x + 26, 415, 18, blue);
        txt(t, x + 26, 487, 39);
        txt(["Pakistan", "Japan", "Switzerland"][i], x + 26, 533, 21, muted);
        stroke(x + 26, 573, x + 328, 573);
        txt("Stay · Dining · Travel", x + 26, 620, 18);
        txt("Explore recommendation", x + 26, 709, 19, blue);
      });
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return texture;
  }
  function projectScene(type) {
    const s = new THREE.Scene();
    s.add(new THREE.HemisphereLight(0xcbdcff, 0x1b2541, 2));
    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(-3, 5, 7);
    s.add(light);
    const g = new THREE.Group();
    s.add(g);
    const frame = rounded(4.4, 2.62, 0.1, 0.09, mats.edge);
    g.add(frame);
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(4.27, 2.52),
      new THREE.MeshBasicMaterial({ map: interfaceTexture(type) }),
    );
    add(g, screen, 0, 0, 0.095);
    const lip = rounded(4.55, 0.11, 0.24, 0.035, mats.edge);
    add(g, lip, 0, -1.38, 0.025);
    const stand = rounded(1.15, 0.11, 0.62, 0.04, mats.edge);
    add(g, stand, 0, -1.52, -0.05);
    g.rotation.x = -0.08;
    return {
      scene: s,
      group: g,
      camera: new THREE.PerspectiveCamera(34, 2.9, 0.1, 30),
    };
  }
  const artScenes = projects.map((p) => projectScene(p.type));
  artScenes.forEach((x) => (x.camera.position.z = 6.7));
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: $("#world"),
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
    renderer.setSize(w, h);
    renderer.setClearColor(0, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.autoClear = false;
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    environmentTarget = pmrem.fromScene(room, 0.06);
    const env = environmentTarget.texture;
    scene.environment = env;
    artScenes.forEach((a) => (a.scene.environment = env));
    room.dispose();
    pmrem.dispose();
  } catch (e) {
    $("#webgl-fallback").hidden = false;
    $("#world").style.display = "none";
  }
  listen(
    window,
    "resize",
    () => {
      w = innerWidth;
      h = innerHeight;
      mobile = w <= 760;
      if (renderer) {
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
    },
    { passive: true },
  );
  function targetFor(i, p) {
    const left = Math.max(70, (w - 1160) / 2);
    return [
      { x: w - 90, y: h - 105, size: 125 },
      { x: left + 105, y: h * 0.64, size: 160 },
      { x: w - Math.max(105, (w - 1180) / 2 + 80), y: h * 0.65, size: 160 },
      { x: w - 82, y: h * 0.62, size: 125 },
      { x: w * 0.39, y: mix(h * 0.5, h * 0.72, p), size: 155 },
      { x: w * 0.85, y: h * 0.7, size: 145 },
    ][i];
  }
  let lastFrame = 0;
  function render(now) {
    if (stopped) return;
    frameId = requestAnimationFrame(render);
    if (document.hidden) return;
    if (now - lastFrame < 24) return;
    lastFrame = now;
    pageUpdate(now);
    const t = now * 0.001;
    let target = targetFor(section, stageProgress);
    let poseName = poseFor(section, stageProgress),
      pose = POSES[poseName];
    let boundary = 0;
    if (section > 0) {
      const start = sections[section].offsetTop - h * 0.38;
      boundary = clamp((scroll - start) / (h * 0.45));
      const prev = targetFor(section - 1, 1),
        f = ease(boundary);
      target = {
        x: mix(prev.x, target.x, f),
        y: mix(prev.y, target.y, f) - Math.sin(f * Math.PI) * h * 0.1,
        size: mix(prev.size, target.size, f),
      };
    }
    if (mobile) {
      target = { x: 65, y: h - 66, size: 76 };
    }
    if (reduce) {
      target = { x: mobile ? 65 : w - 90, y: h - 65, size: mobile ? 76 : 95 };
      poseName = "wave";
      pose = POSES.wave;
    }
    const scale = target.size / 3.05;
    const worldHeight = 2 * Math.tan(THREE.MathUtils.degToRad(16)) * 12,
      unit = worldHeight / h;
    bot.root.position.set(
      (target.x - w / 2) * unit,
      (h / 2 - target.y) * unit,
      0,
    );
    let squash = reduce ? 1 : 1 - Math.sin(boundary * Math.PI) * 0.07;
    bot.root.scale.set(
      (scale * unit) / squash,
      scale * unit * squash,
      scale * unit,
    );
    bot.root.rotation.set(
      0.025,
      reduce ? 0 : (section === 2 ? -0.16 : -0.12) + mouse.x * 0.045,
      reduce ? 0 : Math.sin(stageProgress * Math.PI * 2) * 0.045,
    );
    if (!reduce) bot.root.position.y += Math.sin(t * 2.094) * 0.018;
    bot.head.rotation.set(
      reduce ? 0 : mouse.y * 0.06,
      reduce ? 0 : (hoverCard ? -0.4 : pose.head) + mouse.x * 0.13,
      reduce ? 0 : Math.sin(stageProgress * Math.PI * 2) * 0.04,
    );
    const previousPose = POSES[poseFor(Math.max(0, section - 1), 1)];
    const blend = section === 0 ? 1 : ease(boundary);
    bot.left.rotation.z = mix(previousPose.l, pose.l, blend);
    bot.right.rotation.z = mix(previousPose.r, pose.r, blend);
    if (!reduce && (poseName === "wave" || poseName === "goodbye" || hoverBot))
      bot.right.rotation.z =
        2.3 + Math.sin(hoverBot ? t * 7 : stageProgress * 28) * 0.16;
    if (!reduce && poseName === "typing") {
      bot.left.rotation.x = -0.8 + Math.sin(stageProgress * 110) * 0.1;
      bot.right.rotation.x = -0.8 + Math.cos(stageProgress * 110) * 0.1;
    } else {
      bot.left.rotation.x = 0;
      bot.right.rotation.x = 0;
    }
    bot.eyes.forEach((eye, i) => {
      eye.scale.y = reduce ? 1 : t % 5.2 > 5.05 ? 0.08 : 1;
      eye.position.x =
        (i === 0 ? -0.27 : 0.27) + (reduce ? 0 : mouse.x * 0.025);
    });
    bot.happy.visible = section === 5 && !reduce;
    bot.eyes.forEach((e) => (e.visible = !bot.happy.visible));
    [bot.card, bot.magnifier, bot.laptop, bot.envelope, bot.icons].forEach(
      (p) => (p.visible = false),
    );
    if (!reduce) {
      if (poseName === "hold-card") {
        bot.card.visible = true;
        bot.card.position.set(1.08, 0.15, 0.4);
        bot.card.rotation.z = -0.12;
      }
      if (poseName === "magnifier") {
        bot.magnifier.visible = true;
        bot.magnifier.position.set(0.92, 0.92, 0.7);
      }
      if (poseName === "typing") {
        bot.laptop.visible = true;
        bot.laptop.position.set(0, -0.6, 0.8);
        bot.icons.visible = true;
        bot.icons.children.forEach((icon, i) => {
          const a = stageProgress * 9 + i * 2.1;
          icon.position.set(
            Math.cos(a) * 1.25,
            1.7 + Math.sin(a) * 0.3,
            Math.sin(a) * 0.4,
          );
          icon.rotation.y = a * 0.3;
        });
      }
      if (poseName === "envelope") {
        bot.envelope.visible = true;
        bot.envelope.position.set(0, -0.2, 0.85);
      }
    }
    [bot.card, bot.magnifier, bot.laptop, bot.envelope, bot.icons].forEach(
      (p) =>
        p.scale.setScalar(Math.max(0.001, section === 0 ? 1 : ease(boundary))),
    );
    const ui = $("#bot-ui"),
      uw = mobile ? 80 : target.size * 0.7,
      uh = mobile ? 90 : target.size;
    ui.style.width = uw + "px";
    ui.style.height = uh + "px";
    ui.style.transform = `translate(${clamp(target.x - uw / 2, 12, w - uw - 12)}px,${target.y - uh / 2}px)`;
    $(".speech").style.marginLeft = mobile
      ? "0px"
      : Math.min(0, w - 18 - target.x - 123) + "px";
    if (!renderer) return;
    renderer.setScissorTest(false);
    renderer.setViewport(0, 0, w, h);
    renderer.clear();
    renderer.render(scene, camera);
    const vp = $(".project-viewport").getBoundingClientRect();
    cards.forEach((card, i) => {
      const rect = card.querySelector(".project-art").getBoundingClientRect();
      const left = Math.max(rect.left, vp.left, 0),
        right = Math.min(rect.right, mobile ? w : vp.right, w),
        top = Math.max(rect.top, 0),
        bottom = Math.min(rect.bottom, h);
      if (right <= left || bottom <= top) return;
      const art = artScenes[i];
      art.camera.aspect = rect.width / rect.height;
      art.camera.position.z = Math.max(
        6.1,
        4.5 / (2 * Math.tan((17 * Math.PI) / 180) * art.camera.aspect),
      );
      art.camera.updateProjectionMatrix();
      art.group.rotation.y = reduce
        ? -0.09
        : -0.11 + Math.sin(stageProgress * 3 + i) * 0.09;
      art.group.rotation.x = -0.035;
      art.group.rotation.z = -0.015;
      renderer.setScissorTest(true);
      renderer.setScissor(left, h - bottom, right - left, bottom - top);
      renderer.setViewport(rect.left, h - rect.bottom, rect.width, rect.height);
      renderer.clearDepth();
      renderer.render(art.scene, art.camera);
    });
    renderer.setScissorTest(false);
  }
  frameId = requestAnimationFrame(render);

  return () => {
    stopped = true;
    cancelAnimationFrame(frameId);
    abort.abort();
    const geometries = new Set();
    const materials = new Set();
    const textures = new Set();
    for (const currentScene of [scene, ...artScenes.map((art) => art.scene)]) {
      currentScene.traverse((object) => {
        if (object.geometry) geometries.add(object.geometry);
        const list = Array.isArray(object.material)
          ? object.material
          : [object.material];
        list.filter(Boolean).forEach((material) => {
          materials.add(material);
          Object.values(material).forEach((value) => {
            if (value?.isTexture) textures.add(value);
          });
        });
      });
    }
    textures.forEach((texture) => texture.dispose());
    materials.forEach((material) => material.dispose());
    geometries.forEach((geometry) => geometry.dispose());
    environmentTarget?.dispose();
    renderer?.dispose();
  };
}
