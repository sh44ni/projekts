"use client";

import { useState } from "react";
import Image from "next/image";
import { getCaseStudyImages } from "@/lib/caseStudyImages";

export default function CaseStudyImage({
  caseStudy,
  sources,
  startIndex = 0,
  alt = "",
  ...props
}) {
  const allSources = sources || (caseStudy ? getCaseStudyImages(caseStudy) : []);
  const [offset, setOffset] = useState(0);
  const index = Math.min(startIndex + offset, allSources.length - 1);
  const src = allSources[index];

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      onError={() => {
        if (startIndex + offset < allSources.length - 1) {
          setOffset((o) => o + 1);
        }
      }}
    />
  );
}
