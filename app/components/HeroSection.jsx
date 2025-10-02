import React from 'react';
import "../styles/hero.css"


export default function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-text">
        <h1>Welcome to the Frilly Socks Shop!</h1>
        <p>Drag our stickers and shop around!</p>
      </div>
      <div className="hero-image">
        <img src="/herobox.png" alt="Cute frilly socks" />
      </div>
    </section>
  );
}
