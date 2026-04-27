"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";

const clients = [
  { name: "Zenixa", src: "/clients/zenixa.svg" },
  { name: "Footfits", src: "/clients/footfits.svg" },
  { name: "Glitz & Glamour", src: "/clients/glitzandglamour.svg" },
  { name: "Himalaya Security", src: "/clients/himalaya-security.svg" },
  { name: "Opulique", src: "/clients/opulique.svg" },
  { name: "Sayma Manpower", src: "/clients/sayma-manpower.svg" },
  { name: "Telal Al Bidaya", src: "/clients/telalalbidaya.svg" },
];

export default function ClientLogos() {
  const trackRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const pause = () => (track.style.animationPlayState = "paused");
    const play = () => (track.style.animationPlayState = "running");
    track.addEventListener("mouseenter", pause);
    track.addEventListener("mouseleave", play);
    return () => {
      track.removeEventListener("mouseenter", pause);
      track.removeEventListener("mouseleave", play);
    };
  }, []);

  const doubled = [...clients, ...clients];

  return (
    <section className="clients-section" id="clients">
      <div className="clients-label">
        <span className="clients-label-line" />
        <span className="clients-label-text">Trusted by forward-thinking brands</span>
        <span className="clients-label-line" />
      </div>

      <div className="clients-marquee">
        <div className="clients-track" ref={trackRef}>
          {doubled.map((client, i) => (
            <div className="client-logo" key={`${client.name}-${i}`}>
              <Image
                src={client.src}
                alt={client.name}
                width={140}
                height={50}
                style={{ objectFit: "contain" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
