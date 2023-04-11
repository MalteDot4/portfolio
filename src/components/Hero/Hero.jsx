import React from "react";

function Hero() {
  return (
    <div class="container">
      <video class="clipped-video" autoPlay muted loop>
        <source
          src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          type="video/mp4"
        />
      </video>

      <svg height="100%" width="100%">
        <clipPath id="text-overlay" width="100%" height="100%">
          <text id="title" x="0" y="2em">
            MR
          </text>
        </clipPath>
      </svg>

      <span>Malte Reppke</span>
      <h2>Creative Frontend Dev</h2>
    </div>
  );
}

export default Hero;
