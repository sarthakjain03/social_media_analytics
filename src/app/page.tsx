"use client";
import { motion } from "motion/react";
import { Globe, BarChart2, Users } from "lucide-react";
import { Button } from "@/components/Button";
import Image from "next/image";
import SignInModal from "@/components/SignInModal";
import { useState } from "react";

export default function LandingPage() {
  const [openModal, setOpenModal] = useState(false);

  const features = [
    {
      icon: <Globe className="size-10 text-purple-600" />,
      title: "Cross-Platform Analytics",
      description:
        "Get insights for all social media platforms in one dashboard",
    },
    {
      icon: <Users className="size-10 text-purple-600" />,
      title: "Audience Insights",
      description: "Understand your followers with deep demographic analysis",
    },
    {
      icon: <BarChart2 className="size-10 text-purple-600" />,
      title: "Performance Metrics",
      description: "Track engagement, reach and conversions with ease",
    },
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div>
      <main>
        <section
          id="hero"
          className="container px-20 py-16 text-center mx-auto"
        >
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            <motion.h1
              variants={fadeInUp}
              className="text-5xl font-bold mb-6 leading-tight"
            >
              Comprehensive Analytics for all your <br /> Social Platforms in
              one place
              {/* Social Media Analysis made <br /> Simpler and Easier */}
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-2xl text-gray-600 max-w-4xl mb-8 mx-auto"
            >
              Social media analytics made simpler and easier. Make data-driven
              decisions and skyrocket your online brand.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex justify-center space-x-4"
            >
              <Button variant="contained" size="large" onClick={() => setOpenModal(true)}>
                Start Analysing
              </Button>
              <Button variant="outlined" size="large">
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>
          {/* Add Dashboard Image or demo video here */}
        </section>
        <section id="features" className="px-20 py-16 text-center">
          <div className="container mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-semibold mb-12"
            >
              Powerful Features for Powerful Insights
            </motion.h2>
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerChildren}
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
              {features?.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-purple-50 p-6 text-center rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="bg-purple-100 p-3 rounded-full mb-4 inline-block">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl text-gray-900 font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        <section id="social-media" className="px-20 py-16 text-center">
          <div className="container mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-3xl font-semibold mb-12"
            >
              Social Media Platforms
            </motion.h2>
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerChildren}
              viewport={{ once: true }}
              className="text-center bg-purple-100 rounded-lg pt-9"
            >
              <p className="text-gray-700 mx-auto text-xl font-medium">
                Currently we provide comprehensive analytics for the following
                social media platforms only
              </p>
              <p className="text-gray-700 mx-auto text-xl font-medium mb-6">
                We might add more platforms based on demand
              </p>
              <div className="flex justify-center items-center gap-10 flex-wrap">
                <Image
                  src={"/youtube.webp"}
                  width={120}
                  height={100}
                  alt="Youtube"
                />
                <Image
                  src={"/instagram.png"}
                  width={200}
                  height={150}
                  alt="Instagram"
                />
                <Image
                  src={"/xlogo.jpg"}
                  width={60}
                  height={60}
                  alt="X"
                  className="rounded-full"
                />
                <Image
                  src={"/linkedin.svg"}
                  width={200}
                  height={150}
                  alt="Linkedin"
                />
              </div>
            </motion.div>
          </div>
        </section>
        <section id="email-register" className="bg-purple-600 text-white py-14">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="container mx-auto px-4 text-center"
          >
            <h2 className="text-3xl font-bold mb-6">
              Ready to Supercharge Your Social Media?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of marketers and influencers who are taking their
              social media game to the next level.
            </p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex justify-center space-x-4"
            >
              {/* <input
                placeholder="Enter your email"
                className="flex h-10 border rounded-md px-3 py-1 text-gray-900 w-64 bg-white"
              /> */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                className={`hover:shadow font-medium font-poppins px-4 py-2 rounded-md text-base bg-yellow-500 hover:bg-yellow-600 text-black`}
                onClick={() => setOpenModal(true)}
              >
                Get Started for Free
              </motion.button>
            </motion.div>
            {/* <p className="mt-4 text-sm opacity-75">No credit card required. 14-day free trial.</p> */}
          </motion.div>
        </section>
      </main>
      {openModal && (
        <SignInModal open={openModal} onClose={() => setOpenModal(false)} />
      )}
    </div>
  );
}
