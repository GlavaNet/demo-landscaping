import { useState, FormEvent, useCallback, useMemo } from 'react';
import { SendIcon } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export const ContactInfo = () => {
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const contactEmail  = useMemo(() => import.meta.env.VITE_CONTACT_EMAIL?.trim()  || '', []);
  const contactPhone  = useMemo(() => import.meta.env.VITE_CONTACT_PHONE?.trim()  || '', []);
  const formspreeId   = useMemo(() => import.meta.env.VITE_FORMSPREE_ID?.trim()   || '', []);
  const formspreeEndpoint = useMemo(
    () => formspreeId ? `https://formspree.io/f/${formspreeId}` : '',
    [formspreeId]
  );

  const validate = useCallback((data: FormData): FormErrors => {
    const errs: FormErrors = {};
    if (!data.name.trim()) errs.name = 'Name is required';
    if (!data.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errs.email = 'Invalid email address';
    }
    if (!data.message.trim()) errs.message = 'Please tell us a little about your project';
    return errs;
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    const formErrors = validate(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      setIsSubmitting(false);
      return;
    }

    if (!formspreeEndpoint) {
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto pt-8">
      <h2
        className="text-2xl font-semibold mb-2 text-center"
        style={{ color: 'var(--color-text)' }}
      >
        Get in Touch
      </h2>
      <p className="text-center mb-8" style={{ color: 'var(--color-text-muted)' }}>
        Ready to get started? Send us a message and we'll get back to you quickly.
      </p>

      {(contactPhone || contactEmail) && (
        <div className="flex flex-wrap justify-center gap-6 mb-8" style={{ color: 'var(--color-text-muted)' }}>
          {contactPhone && (
            <a
              href={`tel:${contactPhone}`}
              className="transition-colors hover:underline"
              style={{ color: 'var(--color-primary)' }}
            >
              📞 {contactPhone}
            </a>
          )}
          {contactEmail && (
            <a
              href={`mailto:${contactEmail}`}
              className="transition-colors hover:underline"
              style={{ color: 'var(--color-primary)' }}
            >
              ✉️ {contactEmail}
            </a>
          )}
        </div>
      )}

      {!formspreeId && (
        <div className="warning-banner mb-6">
          Set <code className="font-mono font-semibold">VITE_FORMSPREE_ID</code> in your environment to enable form submissions.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {(['name', 'email', 'phone'] as const).map((field) => (
          <div key={field}>
            <label
              htmlFor={field}
              className="block text-sm font-medium mb-1"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {field.charAt(0).toUpperCase() + field.slice(1)}
              {field === 'phone' && <span className="ml-1 opacity-60">(optional)</span>}
            </label>
            <input
              type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
              id={field}
              name={field}
              value={formData[field]}
              onChange={e => setFormData(p => ({ ...p, [field]: e.target.value }))}
              className={`input-field${errors[field as keyof FormErrors] ? ' error' : ''}`}
            />
            {errors[field as keyof FormErrors] && (
              <p className="mt-1 text-sm" style={{ color: 'hsl(0, 72%, 51%)' }}>
                {errors[field as keyof FormErrors]}
              </p>
            )}
          </div>
        ))}

        <div>
          <label
            htmlFor="message"
            className="block text-sm font-medium mb-1"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Tell us about your project
          </label>
          <textarea
            id="message" name="message" rows={4}
            value={formData.message}
            onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
            className={`input-field${errors.message ? ' error' : ''}`}
          />
          {errors.message && (
            <p className="mt-1 text-sm" style={{ color: 'hsl(0, 72%, 51%)' }}>
              {errors.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !formspreeId}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {isSubmitting ? 'Sending…' : <><SendIcon size={18} /> Send Message</>}
        </button>

        {submitStatus === 'success' && (
          <div className="p-4 rounded-md text-sm" style={{ backgroundColor: 'hsl(142, 76%, 93%)', color: 'hsl(142, 72%, 25%)' }}>
            Thanks! We'll be in touch soon.
          </div>
        )}
        {submitStatus === 'error' && (
          <div className="p-4 rounded-md text-sm" style={{ backgroundColor: 'hsl(0, 72%, 95%)', color: 'hsl(0, 72%, 35%)' }}>
            Something went wrong. Please try again or contact us directly.
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactInfo;
