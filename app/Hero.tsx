"use client";

import { useEffect, useState } from "react";
import { assetPath } from "./assetPath";

const name = "Алёна Урсова";
const intro = `Объединяющий творчество, эстетику и глубокое понимание визуального восприятия.
В живопись я пришла по зову души. Я самоучка, и именно это позволило мне сохранить
свободу самовыражения, интуитивный подход и уникальный авторский стиль.
Каждая моя картина рождается через эмоции, внутренние состояния и энергию, которую я
вкладываю в процесс создания.
Для меня искусство — это не просто изображение, а способ передать настроение,
вдохновение и свет.
Мои работы наполнены особой энергетикой и созданы для того,
чтобы приносить гармонию, красоту и глубокий отклик
в сердце каждого зрителя.`;

function useTypedText(text: string, startAt: number, duration: number) {
  const [visibleText, setVisibleText] = useState("");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisibleText(text);
      return;
    }

    let frame = 0;
    const started = performance.now() + startAt;
    const animate = (now: number) => {
      const progress = Math.min(1, Math.max(0, (now - started) / duration));
      setVisibleText(text.slice(0, Math.floor(progress * text.length)));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [duration, startAt, text]);

  return visibleText;
}

export function Hero() {
  const typedName = useTypedText(name, 4450, 520);
  const typedIntro = useTypedText(intro, 5000, 1700);

  return <section className="hero hero-animated">
    <div className="vine">⌇﹏⌇﹏⌇﹏⌇</div>
    <div className="hero-title port">PORT<span>PORT</span></div>
    <div className="portrait-flourish" aria-hidden="true">
      <img className="flourish-vertical" src={assetPath("images/decor/portrait-flourish.png")} alt="" />
      <img className="flourish-tail" src={assetPath("images/decor/portrait-flourish.png")} alt="" />
    </div>
    <div className="portrait-wrap"><img src={assetPath("images/artist/alena-ursova.jpg")} alt="Алёна Урсова" /></div>
    <div className="hero-title folio">FOLIO<span>FOLIO</span></div>
    <div className={`signature typewriter ${typedName ? "has-content" : ""}`} aria-label={name}>
      {typedName && <img className="name-arc" src={assetPath("images/decor/name-arc-left.png")} alt="" aria-hidden="true" />}
      <span>{typedName}{typedName.length > 0 && typedName.length < name.length && <i aria-hidden="true" />}</span>
      {typedName && <img className="name-arc" src={assetPath("images/decor/name-arc-right.png")} alt="" aria-hidden="true" />}
    </div>
    <p className="intro typewriter" aria-label={intro}>{typedIntro}{typedIntro.length > 0 && typedIntro.length < intro.length && <i aria-hidden="true" />}</p>
  </section>;
}
