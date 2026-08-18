"use client";

import { FormEvent, useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Artwork = {
  title: string;
  image: string;
  interior: string;
  size: string;
  price: string;
};

export function ArtworkActions({ work }: { work: Artwork }) {
  const [modal, setModal] = useState<"interior" | "booking" | null>(null);
  const [imageMode, setImageMode] = useState<"artwork" | "interior">("interior");
  const [mounted, setMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!modal) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setModal(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [modal]);

  const openInterior = () => {
    setImageMode("interior");
    setModal("interior");
  };

  const openBooking = () => {
    setSubmitted(false);
    setModal("booking");
  };

  const submitBooking = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = [
      "Здравствуйте, Алёна! Хочу забронировать картину.",
      `Работа: ${work.title}`,
      `Стоимость: ${work.price}`,
      `Имя: ${data.get("name")}`,
      `Контакт: ${data.get("contact")}`,
      data.get("comment") ? `Комментарий: ${data.get("comment")}` : "",
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/79613698369?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

  const popup = modal && mounted ? createPortal(
    <div className="modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) setModal(null);
    }}>
      <section className={`art-modal ${modal === "booking" ? "booking-modal" : "interior-modal"}`} role="dialog" aria-modal="true" aria-labelledby={`modal-title-${work.title}`}>
        <button className="modal-close" type="button" onClick={() => setModal(null)} aria-label="Закрыть окно">×</button>
        {modal === "interior" ? <>
          <div className="modal-visual">
            <img src={imageMode === "interior" ? work.interior : work.image} alt={imageMode === "interior" ? `${work.title} в интерьере` : work.title}/>
          </div>
          <div className="modal-content">
            <div className="modal-tabs" aria-label="Вариант изображения">
              <button type="button" className={imageMode === "artwork" ? "active" : ""} onClick={() => setImageMode("artwork")}>Картина</button>
              <button type="button" className={imageMode === "interior" ? "active" : ""} onClick={() => setImageMode("interior")}>В интерьере</button>
            </div>
            <p className="modal-kicker">Авторское полотно</p>
            <h2 id={`modal-title-${work.title}`}>{work.title}</h2>
            <dl className="modal-facts"><div><dt>Материал</dt><dd>Холст на подрамнике, Лён</dd></div><div><dt>Техника</dt><dd>Масло</dd></div><div><dt>Размеры</dt><dd>{work.size}</dd></div></dl>
            <p className="modal-price">{work.price}</p>
            <button className="modal-primary" type="button" onClick={openBooking}>Забронировать полотно</button>
          </div>
        </> : <div className="booking-content">
          <p className="modal-kicker">Бронирование работы</p>
          <h2 id={`modal-title-${work.title}`}>{work.title}</h2>
          <div className="booking-summary"><img src={work.image} alt=""/><div><span>{work.size}</span><strong>{work.price}</strong></div></div>
          <form onSubmit={submitBooking}>
            <label>Ваше имя<input name="name" autoComplete="name" required placeholder="Как к вам обращаться"/></label>
            <label>Телефон или ник в мессенджере<input name="contact" autoComplete="tel" required placeholder="+7 900 000-00-00 или @username"/></label>
            <label>Комментарий<textarea name="comment" rows={3} placeholder="Доставка, оформление или другой вопрос"/></label>
            <button className="modal-primary" type="submit">Продолжить в WhatsApp</button>
            <p className="booking-note">Откроется чат с Алёной и готовым текстом заявки. Сообщение отправляете вы.</p>
            {submitted && <p className="booking-status" role="status">Заявка подготовлена в WhatsApp.</p>}
          </form>
        </div>}
      </section>
    </div>, document.body
  ) : null;

  return <>
    <div className="catalog-actions">
      <strong>{work.price}</strong>
      <div><button type="button" onClick={openInterior}>В интерьере</button><button type="button" onClick={openBooking}>Забронировать</button></div>
    </div>
    {popup}
  </>;
}
