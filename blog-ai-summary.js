/**
 * Adotrip AI Summary Script
 * Uses existing styles from style.css.
 * Reads content dynamically in frontend from #eventFestivalsDetailTabContent.
 * Injects AI Overview markup into the page using innerHTML.
 */
(function () {
  "use strict";

  if (window.__ADO_AI_SUMMARY_INITIALIZED__) return;
  window.__ADO_AI_SUMMARY_INITIALIZED__ = true;

  /* ---- CONFIG (Loaded from window.env / .env with fallback) ---- */
  function getGroqKey() {
    return (typeof window !== "undefined" && window.env && window.env.GROQ_API_KEY) ||
           (typeof process !== "undefined" && process.env && process.env.GROQ_API_KEY) ||
           GROQ_KEY ||
           "";
  }

  let GROQ_KEY = (typeof window !== "undefined" && window.env && window.env.GROQ_API_KEY) ||
                 (typeof process !== "undefined" && process.env && process.env.GROQ_API_KEY) ||
                 "";
  const CHAT_MODEL = (typeof window !== "undefined" && window.env && window.env.GROQ_CHAT_MODEL) ||
                     (typeof process !== "undefined" && process.env && process.env.GROQ_CHAT_MODEL) ||
                     "openai/gpt-oss-120b";
  const API = (typeof window !== "undefined" && window.env && window.env.GROQ_API_BASE) ||
              (typeof process !== "undefined" && process.env && process.env.GROQ_API_BASE) ||
              "https://api.groq.com/openai/v1";

  // Async loader to parse local .env file if running in static local development environment
  async function loadEnvConfig() {
    if (window.env && window.env.GROQ_API_KEY) {
      GROQ_KEY = window.env.GROQ_API_KEY;
      return;
    }
    // Only attempt local .env fetch if on localhost / 127.0.0.1 to prevent 404 errors on deployed sites
    const isLocalHost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1" || window.location.protocol === "file:";
    if (!isLocalHost) return;

    try {
      const res = await fetch(".env");
      if (res.ok) {
        const text = await res.text();
        const lines = text.split("\n");
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith("#")) {
            const [k, ...v] = trimmed.split("=");
            const key = k ? k.trim() : "";
            const val = v ? v.join("=").trim().replace(/^["']|["']$/g, "") : "";
            if (key === "GROQ_API_KEY" && val) GROQ_KEY = val;
          }
        }
      }
    } catch (_) {}
  }

  /* ---- INLINE CSS STYLES (SELF-CONTAINED) ---- */
  const aiStyles = `
    :root {
      --bg: #ffffff;
      --bg-rgb: 255,255,255;
      --fg: #1c1c1e;
      --mute: #6b6b70;
      --line: #e6e6ea;
      --soft: #f5f6f8;
      --acc: #2457d6;
      --btn-yellow: #FEE403;
      --btn-yellow-hover: #ebd200;
      --btn-yellow-fg: #141416;
    }
    @media(prefers-color-scheme:dark){
      :root {
        --bg: #121214;
        --bg-rgb: 18,18,20;
        --fg: #ececef;
        --mute: #9a9aa2;
        --line: #2a2a2f;
        --soft: #1c1c21;
        --acc: #5e8cff;
      }
    }
    body.modal-open { overflow: hidden !important; }

    /* AI Overview Card */
    #ai {
      position: relative;
      z-index: 0;
      border: 1px solid rgba(36,87,214,0.18);
      background: linear-gradient(180deg, rgba(var(--bg-rgb),0.92) 0%, var(--soft) 100%);
      border-radius: 22px;
      padding: 22px 24px;
      margin: 20px 0 24px;
      box-shadow: 0 12px 36px rgba(36,87,214,0.07), 0 2px 6px rgba(0,0,0,0.03);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      overflow: hidden;
      font-family: system-ui, -apple-system, sans-serif;
      color: var(--fg);
      box-sizing: border-box;
      transition: border-color 0.4s ease, box-shadow 0.4s ease;
    }
    #ai * { box-sizing: border-box; }

    /* Animated 1px Rainbow Border & Blur Glow on Generating */
    #ai::before {
      content: "";
      position: absolute;
      inset: -150%;
      background: conic-gradient(from 0deg, #ff004c, #ff7a00, #ffe600, #00d639, #00cfff, #0066ff, #ff00a8, #ff004c);
      opacity: 0;
      transition: opacity 0.4s ease;
      animation: aiRotateConic 4s linear infinite;
      pointer-events: none;
      z-index: 0;
    }
    #ai::after {
      content: "";
      position: absolute;
      inset: 1px;
      background: linear-gradient(180deg, rgba(var(--bg-rgb),0.98) 0%, var(--soft) 100%);
      border-radius: 21px;
      z-index: 0;
      pointer-events: none;
    }
    #ai > * {
      position: relative;
      z-index: 1;
    }
    #ai.generating::before {
      opacity: 1;
      filter: blur(1px);
    }
    @keyframes aiRotateConic {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .modal-handle { display: none; }

    .ai-h {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 700;
      font-size: 15px;
      margin-bottom: 14px;
      gap: 10px;
    }
    .ai-badge {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 24px;
      background: var(--bg);
      color: var(--fg);
      font-size: 13px;
      font-weight: 700;
      z-index: 1;
    }
    .ai-badge::before {
      content: "";
      position: absolute;
      inset: -2px;
      border-radius: 26px;
      padding: 2px;
      background: linear-gradient(135deg, #ff004c, #ff7a00, #ffe600, #00d639, #00cfff, #0066ff, #7a00ff, #ff00a8);
      background-size: 300% 300%;
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
      animation: aiRainbowBorder 4s linear infinite;
    }
    .ai-badge.generating::before {
      animation: aiRainbowBorder 1.5s linear infinite;
      filter: drop-shadow(0 0 8px rgba(0,223,216,0.6));
    }
    .ai-badge i {
      font-size: 13px;
      color: var(--fg);
      animation: aiSparkle 3s ease infinite;
    }
    .ai-badge.generating i {
      color: #ff007f;
      animation: aiSpin 5s linear infinite;
    }
    @keyframes aiRainbowBorder {
      0%{background-position:0% 50%}
      50%{background-position:100% 50%}
      100%{background-position:0% 50%}
    }
    @keyframes aiSparkle {
      0%,100%{transform:scale(1) rotate(0deg)}
      50%{transform:scale(1.18) rotate(12deg)}
    }
@keyframes aiSpin {
  0% {
    transform: rotate(45deg);
  }
  50% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(45deg);
  }
}
    .ai-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .btn-audio-tts {
      background: var(--soft);
      border: 1px solid var(--line);
      color: var(--fg);
      font-size: 13px;
      width: 32px;
      height: 32px;
      cursor: pointer;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      position: relative;
    }
    .btn-audio-tts:hover {
      background: var(--line);
      transform: scale(1.05);
    }
    .btn-audio-tts.playing {
      background: var(--btn-yellow);
      color: var(--btn-yellow-fg);
      border-color: var(--btn-yellow);
      animation: aiAudioPulse 1.8s ease-in-out infinite;
    }
    @keyframes aiAudioPulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(254, 228, 0, 0.45); }
      50% { box-shadow: 0 0 0 7px rgba(254, 228, 0, 0); }
    }
    .btn-close-modal {
      display: none;
      background: var(--soft);
      border: 1px solid var(--line);
      color: var(--mute);
      font-size: 15px;
      width: 32px;
      height: 32px;
      cursor: pointer;
      border-radius: 50%;
      align-items: center;
      justify-content: center;
    }

    /* Chips */
    .ai-chips {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding: 2px 2px 10px;
      margin-bottom: 12px;
      scrollbar-width: none;
    }
    .ai-chips::-webkit-scrollbar { display: none; }
    .ai-chip {
      flex-shrink: 0;
      padding: 8px 14px;
      font-size: 12px;
      font-weight: 600;
      border-radius: 20px;
      background: var(--bg);
      border: 1px solid var(--line);
      color: var(--fg);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.18s ease;
    }
    .ai-chip:hover {
      color: var(--btn-yellow-fg);
      border-color: var(--btn-yellow-hover);
      background: var(--btn-yellow);
      box-shadow: 0 2px 8px rgba(254,228,3,0.22);
      transform: translateY(-1px);
    }

    /* Summary highlights */
    .ai-summary-header {
      font-size: 11.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--acc);
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .ai-overview-lead {
      font-size: 14.5px;
      line-height: 1.65;
      color: var(--fg);
      margin-bottom: 12px;
      font-weight: 500;
    }
    .ai-bullets {
      list-style: none;
      padding: 0;
      margin: 0 0 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .ai-bullets li {
      position: relative;
      padding-left: 18px;
      font-size: 14px;
      line-height: 1.6;
      color: var(--fg);
    }
    .ai-bullets li::before {
      content: "";
      position: absolute;
      left: 3px;
      top: 8px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--acc);
      box-shadow: 0 0 0 2px rgba(36,87,214,0.2);
    }

    /* Skeleton */
    .ai-skeleton {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 4px 0 12px;
    }
    .ai-skeleton-line {
      height: 14px;
      border-radius: 6px;
      background: linear-gradient(90deg, rgba(var(--bg-rgb),0.5), rgba(36,87,214,0.12), rgba(var(--bg-rgb),0.5));
      background-size: 200% 100%;
      animation: aiSkeletonShimmer 1.5s infinite;
    }
    .ai-skeleton-line.short { width: 65%; }
    .ai-skeleton-line.med { width: 82%; }
    .ai-skeleton-line.long { width: 96%; }
    @keyframes aiSkeletonShimmer {
      0%{background-position:200% 0}
      100%{background-position:-200% 0}
    }

    /* Owl Carousel / Package Carousel Section */
    .ai-swiper-section {
      display: none;
      margin-top: 16px;
      padding-top: 14px;
      border-top: 1px solid var(--line);
    }
    .ai-swiper-section.visible { display: block; }
    .ai-section-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--mute);
      margin-bottom: 12px;
    }
    .ai-section-title span { display: flex; align-items: center; gap: 6px; }
    .ai-section-title i { color: var(--acc); }

    /* Owl Carousel container & item styling */
    .owl-carousel.pkg-owl-carousel {
      width: 100%;
      position: relative;
    }
    .owl-carousel.pkg-owl-carousel .owl-stage-outer {
      padding: 4px 0 12px;
      overflow: hidden;
    }
    .owl-carousel.pkg-owl-carousel .owl-stage {
      display: flex !important;
      align-items: stretch;
      gap: 0;
    }
    .owl-carousel.pkg-owl-carousel .owl-item {
      display: flex;
    }
    .owl-carousel.pkg-owl-carousel .owl-item .item {
      width: 100%;
      display: flex;
    }
    .owl-carousel.pkg-owl-carousel .owl-dots {
      display: none !important;
    }
    .owl-carousel.pkg-owl-carousel .owl-nav button.owl-prev,
    .owl-carousel.pkg-owl-carousel .owl-nav button.owl-next {
      position: absolute;
      top: 40%;
      transform: translateY(-50%);
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--bg);
      border: 1px solid var(--line);
      box-shadow: 0 4px 10px rgba(0,0,0,0.12);
      color: var(--fg);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      cursor: pointer;
      z-index: 5;
      transition: all 0.2s ease;
    }
    .owl-carousel.pkg-owl-carousel .owl-nav button.owl-prev:hover,
    .owl-carousel.pkg-owl-carousel .owl-nav button.owl-next:hover {
      background: var(--btn-yellow);
      color: var(--btn-yellow-fg);
      border-color: transparent;
    }
    .owl-carousel.pkg-owl-carousel .owl-nav button.owl-prev { left: -8px; }
    .owl-carousel.pkg-owl-carousel .owl-nav button.owl-next { right: -8px; }

    .pkg-card {
      background: var(--bg);
      border: 1px solid var(--line);
      border-radius: 12px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.03);
      transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    }
    .pkg-card:hover {
      border-color: var(--acc);
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(36,87,214,0.1);
    }
    .pkg-img-wrap {
      position: relative;
      width: 100%;
      aspect-ratio: 1 / 1;
      overflow: hidden;
      background: var(--soft);
    }
    .pkg-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.3s ease;
    }
    .pkg-card:hover .pkg-img {
      transform: scale(1.04);
    }
    .pkg-tag {
      position: absolute;
      top: 6px; left: 6px;
      font-size: 9.5px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 10px;
      background: rgba(0,0,0,0.72);
      color: #fff;
      backdrop-filter: blur(4px);
    }
    .pkg-tag.offer { background: linear-gradient(135deg, #e11d48, #f43f5e); }
    .pkg-body {
      padding: 8px 10px 10px;
      display: flex;
      flex-direction: column;
      gap: 3px;
      flex: 1;
    }
    .pkg-title {
      font-size: 13px;
      font-weight: 700;
      color: var(--fg);
      line-height: 1.3;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .pkg-sub {
      font-size: 11px;
      color: var(--mute);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .pkg-foot {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: auto;
      padding-top: 6px;
    }
    .pkg-price {
      font-size: 17px;
      font-weight: 600;
      color: var(--dark);
    }
    .pkg-price span {
      font-size: 10.5px;
      font-weight: 400;
      color: var(--mute);
    }
    .pkg-btn {
      font-size: 17px;
      font-weight: 700;
      padding: 5px 12px;
      border-radius: 14px;
      background: var(--btn-yellow);
      color: var(--btn-yellow-fg);
      border: none;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
    }
    .pkg-btn:hover { background: var(--btn-yellow-hover); }

    /* Q&A chat message styling */
    .qa {
      margin-top: 14px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .qa b {
      align-self: flex-end;
      display: inline-flex;
      align-items: center;
      background: var(--btn-yellow);
      color: var(--btn-yellow-fg);
      padding: 7px 14px;
      border-radius: 18px 18px 4px 18px;
      font-size: 13.5px;
      font-weight: 600;
      box-shadow: 0 2px 6px rgba(0,0,0,0.06);
      max-width: 85%;
      word-break: break-word;
    }
    .qa b span { display: inline-block; }
    .ans {
      align-self: flex-start;
      background: var(--bg);
      border: 1px solid var(--line);
      border-radius: 18px 18px 18px 4px;
      padding: 12px 16px;
      font-size: 13.5px;
      line-height: 1.65;
      color: var(--fg);
      box-shadow: 0 2px 8px rgba(0,0,0,0.03);
      max-width: 95%;
      box-sizing: border-box;
    }
    .ai-ans-p {
      margin: 0 0 8px 0;
    }
    .ai-ans-p:last-child {
      margin-bottom: 0;
    }
    .ai-ans-bullets {
      list-style: none;
      padding: 0;
      margin: 6px 0 6px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .ai-ans-bullets li {
      position: relative;
      padding-left: 16px;
      font-size: 13.5px;
      line-height: 1.6;
      color: var(--fg);
    }
    .ai-ans-bullets li::before {
      content: "";
      position: absolute;
      left: 2px;
      top: 8px;
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--acc);
      box-shadow: 0 0 0 2px rgba(36,87,214,0.18);
    }

    .ai-offers-container {
      margin-top: 10px;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      width: 100%;
    }
    .ai-offer-card {
      display: block;
      overflow: hidden;
      border-radius: 14px;
      border: 1px solid rgba(0,0,0,0.08);
      box-shadow: 0 3px 10px rgba(0,0,0,0.05);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      background: #fff;
    }
    .ai-offer-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(0,0,0,0.1);
    }
    .ai-offer-card img {
      width: 100%;
      height: auto;
      display: block;
      object-fit: cover;
      border-radius: 14px;
    }
    @media (max-width: 576px) {
      .ai-offers-container {
        grid-template-columns: 1fr;
      }
    }

    /* AI Curating Simulation Animation (Clean, Centered, Rainbow, No borders/shadows/circular bg) */
    .ai-curating-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 12px;
      padding: 16px 8px;
      margin: 8px auto;
      width: 100%;
      box-sizing: border-box;
      border: none !important;
      box-shadow: none !important;
      background: transparent !important;
      animation: aiFadeIn 0.3s ease-out;
    }
    .ai-curating-header {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 650;
      letter-spacing: -0.01em;
      background: linear-gradient(90deg, #ff004c, #ff7a00, #ffe600, #00d639, #00cfff, #0066ff, #ff00a8);
      background-size: 250% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: aiRainbowText 3.5s linear infinite;
    }
    .ai-curating-header i {
      -webkit-text-fill-color: initial;
      color: #ff7a00;
      font-size: 13px;
      animation: aiSparkle 2s ease infinite;
    }
    .ai-curating-step-text {
      font-size: 12.5px;
      color: var(--mute);
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      min-height: 22px;
      transition: opacity 0.3s ease, transform 0.3s ease;
      font-weight: 500;
    }
    .ai-curating-progress {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 10px;
    }
    .ai-curating-bar {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      position: relative;
      background: conic-gradient(from 0deg, #ff004c, #ff7a00, #ffe600, #00d639, #00cfff, #0066ff, #ff00a8, #ff004c);
      padding: 3.5px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: aiCircularSpin 1.4s linear infinite;
    }
    .ai-curating-bar::before {
      content: "";
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: var(--bg);
      display: block;
    }
    @keyframes aiCircularSpin {
      100% { transform: rotate(360deg); }
    }
    @keyframes aiFadeIn {
      from { opacity: 0; transform: translateY(4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* Q Form */
    .q {
      display: flex;
      gap: 8px;
      margin-top: 14px;
      position: relative;
    }
    .q input {
      flex: 1;
      min-width: 0;
      border: 1px solid var(--line);
      background: var(--bg);
      color: var(--fg);
      border-radius: 24px;
      padding: 10px 16px;
      font: inherit;
      font-size: 13.5px;
      outline: none;
    }
    .q input:focus {
      border-color: var(--btn-yellow-hover);
      box-shadow: 0 0 0 3px rgba(254,228,3,0.25);
    }
    button.p {
      background: var(--btn-yellow);
      border: 1px solid var(--btn-yellow);
      color: var(--btn-yellow-fg);
      font-weight: 750;
      border-radius: 24px;
      padding: 9px 20px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 13.5px;
    }
    button.p:hover { background: var(--btn-yellow-hover); }

    /* Mobile bar & Sheet */
    .mobile-nav-bar { display: none; }
    @media (max-width: 768px) {
      .modal-overlay {
        display: block;
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.55);
        backdrop-filter: blur(4px);
        z-index: 2147483640;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
      }
      .modal-overlay.open { opacity: 1; pointer-events: auto; }
      #ai {
        position: fixed;
        left: 0; right: 0; bottom: 0;
        margin: 0;
        border-radius: 26px 26px 0 0;
        z-index: 2147483647;
        max-height: 86vh;
        padding: 12px 20px calc(20px + env(safe-area-inset-bottom, 0px));
        transform: translateY(105%);
        transition: transform 0.38s cubic-bezier(0.2, 0.9, 0.25, 1);
        display: flex;
        flex-direction: column;
      }
      #ai.open { transform: translateY(0); }
      .modal-handle {
        display: block;
        width: 46px;
        height: 5px;
        border-radius: 10px;
        background: var(--mute);
        opacity: 0.25;
        margin: 2px auto 14px;
      }
      .btn-close-modal { display: inline-flex; }
      .ai-content-scroll { overflow-y: auto; flex: 1; margin-bottom: 12px; }
      .q { margin-top: auto; padding-top: 12px; border-top: 1px solid var(--line); }

      .mobile-nav-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: fixed;
        bottom: 0; left: 0; right: 0;
        z-index: 500;
        background: rgba(var(--bg-rgb),0.96);
        backdrop-filter: blur(20px);
        border-top: 1px solid var(--line);
        border-radius: 24px 24px 0 0;
        box-shadow: 0 -6px 25px rgba(0,0,0,0.08);
        padding: 14px 20px calc(14px + env(safe-area-inset-bottom, 0px));
        cursor: pointer;
      }
      .mobile-nav-left { display: flex; align-items: center; gap: 10px; }
      .mobile-nav-icon { width: 34px; height: 34px; font-size: 14px; display: flex; align-items: center; justify-content: center; }
      .mobile-nav-title { font-size: 15px; font-weight: 700; color: var(--fg); }
      .mobile-nav-arrow {
        width: 36px; height: 36px;
        border-radius: 50%;
        border: 1px solid var(--line);
        display: flex; align-items: center; justify-content: center;
      }
      /* Hide Go To Top Button on Mobile */
      #goToTopBtn,
      .go-to-top-btn {
        display: none !important;
      }
    }
  `;

  // Inject style tag into document head
  if (!document.getElementById("ado-ai-inline-style")) {
    const styleEl = document.createElement("style");
    styleEl.id = "ado-ai-inline-style";
    styleEl.textContent = aiStyles;
    document.head.appendChild(styleEl);
  }

  // Ensure Font Awesome is loaded
  if (!document.querySelector('link[href*="font-awesome"]')) {
    const faLink = document.createElement("link");
    faLink.rel = "stylesheet";
    faLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";
    document.head.appendChild(faLink);
  }

  // Ensure Owl Carousel CSS is loaded
  if (!document.querySelector('link[href*="owl.carousel"]')) {
    const owlCss = document.createElement("link");
    owlCss.rel = "stylesheet";
    owlCss.href = "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.carousel.min.css";
    document.head.appendChild(owlCss);

    const owlTheme = document.createElement("link");
    owlTheme.rel = "stylesheet";
    owlTheme.href = "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/assets/owl.theme.default.min.css";
    document.head.appendChild(owlTheme);
  }

  // Ensure Owl Carousel JS is loaded
  if (typeof jQuery !== "undefined" && typeof jQuery.fn.owlCarousel === "undefined") {
    const owlJs = document.createElement("script");
    owlJs.src = "https://cdnjs.cloudflare.com/ajax/libs/OwlCarousel2/2.3.4/owl.carousel.min.js";
    document.head.appendChild(owlJs);
  }

  /* ---- DATA EXTRACTION (FRONTEND ONLY) ---- */
  function extractPageData() {
    const tabContentEl = document.getElementById("eventFestivalsDetailTabContent");
    const blogEl = document.getElementById("blog") || document.querySelector("article");

    let extractedText = "";
    const packages = [];

    if (tabContentEl) {
      // 1. Text from info tab
      const infoPane = tabContentEl.querySelector("#info") || tabContentEl;
      extractedText = infoPane ? infoPane.innerText.trim() : "";

      // 2. Extract holiday packages and hotel cards directly from frontend DOM
      const cardEls = tabContentEl.querySelectorAll(".holiday-card, .package-box");
      cardEls.forEach(card => {
        const titleEl = card.querySelector("h5, h4, .pkg-title");
        const priceEl = card.querySelector("h4, .pkg-price");
        const tagEl = card.querySelector(".badge, .pkg-tag");
        const imgEl = card.querySelector("img");
        const linkEl = card.querySelector("a");

        const title = titleEl ? titleEl.innerText.trim() : "";
        const price = priceEl ? priceEl.innerText.trim() : "";
        const tag = tagEl ? tagEl.innerText.trim() : "";
        const img = imgEl ? (imgEl.getAttribute("src") || "") : "";
        const link = linkEl ? (linkEl.getAttribute("href") || "#") : "#";

        if (title) {
          packages.push({ title, price, tag, img, link });
        }
      });
    } else if (blogEl) {
      extractedText = blogEl.innerText ? blogEl.innerText.trim() : "";
    } else {
      extractedText = (document.querySelector("main") || document.body).innerText.slice(0, 4000);
    }

    // Fallbacks if no cards found in DOM
    if (packages.length === 0) {
      packages.push(
        {
          title: "Classic Tour Circuit",
          price: "₹24,999",
          tag: "6N / 7D",
          img: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=400&q=80",
          link: "#"
        },
        {
          title: "Luxury Camp & Glamping",
          price: "₹8,499",
          tag: "2N / 3D",
          img: "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=400&q=80",
          link: "#"
        },
        {
          title: "Scenic Adventure Trail",
          price: "₹18,500",
          tag: "4N / 5D",
          img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
          link: "#"
        }
      );
    }

    return {
      text: extractedText.slice(0, 6000),
      packages: packages
    };
  }

  /* ---- INJECT AI SUMMARY HTML USING innerHTML & STYLE.CSS CLASSES ---- */
  function injectAiSummary() {
    const tabContentEl = document.getElementById("eventFestivalsDetailTabContent");
    const target = tabContentEl || document.getElementById("blog") || document.querySelector("main") || document.body;
    if (!target) return;

    const data = extractPageData();

    // Generate package slide items for Owl Carousel
    let slidesHtml = "";
    data.packages.forEach(pkg => {
      slidesHtml += `
        <div class="item">
          <div class="pkg-card">
            <div class="pkg-img-wrap">
              <img src="${pkg.img || 'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=400&q=80'}" alt="${pkg.title}" class="pkg-img" loading="lazy">
              <span class="pkg-tag ${pkg.tag ? 'offer' : ''}">${pkg.tag || 'Special'}</span>
            </div>
            <div class="pkg-body">
              <h4 class="pkg-title">${pkg.title}</h4>
              <div class="pkg-sub">
                <span><i class="fa-regular fa-clock"></i> ${pkg.tag || 'Curated'}</span>
              </div>
              <div class="pkg-foot">
                <div class="pkg-price">${pkg.price || 'Best Price'} <span>/person</span></div>
                <a href="${pkg.link || '#'}" class="pkg-btn" target="_blank" style="text-decoration:none;display:inline-block;text-align:center;">Book</a>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    const aiSummaryHtml = `
      <!-- Backdrop overlay for mobile AI modal -->
      <div class="modal-overlay" id="aiModalOverlay" aria-hidden="true"></div>

      <!-- AI Overview Card (Desktop inline / Mobile bottom sheet modal) -->
      <section id="ai" aria-live="polite">
        <div class="modal-handle" aria-hidden="true"></div>
        <div class="ai-h">
          <div class="ai-badge">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            <span>AI Overview</span>
          </div>
          <div class="ai-actions">
            <button id="btnAudioTts" class="btn-audio-tts" type="button" aria-label="Listen to AI Summary" title="Listen to summary">
              <i class="fa-solid fa-volume-high"></i>
            </button>
            <button id="closeAiModal" class="btn-close-modal" type="button" aria-label="Close AI Summary modal" title="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <!-- Quick action chips -->
        <div class="ai-chips">
          <button type="button" class="ai-chip" id="chipPackages">
            <i class="fa-solid fa-compass"></i> Packages & Stays
          </button>
          <button type="button" class="ai-chip" id="chipOffers">
            <i class="fa-solid fa-gift"></i> Offers & Discounts
          </button>
          <button type="button" class="ai-chip" id="chipBestTime">
            <i class="fa-regular fa-calendar-check"></i> Best Time & Highlights
          </button>
        </div>

        <div class="ai-content-scroll">
          <!-- AI Highlights section -->
          <div id="highlightsSection">
            <div class="ai-summary-header">
              <i class="fa-solid fa-wand-magic-sparkles"></i>Highlights
            </div>
            <div class="ai-overview-lead" id="leadOverview"></div>
            <ul class="ai-bullets" id="bulletList"></ul>
          </div>

          <div id="out"></div>
          <div id="log"></div>
          <div class="err" id="err"></div>

          <!-- Owl Carousel section for packages & offers -->
          <div class="ai-swiper-section" id="pkgSection">
            <div class="ai-section-title">
              <span><i class="fa-solid fa-compass"></i> Handpicked Packages & Offers</span>
            </div>
            <div class="owl-carousel owl-theme pkg-owl-carousel" id="pkgCarouselContainer">
              ${slidesHtml}
            </div>
          </div>
        </div>

        <!-- AI Q&A Form -->
        <div class="q d-none">
          <input id="q" placeholder="Ask about travel details, packages, offers..." aria-label="Ask a question">
          <button id="ask" class="p" type="button" aria-label="Ask question">
            <i class="fa-solid fa-paper-plane"></i>
            <span>Ask</span>
          </button>
        </div>
      </section>

      <!-- Mobile Bottom Floating Bar (Tap anywhere to open AI Summary) -->
      <div class="mobile-nav-bar" id="mobileNavBar" role="button" tabindex="0" aria-label="Open Ado AI Summary">
        <div class="mobile-nav-left">
          <div class="ai-badge">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            <span>AI Overview</span>
          </div>
        </div>
        <div class="mobile-nav-arrow" aria-hidden="true">
          <i class="fa-solid fa-arrow-up" style="transform: rotate(45deg);"></i>
        </div>
      </div>
    `;

    // Create wrapper and inject via innerHTML
    const container = document.createElement("div");
    container.id = "ado-ai-summary-wrapper";
    container.innerHTML = aiSummaryHtml;

    if (tabContentEl) {
      tabContentEl.insertBefore(container, tabContentEl.firstChild);
    } else {
      target.prepend(container);
    }

    initAiSummaryLogic(data);
  }

  /* ---- LOGIC & INTERACTION ---- */
  function initAiSummaryLogic(data) {
    const $ = id => document.getElementById(id);
    const aiModal = $("ai");
    const aiOverlay = $("aiModalOverlay");
    const openAiBtn = $("mobileNavBar");
    const closeAiBtn = $("closeAiModal");
    const leadEl = $("leadOverview");
    const bulletList = $("bulletList");
    const highlightsSec = $("highlightsSection");
    const badgeEl = document.querySelector(".ai-badge");
    const pkgSection = $("pkgSection");
    const log = $("log");
    const err = $("err");
    const qInput = $("q");
    const askBtn = $("ask");

    let owlInitialized = false;
    let summaryGenerated = false;

    // Initialize Owl Carousel for packages
    function initPkgCarousel() {
      const carouselEl = document.getElementById("pkgCarouselContainer");
      if (!carouselEl) return;

      if (typeof jQuery !== "undefined" && typeof jQuery.fn.owlCarousel !== "undefined") {
        const $carousel = jQuery(carouselEl);
        if ($carousel.hasClass("owl-loaded")) {
          $carousel.trigger("refresh.owl.carousel");
          return;
        }
        $carousel.owlCarousel({
          loop: false,
          margin: 10,
          nav: true,
          dots: false,
          navText: ['<i class="fa-solid fa-chevron-left"></i>', '<i class="fa-solid fa-chevron-right"></i>'],
          responsive: {
            0: { items: 1.2 },
            576: { items: 1.5 },
            768: { items: 2.3 },
            992: { items: 2.3 },
            1200: { items: 2.3 }
          }
        });
        owlInitialized = true;
      } else {
        // Native horizontal smooth scrolling fallback if jQuery/Owl is still loading
        carouselEl.style.display = "flex";
        carouselEl.style.gap = "10px";
        carouselEl.style.overflowX = "auto";
        carouselEl.style.paddingBottom = "10px";
        const items = carouselEl.querySelectorAll(".item");
        items.forEach(it => {
          it.style.minWidth = "200px";
          it.style.maxWidth = "220px";
          it.style.flexShrink = "0";
        });
      }
    }

    // Typing effect helper
    function typeText(el, text, speed = 12) {
      return new Promise(resolve => {
        el.classList.add("typing");
        let i = 0;
        const interval = setInterval(() => {
          i += 2;
          el.textContent = text.slice(0, i);
          if (i >= text.length) {
            clearInterval(interval);
            el.textContent = text;
            el.classList.remove("typing");
            resolve();
          }
        }, speed);
      });
    }

    // Generate live summary from page content
    async function generateSummaryLive() {
      if (summaryGenerated) return;
      summaryGenerated = true;

      if (!highlightsSec || !leadEl || !bulletList) return;
      if (badgeEl) badgeEl.classList.add("generating");
      if (aiModal) aiModal.classList.add("generating");

      // Skeleton loader
      leadEl.innerHTML = `
        <div class="ai-skeleton">
          <div class="ai-skeleton-line long"></div>
          <div class="ai-skeleton-line med"></div>
        </div>
      `;
      bulletList.innerHTML = `
        <div class="ai-skeleton">
          <div class="ai-skeleton-line short"></div>
          <div class="ai-skeleton-line long"></div>
          <div class="ai-skeleton-line med"></div>
        </div>
      `;

      try {
        const r = await fetch(API + "/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + getGroqKey()
          },
          body: JSON.stringify({
            model: CHAT_MODEL,
            stream: false,
            temperature: 0.3,
            max_completion_tokens: 600,
            messages: [
              {
                role: "system",
                content: "You are a luxury travel guide AI. Summarize the provided travel/festival content into exactly one overview sentence, followed by 4 to 5 concise bullet points formatted with '-' prefix. Plain text only. Never use asterisks (*) or markdown bold formatting."
              },
              {
                role: "user",
                content: "CONTENT:\n" + data.text
              }
            ]
          })
        });

        if (!r.ok) throw new Error("Could not generate summary");
        const resData = await r.json();
        const rawContent = resData.choices[0]?.message?.content || "";
        const content = rawContent.replace(/\*/g, "");

        const lines = content.split("\n").map(l => l.trim().replace(/\*/g, "")).filter(Boolean);
        let leadText = "";
        const bullets = [];

        lines.forEach(l => {
          if (l.startsWith("-") || l.startsWith("•") || /^\d+\./.test(l)) {
            bullets.push(l.replace(/^[-•\d.]\s*/, "").replace(/\*/g, ""));
          } else if (!leadText) {
            leadText = l.replace(/\*/g, "");
          }
        });

        const finalLead = leadText || "Here is a quick overview of essential recommendations and highlights:";
        leadEl.innerHTML = "";
        bulletList.innerHTML = "";

        await typeText(leadEl, finalLead, 12);

        const finalBullets = bullets.length > 0 ? bullets : [
          "Event & Cultural Highlights: Experiential sessions, tea tasting, and cultural performances.",
          "Timing & Best Season: Typically celebrated during the winter months (November - January).",
          "Getting There: Well-connected by air, train, and scenic highway road networks.",
          "Stays & Packages: Wide selection of curated tours, heritage tea estates, and luxury hotels."
        ];

        for (const b of finalBullets) {
          const li = document.createElement("li");
          bulletList.appendChild(li);
          await typeText(li, b, 10);
        }
      } catch (e) {
        leadEl.innerHTML = "";
        bulletList.innerHTML = "";
        await typeText(leadEl, "Essential travel guide: Experience local heritage, tastings, and scenic getaways.", 12);
        const fallbacks = [
          "Highlights: Tea-tasting sessions, cultural dance, and plantation trails.",
          "Season: Held in winter (typically November to January).",
          "Connectivity: Accessible via airport, nearest railhead, and national highways.",
          "Accommodation: Available across budget homestays to luxury hotels."
        ];
        for (const fb of fallbacks) {
          const li = document.createElement("li");
          bulletList.appendChild(li);
          await typeText(li, fb, 10);
        }
      } finally {
        if (badgeEl) badgeEl.classList.remove("generating");
        if (aiModal) aiModal.classList.remove("generating");
      }
    }

    // Modal controls for mobile bottom-sheet
    function openModal() {
      aiModal.classList.add("open");
      if (aiOverlay) aiOverlay.classList.add("open");
      document.body.classList.add("modal-open");
      setTimeout(() => {
        initPkgCarousel();
      }, 350);
      generateSummaryLive();
    }

    function closeModal() {
      aiModal.classList.remove("open");
      if (aiOverlay) aiOverlay.classList.remove("open");
      document.body.classList.remove("modal-open");
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (audioBtn) {
        audioBtn.classList.remove("playing");
        audioBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
      }
    }

    // High-Fidelity AI Audio Narration (Groq Orpheus Neural Voice with Play/Pause)
    const audioBtn = $("btnAudioTts");
    let currentAudio = null;
    let isFetchingAudio = false;

    function getSummarySpeechText() {
      let textToRead = "";
      if (leadEl && leadEl.textContent) {
        textToRead += leadEl.textContent.trim() + " ";
      }
      if (bulletList) {
        const lis = bulletList.querySelectorAll("li");
        lis.forEach(li => {
          textToRead += li.textContent.trim() + ". ";
        });
      }
      return textToRead.replace(/\*/g, "").trim() || "Here is a handpicked luxury travel overview from Adotrip.";
    }

    if (audioBtn) {
      audioBtn.onclick = async () => {
        // 1. If audio is currently playing, pause it
        if (currentAudio && !currentAudio.paused) {
          currentAudio.pause();
          audioBtn.classList.remove("playing");
          audioBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
          audioBtn.title = "Resume audio";
          return;
        }

        // 2. If audio is paused, resume playback
        if (currentAudio && currentAudio.paused && currentAudio.currentTime > 0) {
          try {
            await currentAudio.play();
            audioBtn.classList.add("playing");
            audioBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            audioBtn.title = "Pause audio";
          } catch (e) {
            console.error(e);
          }
          return;
        }

        // 3. Generate high quality AI speech via Groq Neural Audio API
        if (isFetchingAudio) return;
        isFetchingAudio = true;
        audioBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        audioBtn.title = "Generating high-quality audio...";

        const cleanSpeechText = getSummarySpeechText();

        try {
          const res = await fetch("https://api.groq.com/openai/v1/audio/speech", {
            method: "POST",
            headers: {
              "Authorization": "Bearer " + getGroqKey(),
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              model: "canopylabs/orpheus-v1-english",
              voice: "troy",
              response_format: "wav",
              input: cleanSpeechText
            })
          });

          if (!res.ok) throw new Error("Groq TTS status " + res.status);

          const blob = await res.blob();
          const audioUrl = URL.createObjectURL(blob);

          if (currentAudio) {
            currentAudio.pause();
            currentAudio = null;
          }

          currentAudio = new Audio(audioUrl);

          currentAudio.onplay = () => {
            audioBtn.classList.add("playing");
            audioBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            audioBtn.title = "Pause audio";
          };

          currentAudio.onpause = () => {
            audioBtn.classList.remove("playing");
            audioBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
            audioBtn.title = "Resume audio";
          };

          currentAudio.onended = () => {
            audioBtn.classList.remove("playing");
            audioBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
            audioBtn.title = "Listen to summary";
            currentAudio = null;
          };

          await currentAudio.play();
        } catch (err) {
          console.warn("Falling back to browser speech synthesis:", err);
          // Fallback to Web Speech if network or API error
          if ("speechSynthesis" in window) {
            const synth = window.speechSynthesis;
            synth.cancel();
            const utterance = new SpeechSynthesisUtterance(cleanSpeechText);
            utterance.rate = 0.95;
            utterance.pitch = 1.0;
            const voices = synth.getVoices();
            const bestVoice = voices.find(v => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Premium") || v.name.includes("Siri")));
            if (bestVoice) utterance.voice = bestVoice;

            utterance.onstart = () => {
              audioBtn.classList.add("playing");
              audioBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            };
            utterance.onend = utterance.onerror = () => {
              audioBtn.classList.remove("playing");
              audioBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
            };
            synth.speak(utterance);
          } else {
            audioBtn.classList.remove("playing");
            audioBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
          }
        } finally {
          isFetchingAudio = false;
        }
      };
    }

    if (openAiBtn) {
      openAiBtn.onclick = openModal;
      openAiBtn.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal();
        }
      });
    }
    if (closeAiBtn) closeAiBtn.onclick = closeModal;
    if (aiOverlay) aiOverlay.onclick = closeModal;

    document.addEventListener("keydown", e => {
      if (e.key === "Escape" && aiModal.classList.contains("open")) {
        closeModal();
      }
    });

    // Chat stream Typer
    class Typer {
      constructor(el) {
        this.el = el;
        this.buf = "";
        this.shown = "";
        this.t = null;
        this.done = false;
        el.classList.add("typing");
      }
      push(s) {
        this.buf += s;
        if (!this.t) this.t = setInterval(() => this.tick(), 16);
      }
      renderMarkdown(text) {
        // Format bullet lines starting with - or • into stylish dot list items
        const lines = text.split("\n");
        let html = "";
        let inList = false;

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          const trimmed = line.trim().replace(/\*/g, "");
          if (trimmed.startsWith("- ") || trimmed.startsWith("• ") || trimmed.startsWith("* ")) {
            if (!inList) {
              html += '<ul class="ai-ans-bullets">';
              inList = true;
            }
            const cleanContent = trimmed.replace(/^[-•*]\s+/, "").replace(/\*/g, "");
            html += `<li>${cleanContent}</li>`;
          } else {
            if (inList) {
              html += "</ul>";
              inList = false;
            }
            if (trimmed) {
              html += `<p class="ai-ans-p">${trimmed.replace(/\*/g, "")}</p>`;
            }
          }
        }
        if (inList) html += "</ul>";
        return html || text;
      }
      tick() {
        if (!this.buf) {
          if (this.done) {
            if (this.t) {
              clearInterval(this.t);
              this.t = null;
            }
            this.el.classList.remove("typing");
            this.el.innerHTML = this.renderMarkdown(this.shown);
          }
          return;
        }
        const n = Math.max(1, Math.ceil(this.buf.length / 30));
        this.shown += this.buf.slice(0, n);
        this.buf = this.buf.slice(n);
        this.el.innerHTML = this.renderMarkdown(this.shown);
      }
      end() {
        this.done = true;
        if (!this.buf) {
          if (this.t) {
            clearInterval(this.t);
            this.t = null;
          }
          this.el.classList.remove("typing");
          this.el.innerHTML = this.renderMarkdown(this.shown);
        }
      }
    }

    async function stream(system, user, typer) {
      const r = await fetch(API + "/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + getGroqKey()
        },
        body: JSON.stringify({
          model: CHAT_MODEL,
          stream: true,
          temperature: 0.3,
          max_completion_tokens: 900,
          messages: [{ role: "system", content: system }, { role: "user", content: user }]
        })
      });
      if (!r.ok) throw new Error("Groq API " + r.status);
      const rd = r.body.getReader(), dec = new TextDecoder();
      let b = "";
      while (true) {
        const { done, value } = await rd.read();
        if (done) break;
        b += dec.decode(value, { stream: true });
        const lines = b.split("\n");
        b = lines.pop();
        for (const l of lines) {
          if (!l.startsWith("data: ")) continue;
          const d = l.slice(6).trim();
          if (d === "[DONE]") continue;
          try {
            const c = JSON.parse(d).choices[0].delta.content;
            if (c) typer.push(c);
          } catch {}
        }
      }
    }

    const SYS = "You are Ado AI, an intelligent luxury travel concierge. You answer strictly from the page content provided. Never invent dates, permits, or details. When listing points, format each point on a new line with '- '. Plain text only, never use asterisks (*) or markdown symbols, be concise, polite, and helpful.";

    let hasShownPackages = false;
    let hasShownOffers = false;

    function showPackageSection() {
      if (pkgSection) {
        pkgSection.classList.add("visible");
        pkgSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
        setTimeout(() => initPkgCarousel(), 100);
      }
    }

    async function ask(q) {
      q = q.trim();
      if (!q) return;
      if (err) err.textContent = "";

      const d = document.createElement("div");
      d.className = "qa";
      d.innerHTML = '<b><span></span></b><div class="ans"></div>';
      d.querySelector("b span").textContent = q;
      log.prepend(d);
      if (qInput) qInput.value = "";

      const origBtn = askBtn.innerHTML;
      askBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
      askBtn.disabled = true;

      const ansEl = d.querySelector(".ans");
      const t = new Typer(ansEl);
      const qLower = q.toLowerCase();

      // 1. GREETING
      if (/^(hi|hello|hey|namaste|good\s*(morning|afternoon|evening)|hola|greetings)(\b|[!.,\s])/.test(qLower)) {
        t.push("Hello! Welcome to Adotrip & Ado AI. How can I assist you with your travel plans, itinerary, or hotel bookings today?");
        t.end();
        askBtn.innerHTML = origBtn;
        askBtn.disabled = false;
        return;
      }

      // Helper for AI Curation Simulation (Centered, standalone, exactly 4 seconds total)
      async function runCurationAnimation(steps, onComplete) {
        if (badgeEl) badgeEl.classList.add("generating");
        if (aiModal) aiModal.classList.add("generating");

        // Hide answer bubble until curation completes
        ansEl.style.display = "none";

        const curateBox = document.createElement("div");
        curateBox.className = "ai-curating-box";
        curateBox.innerHTML = `

          <div class="ai-curating-step-text" id="aiCurateStep">
            <span>${steps[0]}</span>
          </div>
          <div class="ai-curating-progress">
            <div class="ai-curating-bar" id="aiCurateBar"></div>
          </div>
        `;

        d.appendChild(curateBox);

        const stepEl = curateBox.querySelector("#aiCurateStep span");
        const barEl = curateBox.querySelector("#aiCurateBar");

        // Slow and smooth text changes (850ms per step)
        const delayPerStep = 850;
        for (let i = 0; i < steps.length; i++) {
          if (stepEl) {
            stepEl.style.opacity = "0";
            stepEl.style.transform = "translateY(3px)";
            await new Promise(r => setTimeout(r, 120));
            stepEl.textContent = steps[i];
            stepEl.style.opacity = "1";
            stepEl.style.transform = "translateY(0)";
          }
          await new Promise(r => setTimeout(r, delayPerStep - 120));
        }

        // Remove curation loader and show real message bubble
        curateBox.remove();
        ansEl.style.display = "";

        if (badgeEl) badgeEl.classList.remove("generating");
        if (aiModal) aiModal.classList.remove("generating");
        askBtn.innerHTML = origBtn;
        askBtn.disabled = false;
        onComplete();
      }

      // 2. OFFERS
      if (qLower.includes("offer") || qLower.includes("discount") || qLower.includes("promo") || qLower.includes("deal") || qLower.includes("coupon")) {
        const renderOffers = () => {
          ansEl.innerHTML = '<p class="ai-ans-p">Here are our latest exclusive travel offers and discounts:</p>';
          const isMobile = window.innerWidth <= 576;
          const offerContainer = document.createElement("div");
          offerContainer.className = "ai-offers-container";

          const offersList = [
            {
              title: "Hotel Offer",
              img: "https://www.adotrip.com/public/img/hotel/hotel1.png",
              link: "https://www.adotrip.com/hotel"
            },
            {
              title: "Flight Offer",
              img: "https://www.adotrip.com/public/img/hotel/flight.png",
              link: "https://www.adotrip.com/flight"
            }
          ];

          const itemsToShow = isMobile ? [offersList[Math.floor(Math.random() * offersList.length)]] : offersList;

          offerContainer.innerHTML = itemsToShow.map(item => `
            <a href="${item.link}" target="_blank" rel="noopener noreferrer" class="ai-offer-card" aria-label="${item.title}">
              <img src="${item.img}" alt="${item.title}" loading="lazy" />
            </a>
          `).join("");

          d.appendChild(offerContainer);
        };

        if (hasShownOffers) {
          ansEl.innerHTML = '<p class="ai-ans-p">Here are the exclusive promotional offers and discounts already shared with you below:</p>';
          const prevOfferBox = log.querySelector(".ai-offers-container");
          if (prevOfferBox) {
            prevOfferBox.scrollIntoView({ behavior: "smooth", block: "center" });
          } else {
            showPackageSection();
          }
          askBtn.innerHTML = origBtn;
          askBtn.disabled = false;
          return;
        }

        hasShownOffers = true;
        const offerSteps = [
          "Connecting to Adotrip live promotional engine...",
          "Scanning active seasonal discount tiers...",
          "Verifying coupon eligibility for your travel dates...",
          "Checking partner discounts across luxury stays & airlines...",
          "Locking in flat rates and limited-time travel vouchers...",
          "Applying premium member coupon savings...",
          "Finalizing personalized luxury deals...",
          "Ready! Unlocking your customized travel offers..."
        ];

        runCurationAnimation(offerSteps, () => {
          renderOffers();
        });
        return;
      }

      // 3. PACKAGES
      if (qLower.includes("package") || qLower.includes("hotel") || qLower.includes("tour") || qLower.includes("stay") || qLower.includes("book")) {
        if (hasShownPackages) {
          ansEl.innerHTML = '<p class="ai-ans-p">Here are the tour packages already shared above. Check out the options below:</p>';
          showPackageSection();
          askBtn.innerHTML = origBtn;
          askBtn.disabled = false;
          return;
        }

        hasShownPackages = true;
        const pkgSteps = [
          "Analyzing destination attractions & topography...",
          "Evaluating high-rated luxury stays and boutique retreats...",
          "Curating day-by-day sightseeing & experiential route...",
          "Cross-checking seasonal permits & optimal travel pacing...",
          "Selecting handpicked premium transport & transfers...",
          "Matching best price guarantee and inclusions...",
          "Fine-tuning inclusions and customized activity stops...",
          "Tailoring your bespoke itinerary options..."
        ];

        runCurationAnimation(pkgSteps, () => {
          ansEl.innerHTML = '<p class="ai-ans-p">Here are handpicked tour packages and stays. Check out the options below:</p>';
          showPackageSection();
        });
        return;
      }

      // 4. LLM QUERY
      if (badgeEl) badgeEl.classList.add("generating");
      if (aiModal) aiModal.classList.add("generating");
      try {
        await stream(SYS + " If the answer is not in the text, reply: Not covered in this page.", "CONTENT:\n" + data.text + "\n\nQUESTION: " + q, t);
      } catch (e) {
        if (err) err.textContent = e.message;
      } finally {
        if (badgeEl) badgeEl.classList.remove("generating");
        if (aiModal) aiModal.classList.remove("generating");
        askBtn.innerHTML = origBtn;
        askBtn.disabled = false;
      }
      t.end();
    }

    if (askBtn) askBtn.onclick = () => ask(qInput.value);
    if (qInput) {
      qInput.addEventListener("keydown", e => {
        if (e.key === "Enter") ask(qInput.value);
      });
    }

    // Chip triggers
    const chipPkg = $("chipPackages");
    const chipOff = $("chipOffers");
    const chipBt = $("chipBestTime");

    if (chipPkg) {
      chipPkg.onclick = () => {
        qInput.value = "Show tour packages and stays";
        ask("Show tour packages and stays");
      };
    }
    if (chipOff) {
      chipOff.onclick = () => {
        qInput.value = "Show exclusive travel offers and discounts";
        ask("Show exclusive travel offers and discounts");
      };
    }
    if (chipBt) {
      chipBt.onclick = () => {
        qInput.value = "What is the best time to visit and major attractions?";
        ask("What is the best time to visit and major attractions?");
      };
    }

    // Initialize Owl Carousel for packages
    initPkgCarousel();

    // On Desktop, auto generate live summary on page load
    if (window.innerWidth > 768) {
      generateSummaryLive();
    }
  }

  // Auto initialize on DOM ready
  async function startApp() {
    await loadEnvConfig();
    injectAiSummary();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startApp);
  } else {
    startApp();
  }
})();
