const FALLBACK = "https://picsum.photos/seed/case-study/800/500";

export function isValidImage(src) {
  return typeof src === "string" && src.trim().length > 0;
}

/** All displayable images for a case study, in priority order (deduped). */
export function getCaseStudyImages(caseStudy) {
  const candidates = [
    ...(Array.isArray(caseStudy?.gallery) ? caseStudy.gallery : []),
    caseStudy?.coverImage,
    ...(Array.isArray(caseStudy?.sections) ? caseStudy.sections : []).flatMap((section) =>
      Array.isArray(section?.images) ? section.images : [],
    ),
    caseStudy?.logo,
  ].filter(isValidImage);

  const unique = [...new Set(candidates)];
  if (unique.length) return unique;

  const seed = caseStudy?.slug || caseStudy?.client || "case-study";
  return [`https://picsum.photos/seed/${encodeURIComponent(seed)}/800/500`];
}

export function getCaseStudyThumbnail(caseStudy) {
  return getCaseStudyImages(caseStudy)[0] || FALLBACK;
}

export function getSectionImages(section) {
  return (Array.isArray(section?.images) ? section.images : []).filter(isValidImage);
}

/** Primary src first, then remaining case study fallbacks. */
export function getImageSources(primary, caseStudy) {
  const fallbacks = getCaseStudyImages(caseStudy);
  if (!isValidImage(primary)) return fallbacks;
  return [primary, ...fallbacks.filter((src) => src !== primary)];
}
