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

  const contactEmail = useMemo(() => import.meta.env.VITE_CONTACT_EMAIL?.trim() || '', []);
  const contactPhone = useMemo(() => import.meta.env.VITE_CONTACT_PHONE?.trim() || '', []);
  const formspreeId = useMemo(() => import.meta.env.VITE_FORMSPREE_ID?.trim() || '', []);
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

  const inputClass = (hasError: boolean) =>
    `w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${
      hasError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
    }`;

  return (
    <div className="max-w-xl mx-auto pt-8">
      <h2 className="text-2xl font-semibold mb-2 text-center dark:text-white">Get in Touch</h2>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
        Ready to get started? Send us a message and we'll get back to you quickly.
      </p>

      {(contactPhone || contactEmail) && (
        <div className="flex flex-wrap justify-center gap-6 mb-8 text-gray-600 dark:text-gray-300">
          {contactPhone && (
            <a href={`tel:${contactPhone}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              📞 {contactPhone}
            </a>
          )}
          {contactEmail && (
            <a href={`mailto:${contactEmail}`} className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              ✉️ {contactEmail}
            </a>
          )}
        </div>
      )}

      {!formspreeId && (
        <div className="mb-6 px-4 py-3 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-lg text-amber-800 dark:text-amber-200 text-sm">
          Set <code className="font-mono font-semibold">VITE_FORMSPREE_ID</code> in your environment to enable form submissions.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
          <input
            type="text" id="name" name="name"
            value={formData.name}
            onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
            className={inputClass(!!errors.name)}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
          <input
            type="email" id="email" name="email"
            value={formData.email}
            onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
            className={inputClass(!!errors.email)}
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Phone <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="tel" id="phone" name="phone"
            value={formData.phone}
            onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
            className={inputClass(false)}
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tell us about your project
          </label>
          <textarea
            id="message" name="message" rows={4}
            value={formData.message}
            onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
            className={inputClass(!!errors.message)}
          />
          {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !formspreeId}
          className={`w-full px-4 py-2 text-white rounded-md transition-colors flex items-center justify-center gap-2 ${
            isSubmitting || !formspreeId
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          }`}
        >
          {isSubmitting ? 'Sending…' : <><SendIcon size={18} /> Send Message</>}
        </button>

        {submitStatus === 'success' && (
          <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md text-sm">
            Thanks! We'll be in touch soon.
          </div>
        )}
        {submitStatus === 'error' && (
          <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm">
            Something went wrong. Please try again or contact us directly.
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactInfo;
