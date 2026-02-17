import { useRef, useState } from "react";
import "./Home.scss";

/* ---------- Types ---------- */
interface Slide {
  image: string;
  title: string;
  text: string;
}

/* ---------- Slide Data ---------- */
const slides: Slide[] = [
  {
    image: "/assets/image/car-1.jpg",
    title: "Muffin",
    text: "chocolate chip muffin with a soft and moist texture, topped with a golden-brown crust and studded with gooey chocolate chips throughout."
  },
  {
    image: "/assets/image/car-2.jpg",
    title: "Chocolate Cake",
    text: "Rich and decadent chocolate cake with a moist, fudgy center and a glossy chocolate glaze."
  },
  {
    image: "/assets/image/car-3.jpg",
    title: "Cookies",
    text: "Soft and chewy cookies with a rich, buttery flavor and a slightly crispy edge."
  },
  {
    image: "/assets/image/car-4.jpg",
    title: "Cake",
    text: "A delicious and moist cake with a rich, buttery flavor and a smooth, creamy texture."
  }
];

const SIZE = 70;

/* ---------- Component ---------- */
export default function Home() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const isAnimating = useRef<boolean>(false);
  const timeoutRef = useRef<number | null>(null);

  /* ---------- Helpers ---------- */
  const getSlideTransform = (position: number): string => {
    const radius = SIZE / 2;
    const angle = position * 47 + 141;
    const scale =
      position === 0 ? 1.4 : position === -1 || position === 1 ? 1.1 : 1;

    return `rotate(${angle}deg) translateY(${radius * 4}px) rotate(${-angle}deg) scale(${scale})`;
  };

  const moveToSlide = (target: number): void => {
    if (isAnimating.current) return;

    isAnimating.current = true;
    const total = slides.length;
    let diff = (target - currentSlide + total) % total;

    if (diff === 0) {
      isAnimating.current = false;
      return;
    }

    const step = diff > total / 2 ? -1 : 1;
    let current = currentSlide;

    const animate = () => {
      current = (current + step + total) % total;
      setCurrentSlide(current);

      if (current !== target) {
        timeoutRef.current = window.setTimeout(animate, 300);
      } else {
        isAnimating.current = false;
      }
    };

    animate();
  };

  /* ---------- JSX ---------- */
  return (
    <div
      className="slideshow"
      style={{
        backgroundImage: `url(${slides[currentSlide].image})`
      }}
    >
      {/* Info Panel */}
      <div className="info-panel">
        <div className="info-title">{slides[currentSlide].title}</div>
        <div className="info-text">{slides[currentSlide].text}</div>
      </div>

      {/* Carousel */}
      <div className="carousel-container">
        <div className="carousel">
          {slides.map((slide, i) => {
            let offset = (i - currentSlide + slides.length) % slides.length;
            if (offset > slides.length / 2) offset -= slides.length;

            const visible = [-2, -1, 0, 1, 2].includes(offset);

            return (
              <div
                key={i}
                className="slide"
                style={{
                  backgroundImage: `url(${slide.image})`,
                  transform: visible
                    ? getSlideTransform(offset)
                    : "none",
                  display: visible ? "block" : "none",
                  opacity: visible ? 1 : 0
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Arrows */}
      <div className="arrow-controls">
        <button
          type="button"
          className="arrow left"
          onClick={() =>
            moveToSlide(
              (currentSlide - 1 + slides.length) % slides.length
            )
          }
        >
          &lt;
        </button>

        <button
          type="button"
          className="arrow right"
          onClick={() =>
            moveToSlide((currentSlide + 1) % slides.length)
          }
        >
          &gt;
        </button>
      </div>
    </div>
  );
}