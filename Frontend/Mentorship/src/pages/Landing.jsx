import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { Zap, Target, Clock, Users, BookOpen, CheckCircle, Star } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  AnimatedButton,
  SpotlightCard,
  BlurCard,
  NumberTicker,
  GridBackground,
  MagneticButton,
  TextReveal,
  AnimatedAvatar,
} from "@/components/magicui";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { DotPattern } from "@/components/ui/dot-pattern";
import { BorderBeam } from "@/components/ui/border-beam";
import { LandingNavbar } from "@/components/LandingNavbar";

// Animated Number Component (kept for backward compatibility, using NumberTicker in new sections)
function AnimatedNumber({ value }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState("0");

  // Extract numeric part from value (e.g., "5,200+" -> 5200)
  const numericValue = parseInt(value.replace(/[^0-9]/g, ""));
  const suffix = value.replace(/[0-9,]/g, ""); // e.g., "+" or "/5"

  useEffect(() => {
    const unsubscribe = rounded.on("change", (latest) => {
      setDisplayValue(latest.toLocaleString() + suffix);
    });

    // Trigger animation
    count.set(numericValue);

    return () => unsubscribe();
  }, [numericValue, suffix, count, rounded]);

  return (
    <motion.p className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
      {displayValue}
    </motion.p>
  );
}

export default function Landing() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  // Refs for AnimatedBeams
  const step1Ref = useRef(null);
  const step2Ref = useRef(null);
  const step3Ref = useRef(null);
  const step4Ref = useRef(null);
  const beamContainerRef = useRef(null);

  // Section refs for navbar navigation
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const mentorsRef = useRef(null);

  // Mock stats data
  const stats = [
    { icon: Users, label: "Total Users", value: "847+" },
    { icon: BookOpen, label: "Total Mentors", value: "294+" },
    { icon: CheckCircle, label: "Sessions Completed", value: "3,624+" },
    { icon: Star, label: "Avg Mentor Rating", value: "4.8/5" },
  ];

  // Mock features data
  const features = [
    {
      id: 1,
      icon: Zap,
      title: "Expert Mentors",
      description:
        "Learn from experienced professionals across various industries and fields.",
    },
    {
      id: 2,
      icon: Target,
      title: "Personalized Guidance",
      description:
        "Get tailored advice and mentorship matched to your career goals and needs.",
    },
    {
      id: 3,
      icon: Clock,
      title: "Flexible Scheduling",
      description:
        "Schedule sessions at your convenience with mentors from around the world.",
    },
  ];

  // Mock mentors data
  const mentors = [
    {
      id: 1,
      name: "Sarah Johnson",
      expertise: "Product Manager",
      rating: 4.9,
      initials: "SJ",
    },
    {
      id: 2,
      name: "Michael Chen",
      expertise: "Full Stack Developer",
      rating: 4.8,
      initials: "MC",
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      expertise: "UX/UI Designer",
      rating: 4.7,
      initials: "ER",
    },
  ];

  return (
    <>
      {/* Landing Navbar */}
      <LandingNavbar 
        heroRef={heroRef}
        featuresRef={featuresRef}
        howItWorksRef={howItWorksRef}
        mentorsRef={mentorsRef}
      />

      {/* ============== HERO SECTION ============== */}
      <section ref={heroRef} className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-16 md:py-20 px-4 md:px-6 relative overflow-hidden pt-24">
        {/* Dot Pattern Background */}
        <DotPattern 
          width={30} 
          height={30} 
          cx={1} 
          cy={1} 
          cr={1.5} 
          className="absolute inset-0 opacity-30" 
        />
        
        {/* Hero Content */}
        <div className="relative z-10 w-full">
          <motion.div
            className="max-w-2xl mx-auto text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Headline */}
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 md:mb-8 leading-tight"
              variants={itemVariants}
            >
              Connect with Mentors,{" "}
              <motion.span 
                className="relative inline-block text-blue-600"
              >
                Grow Your Skills
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3"
                  viewBox="0 0 200 8"
                  preserveAspectRatio="none"
                >
                  <motion.path
                    d="M 0 4 Q 50 0, 100 4 T 200 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                    initial={{ strokeDasharray: 200, strokeDashoffset: 200 }}
                    animate={{ strokeDasharray: 200, strokeDashoffset: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                  />
                </svg>
              </motion.span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="text-lg md:text-xl text-gray-600 mb-12 md:mb-16 leading-relaxed max-w-xl mx-auto"
              variants={itemVariants}
            >
              Find experienced mentors to guide your career journey. Build meaningful
              connections and accelerate your professional growth.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 items-center justify-center"
              variants={itemVariants}
            >
              {/* Primary Button */}
              <Link to="/register">
                <ShimmerButton background="rgba(37, 99, 235, 1)" className="text-white">
                  Get Started
                </ShimmerButton>
              </Link>

              {/* Secondary Button */}
              <Link to="/login">
                <ShimmerButton background="rgba(59, 130, 246, 0.8)" className="border border-blue-400 text-white">
                  Login
                </ShimmerButton>
              </Link>
            </motion.div>

            {/* Minimalist Stats */}
            <motion.div
              className="flex items-center justify-center gap-12 md:gap-20 mt-16 md:mt-20 flex-wrap"
              variants={containerVariants}
            >
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    className="text-center min-w-fit"
                    variants={itemVariants}
                  >
                    <div className="flex justify-center mb-2">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-1">
                      <NumberTicker value={stat.value} />
                    </p>
                    <p className="text-xs md:text-sm text-gray-600">{stat.label}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>

      </section>

      {/* ============== FEATURES SECTION ============== */}
      <section ref={featuresRef} className="w-full bg-gray-50 py-16 md:py-24 px-4 relative">
        <GridBackground className="opacity-30" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              variants={itemVariants}
            >
              Key Features
            </motion.h2>

            <motion.p
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Unlock your potential with mentorship designed for your success.
            </motion.p>
          </motion.div>

          {/* Bento Grid Features */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <BentoGrid className="gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div key={feature.id} variants={itemVariants}>
                    <BentoGridItem
                      title={feature.title}
                      description={feature.description}
                      icon={<Icon className="w-7 h-7 text-blue-600" />}
                      className="md:col-span-1"
                    />
                  </motion.div>
                );
              })}
            </BentoGrid>
          </motion.div>
        </div>
      </section>

      {/* ============== HOW IT WORKS SECTION ============== */}
      <section ref={howItWorksRef} className="w-full bg-white py-20 md:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-20"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.h2
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6"
              variants={itemVariants}
            >
              How It <span className="text-blue-600">Works</span>
            </motion.h2>

            <motion.p
              className="text-base md:text-lg text-gray-500 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Four simple steps to start your mentorship journey
            </motion.p>
          </motion.div>

          {/* Steps Grid with Animated Beams */}
          <motion.div
            ref={beamContainerRef}
            className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            {/* Animated Beams - Only show on lg screens */}
            <div className="hidden lg:block absolute inset-0 pointer-events-none">
              <AnimatedBeam
                containerClassName="w-full h-full"
                fromRef={step1Ref}
                toRef={step2Ref}
                curvature={-60}
                duration={2.5}
                delay={0}
                gradientStartColor="#3b82f6"
                gradientStopColor="#2563eb"
                dotSize={2.5}
              />
              <AnimatedBeam
                containerClassName="w-full h-full"
                fromRef={step2Ref}
                toRef={step3Ref}
                curvature={-60}
                duration={2.5}
                delay={2.5}
                gradientStartColor="#3b82f6"
                gradientStopColor="#2563eb"
                dotSize={2.5}
              />
              <AnimatedBeam
                containerClassName="w-full h-full"
                fromRef={step3Ref}
                toRef={step4Ref}
                curvature={-60}
                duration={2.5}
                delay={5}
                gradientStartColor="#3b82f6"
                gradientStopColor="#2563eb"
                dotSize={2.5}
              />
            </div>

            {[
              {
                step: 1,
                title: "Create Account",
                description: "Sign up in minutes with your email or social profile",
                icon: CheckCircle,
                ref: step1Ref,
              },
              {
                step: 2,
                title: "Browse Mentors",
                description: "Explore experienced mentors in your field of interest",
                icon: Users,
                ref: step2Ref,
              },
              {
                step: 3,
                title: "Send Request",
                description: "Connect with mentors and send mentorship requests",
                icon: Target,
                ref: step3Ref,
              },
              {
                step: 4,
                title: "Start Learning",
                description: "Get guidance, feedback, and accelerate your growth",
                icon: Zap,
                ref: step4Ref,
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div key={index} variants={itemVariants} ref={item.ref}>
                  <div className="text-center space-y-3 relative z-10">
                    {/* Step Number Circle - Minimalist */}
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 text-white font-semibold text-sm rounded-full shadow-sm">
                      {item.step}
                    </div>

                    {/* Icon */}
                    <div className="flex justify-center">
                      <Icon className="w-6 h-6 text-blue-600" strokeWidth={1.5} />
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-semibold text-gray-900">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            className="w-full flex justify-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={itemVariants}
          >
            <Link to="/register">
              <ShimmerButton background="rgba(37, 99, 235, 1)" className="text-white px-8 py-3">
                Get Started
              </ShimmerButton>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ============== TOP MENTORS SECTION ============== */}
      <section ref={mentorsRef} className="w-full bg-gray-50 py-16 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              variants={itemVariants}
            >
              Top Mentors
            </motion.h2>

            <motion.p
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Learn from experienced professionals who are passionate about
              helping others succeed.
            </motion.p>
          </motion.div>

          {/* Mentors Bento Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={containerVariants}
            className="mb-12"
          >
            <BentoGrid className="gap-6">
              {mentors.map((mentor) => (
                <motion.div 
                  key={mentor.id} 
                  variants={itemVariants}
                  className="group relative bg-white rounded-xl border border-gray-100 p-8 overflow-hidden hover:border-blue-200 transition-all duration-400 flex flex-col h-full shadow-sm hover:shadow-xl"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Border Beam Effect */}
                  <BorderBeam 
                    size={100} 
                    duration={15} 
                    delay={0}
                    colorFrom="#3b82f6"
                    colorTo="#2563eb"
                    borderWidth={1}
                  />

                  {/* Elegant gradient overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-transparent to-blue-50/0 group-hover:from-blue-50/40 group-hover:to-blue-50/20 transition-all duration-500 pointer-events-none"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  />

                  {/* Top accent line */}
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: 0.4 }}
                  />

                  {/* Content */}
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 group-hover:from-blue-100 group-hover:to-blue-200 transition-all duration-300">
                      <AnimatedAvatar initials={mentor.initials} />
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-2 tracking-tight">
                      {mentor.name}
                    </h3>

                    <p className="text-sm text-gray-500 mb-6">{mentor.expertise}</p>

                    <div className="flex items-center justify-center gap-2 pt-4 border-t border-gray-100 w-full">
                      <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-gray-900 font-semibold">
                        {mentor.rating}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </BentoGrid>
          </motion.div>

          {/* View All Button */}
          <motion.div
            className="w-full flex justify-center mt-12 md:mt-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={itemVariants}
          >
            <Link to="/dashboard">
              <ShimmerButton background="rgba(37, 99, 235, 1)" className="text-white">
                View All Mentors
              </ShimmerButton>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}



