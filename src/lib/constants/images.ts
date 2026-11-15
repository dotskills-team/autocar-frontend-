// Photo slots of the design. Files live in /public/images.
// While a slot is null, a styled placeholder is shown instead, so the layout never breaks.
//
// Current photos (Unsplash License — free for commercial use, no attribution required):
// - hero-tyre.jpg  https://unsplash.com/photos/tLEUi4OaQmQ  (tyre tread close-up, dark)
// Replace them with the client's own photos when available.

export const images = {
  /** Home hero and page banners. */
  hero: "/images/hero-tyre.jpg" as string | null,
} as const;
