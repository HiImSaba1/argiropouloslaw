"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { contactSchema, type ContactFields } from "@/lib/validation/contact";

export function ContactForm() {
  const [result, setResult] = useState<{ kind: "success" | "error"; message: string } | null>(null);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactFields>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", message: "", consent: false, website: "" },
  });

  const submit = async (values: ContactFields) => {
    setResult(null);
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const payload = await response.json() as { message?: string };
      if (!response.ok) throw new Error(payload.message || "Η αποστολή δεν ολοκληρώθηκε.");
      setResult({ kind: "success", message: "Το μήνυμά σας στάλθηκε. Θα επικοινωνήσουμε μαζί σας το συντομότερο δυνατό." });
      reset();
    } catch (error) {
      setResult({ kind: "error", message: error instanceof Error ? error.message : "Η αποστολή δεν ολοκληρώθηκε. Δοκιμάστε ξανά." });
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit(submit)} noValidate>
      <div className="contact-form__fields">
        <Field inputId="contact-name" label="Ονοματεπώνυμο" error={errors.name?.message}>
          <input id="contact-name" autoComplete="name" {...register("name")} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "contact-name-error" : undefined} />
        </Field>
        <Field inputId="contact-email" label="Email" error={errors.email?.message}>
          <input id="contact-email" type="email" autoComplete="email" {...register("email")} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "contact-email-error" : undefined} />
        </Field>
        <Field inputId="contact-phone" label="Τηλέφωνο (προαιρετικό)" error={errors.phone?.message}>
          <input id="contact-phone" type="tel" autoComplete="tel" {...register("phone")} aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? "contact-phone-error" : undefined} />
        </Field>
        <Field inputId="contact-message" className="contact-form__message" label="Σύντομη περιγραφή αιτήματος" error={errors.message?.message}>
          <textarea id="contact-message" rows={6} {...register("message")} aria-invalid={Boolean(errors.message)} aria-describedby={errors.message ? "contact-message-error" : undefined} />
        </Field>
      </div>

      <div className="contact-form__honeypot" aria-hidden="true">
        <label>Ιστότοπος<input tabIndex={-1} autoComplete="off" {...register("website")} /></label>
      </div>

      <p className="contact-form__privacy-note">Μην συμπεριλάβετε ευαίσθητα προσωπικά δεδομένα, αποδεικτικά έγγραφα ή εμπιστευτικές πληροφορίες. Η φόρμα αποστέλλει το μήνυμα απευθείας στο γραφείο και δεν παρέχει δυνατότητα μεταφόρτωσης αρχείων.</p>

      <label className="contact-form__consent">
        <input type="checkbox" {...register("consent")} aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "contact-consent-error" : undefined} />
        <span>Έχω διαβάσει την <Link href="/politiki-aporritou">Πολιτική Απορρήτου</Link> και συναινώ στην αποστολή του μηνύματος.</span>
      </label>
      {errors.consent && <span id="contact-consent-error" className="contact-form__error" role="alert">{errors.consent.message}</span>}

      <button className="contact-form__submit" type="submit" disabled={isSubmitting}>
        <span>{isSubmitting ? "Αποστολή…" : "Αποστολή μηνύματος"}</span><span aria-hidden="true"><ArrowUpRight /></span>
      </button>
      {result && <p className={`contact-form__status contact-form__status--${result.kind}`} role={result.kind === "error" ? "alert" : "status"}>{result.message}</p>}
    </form>
  );
}

function Field({ children, className = "", error, inputId, label }: { children: React.ReactNode; className?: string; error?: string; inputId: string; label: string }) {
  return <div className={`contact-form__field ${className}`}><label htmlFor={inputId}>{label}</label>{children}{error && <small id={`${inputId}-error`} role="alert">{error}</small>}</div>;
}
