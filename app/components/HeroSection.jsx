import React from 'react';
import "../styles/hero.css"

// The Spinning Button Component (Now displays an image)
const SpinningO = () => (
    <span className="o-button">
        {/* Replace the letter 'o' with your PNG image */}
        <img src="/pinkbutton.png" alt="Frilly Button" className="o-image" />
    </span>
);

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-text">
        <h1>
          {/* Breaking the words apart and using the SpinningO component for all 'O's */}
          Welc<SpinningO />me t<SpinningO /> the Frilly S<SpinningO />cks Sh<SpinningO />p!
        </h1>
        <p>Drag our stickers and shop around!</p>
      </div>
      <div className="hero-image">
        <img src="/herobox.png" alt="Cute frilly socks" />
      </div>
    </section>
  );
}