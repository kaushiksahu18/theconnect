"use client";

import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";
import { Footer } from "./footer";

const testimonials = [
  {
    quote:
      "I finally feel secure using a chat app. Peer-to-peer is the future!",
    author: "Sarah Johnson",
    role: "Privacy Advocate",
  },
  {
    quote:
      "Crystal clear video quality and knowing my data isn't stored anywhere gives me peace of mind.",
    author: "Michael Chen",
    role: "Software Engineer",
  },
  {
    quote: "The best communication tool for those who value their privacy.",
    author: "Emma Williams",
    role: "Digital Rights Activist",
  },
];

export function Testimonials() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.section
      ref={ref}
      animate={{
        background: [
          "linear-gradient(45deg, #0066cc, #00ccaa,#0066cc,#00ccaa,#0066cc,#00ccaa)",
          "linear-gradient(45deg, #00ccaa, #0066cc,#00ccaa,#0066cc,#00ccaa,#0066cc)",
          "linear-gradient(45deg, #0066cc, #00ccaa,#0066cc,#00ccaa,#0066cc,#00ccaa)",
        ],
      }}
      transition={{ duration: 15, repeat: Infinity, repeatType: "reverse" }}
      className="pt-24"
    >
      <div className="container px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            What People Are Saying
          </h2>
          <p className="mt-4 text-white/90 md:text-xl">
            Join thousands of satisfied users who trust our platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[card]/50 rounded-lg p-6 backdrop-blur-sm"
            >
              <div className="mb-4">
                <svg
                  className="h-8 w-8 text-white opacity-50"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                >
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
              </div>
              <p className="mb-4 text-lg">{testimonial.quote}</p>
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm text-gray-200">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </motion.section>
  );
}
