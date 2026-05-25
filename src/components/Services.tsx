import { useMemo } from 'react';

interface Service {
  id: string;
  title: string;
  description: string;
}

/**
 * Services page — replace the items in the `services` array with
 * the actual offerings for each client before deploying.
 */
export const Services = () => {
  const businessName = useMemo(
    () => import.meta.env.VITE_BUSINESS_NAME?.trim() || 'We',
    []
  );

  const services = useMemo<Service[]>(() => [
    {
      id: 'service1',
      title: 'Service One',
      description: `${businessName} delivers professional results on every job. Our experienced team uses quality materials and proven techniques to make sure the work is done right the first time.`,
    },
    {
      id: 'service2',
      title: 'Service Two',
      description: 'We handle projects of all sizes — from small repairs to large installations. Every job gets the same attention to detail and commitment to quality.',
    },
    {
      id: 'service3',
      title: 'Service Three',
      description: 'Our team is fully licensed and insured. We follow all local codes and best practices so you can have confidence in the work long after we leave.',
    },
    {
      id: 'service4',
      title: 'Free Estimates',
      description: "Not sure what you need? We're happy to take a look and give you a clear, no-obligation estimate. Just reach out through the Contact page to get started.",
    },
  ], [businessName]);

  return (
    <div className="max-w-5xl mx-auto pt-8 px-4">
      <h2 className="text-3xl font-semibold mb-2 text-center dark:text-white">
        What We Do
      </h2>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-10">
        Quality work on every project, every time.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {services.map((service) => (
          <div
            key={service.id}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-transform hover:scale-[1.02]"
          >
            <h3 className="text-xl font-semibold mb-3 dark:text-white">
              {service.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
