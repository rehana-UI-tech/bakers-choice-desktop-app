import type { ReactNode } from 'react';
import './Contact.scss';
import closeupImage from '../assets/image/closeup.jpg';
import feedbackImage from '../assets/image/feedback1.jpg';

interface ContactCard {
  icon: ReactNode;
  title: string;
  description: string;
  value: string;
}

const cards: ContactCard[] = [
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 10.5 12 3l9 7.5v9a1.5 1.5 0 0 1-1.5 1.5H15v-6h-6v6H4.5A1.5 1.5 0 0 1 3 19.5z" />
      </svg>
    ),
    title: 'VISIT US',
    description: 'Come by our bakery to taste fresh bakes and discover today\'s specials.',
    value: '2 Baker St, London, UK',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6.4 3A2.4 2.4 0 0 0 4 5.4c0 8.05 6.55 14.6 14.6 14.6A2.4 2.4 0 0 0 21 17.6v-2.23a1.6 1.6 0 0 0-1.37-1.58l-3.09-.44a1.6 1.6 0 0 0-1.5.56l-1.13 1.32a12.2 12.2 0 0 1-5.14-5.14l1.32-1.13a1.6 1.6 0 0 0 .56-1.5l-.44-3.09A1.6 1.6 0 0 0 8.63 3z" />
      </svg>
    ),
    title: 'CALL US',
    description: 'Need quick help with custom orders or delivery timelines? Give us a ring.',
    value: '+44 (0) 203 115 7711',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5zm2 .5 7 5 7-5V6.5a.5.5 0 0 0-.5-.5h-13a.5.5 0 0 0-.5.5zm14 2.44-6.42 4.59a1 1 0 0 1-1.16 0L5 9.44v8.06c0 .28.22.5.5.5h13a.5.5 0 0 0 .5-.5z" />
      </svg>
    ),
    title: 'CONTACT US',
    description: 'Prefer writing? Drop us an email and we will get back shortly.',
    value: 'support@bakerschoice.com',
  },
];

export default function Contact() {
  return (
    <div className="contact-page">
      <section
        className="contact-hero"
        style={{ backgroundImage: `url(${closeupImage})` }}
      >
        <div className="contact-hero__overlay" />
        <div className="contact-hero__content">
          <h1>CONTACT US</h1>
          <p className="contact-hero__divider">......</p>
          <p>
            Need an expert? You are most welcome to leave your contact info and
            we will be in touch shortly.
          </p>
        </div>
      </section>

      <section className="contact-cards">
        {cards.map((card) => (
          <article className="contact-card" key={card.title}>
            <span className="contact-card__icon">{card.icon}</span>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
            <a href="#" onClick={(event) => event.preventDefault()}>
              {card.value}
            </a>
          </article>
        ))}
      </section>

      <section className="contact-feedback">
        <div className="contact-feedback__text">
          <h2>We Love Hearing From You</h2>
          <p>
            Your ideas and feedback help us improve every day. Share your
            thoughts and let us make your next bakery experience even better.
          </p>
        </div>
        <img src={feedbackImage} alt="Customer feedback" />
      </section>
    </div>
  );
}
