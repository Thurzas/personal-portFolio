// components/ContactForm.tsx
"use client";
import { useState } from "react";
import Style from "./css/contact.module.css";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const adress = process.env.NEXT_PUBLIC_API_REST || "-1";
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    if(adress =="-1")
    {
      console.info("no adress...wrong env ?");
      setStatus("error");
      return;
    }

    try {
      const res = await fetch(adress, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("success");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <form className={Style.form} onSubmit={handleSubmit}>
      <div className={Style.inputGroup}>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Votre nom"
          required
          className={Style.input}
        />
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Votre email"
          required
          className={Style.input}
        />
      </div>

      <textarea
        name="message"
        value={form.message}
        onChange={handleChange}
        placeholder="Votre message"
        rows={5}
        required
        className={Style.textarea}
      />

      <button
        type="submit"
        disabled={status === "loading"}
        className={Style.button}
      >
        {status === "loading" ? "Envoi…" : "Envoyer"}
      </button>

      {status === "success" && (
        <p className={Style.success}>Message envoyé avec succès.</p>
      )}
      {status === "error" && (
        <p className={Style.error}>Une erreur est survenue. Réessayez.</p>
      )}
    </form>
  );
}
