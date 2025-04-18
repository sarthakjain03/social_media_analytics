"use client";
import { motion } from "motion/react";
import { Globe, BarChart2, Users } from "lucide-react";
import { Button } from "@/components/Button";
import Image from "next/image";
import SignInModal from "@/components/SignInModal";
import { useState } from "react";
import { useResponsive } from "@/hooks/useResponsive";

export default function LandingPage() {
  const [openModal, setOpenModal] = useState(false);
  const isLarge = useResponsive('up', 'lg');

  const features = [
    {
      icon: <Globe className="size-7 lg:size-10 text-purple-600" />,
      title: "Cross-Platform Analytics",
      description:
        "Get insights for all social media platforms in one dashboard",
    },
    {
      icon: <Users className="size-7 lg:size-10 text-purple-600" />,
      title: "Audience Insights",
      description: "Understand your followers with deep demographic analysis",
    },
    {
      icon: <BarChart2 className="size-7 lg:size-10 text-purple-600" />,
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
          className="container px-12 md:px-20 py-10 md:py-16 text-center mx-auto"
        >
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerChildren}
          >
            <motion.h1
              variants={fadeInUp}
              className="text-2xl md:text-3xl lg:text-5xl font-bold mb-6 leading-tight"
            >
              Comprehensive Analytics for all your <br /> Social Platforms in
              one place
              {/* Social Media Analysis made <br /> Simpler and Easier */}
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-base md:text-lg lg:text-2xl text-gray-600 max-w-4xl mb-8 mx-auto"
            >
              Social media analytics made simpler and easier. Make data-driven
              decisions and skyrocket your online brand.
            </motion.p>
            <motion.div
              variants={fadeInUp}
              className="flex justify-center space-x-4"
            >
              <Button variant="contained" size={isLarge ? "large" : "small"} onClick={() => setOpenModal(true)}>
                Start Analysing
              </Button>
              <Button variant="outlined" size={isLarge ? "large" : "small"}>
                Watch Demo
              </Button>
            </motion.div>
          </motion.div>
          {/* Add Dashboard Image or demo video here */}
        </section>
        <section id="features" className="px-12 md:px-20 py-10 md:py-16 text-center">
          <div className="container mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-2xl lg:text-3xl font-semibold mb-12"
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
                  <h3 className="text-md lg:text-xl text-gray-900 font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm lg:text-base">{feature.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
        <section id="social-media" className="px-12 md:px-20 py-10 md:py-16 text-center">
          <div className="container mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-2xl lg:text-3xl font-semibold mb-12"
            >
              Social Media Platforms
            </motion.h2>
            <motion.div
              initial="initial"
              animate="animate"
              variants={staggerChildren}
              viewport={{ once: true }}
              className="text-center bg-purple-100 rounded-lg pt-8 pb-7 px-4 md:px-0"
            >
              <p className="text-gray-700 mx-auto text-sm md:text-md lg:text-xl font-medium mb-6">
                Currently we provide comprehensive analytics for the following
                social media platforms only
              </p>
              {/* <p className="text-gray-700 mx-auto text-md lg:text-xl font-medium mb-6">
                We might add more platforms based on demand
              </p> */}
              <div className="flex justify-center items-center gap-10 flex-wrap">
                <Image
                  src={"/xlogo.jpg"}
                  width={isLarge ? 60 : 40}
                  height={isLarge ? 60 : 40}
                  alt="X"
                  className="rounded-full"
                />
                <Image
                  src={"/instagram.png"}
                  width={isLarge ? 200 : 130}
                  height={isLarge ? 150 : 80}
                  alt="Instagram"
                />
                <Image
                  src={"/github.svg"}
                  width={isLarge ? 60 : 40}
                  height={isLarge ? 60 : 40}
                  alt="Github"
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
            <h2 className="text-2xl lg:text-3xl font-bold mb-6">
              Ready to Supercharge Your Social Media?
            </h2>
            <p className="text-lg lg:text-xl mb-8 max-w-2xl mx-auto">
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
                className={`hover:shadow font-medium font-poppins px-3 lg:px-4 py-1 lg:py-2 rounded-md text-sm lg:text-base bg-yellow-500 hover:bg-yellow-600 text-black`}
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
