import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Mail,
  MapPin,
  Briefcase,
  Award,
  BookOpen,
  Target,
  User,
  Calendar,
  Zap,
  Star,
} from 'lucide-react';

/**
 * StudentProfileCard Component
 * 
 * Displays a modal view of a student's profile with:
 * - Basic information (name, email, location)
 * - Profile completion status
 * - Skills and expertise
 * - Goals and aspirations
 * - Bio and current role
 */
export default function StudentProfileCard({ student, isOpen, onClose }) {
  if (!isOpen || !student) return null;

  // Calculate profile completion percentage
  const calculateCompletion = () => {
    const fields = [
      student.bio,
      student.dateOfBirth,
      student.location,
      student.currentRole,
      student.skills,
      student.goals,
    ];
    const filledFields = fields.filter((f) => f && f.toString().trim().length > 0).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const completion = calculateCompletion();

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        {/* Modal Content */}
        <motion.div
          className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-lg"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 350, damping: 35, mass: 0.8 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <motion.button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-2 hover:bg-slate-100 rounded-lg transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <X size={24} className="text-slate-600" />
          </motion.button>

          {/* Header Section */}
          <motion.div
            className="bg-white px-6 md:px-6 pt-6 pb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 350, damping: 35 }}
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <motion.div
                className="w-14 h-14 rounded-lg bg-linear-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-xl font-bold text-blue-700 shrink-0"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 350, damping: 35 }}
              >
                {student.fullName?.charAt(0) || 'S'}
              </motion.div>

              {/* Header Info */}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-slate-900 mb-2">{student.fullName || 'Student'}</h2>
                <p className="text-sm text-slate-600 mb-3">{student.email}</p>
              </div>
            </div>
          </motion.div>

          {/* Divider */}
          <div className="h-px bg-slate-100" />

          {/* Content Sections */}
          <div className="p-6 md:p-6 space-y-5">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 350, damping: 35 }}
            >
              <div className="space-y-3">
                {student.location && (
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-blue-600 mt-1 shrink-0" />
                    <div className="flex-1">
                      <p className="text-slate-700">{student.location}</p>
                    </div>
                  </div>
                )}
                {student.dateOfBirth && (
                  <div className="flex items-start gap-3">
                    <Calendar size={18} className="text-blue-600 mt-1 shrink-0" />
                    <div className="flex-1">
                      <p className="text-slate-700">
                        {new Date(student.dateOfBirth).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
                {student.currentRole && (
                  <div className="flex items-start gap-3">
                    <Briefcase size={18} className="text-blue-600 mt-1 shrink-0" />
                    <div className="flex-1">
                      <p className="text-slate-700">{student.currentRole}</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Bio Section */}
            {student.bio && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, type: 'spring', stiffness: 350, damping: 35 }}
              >
                <label className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <BookOpen size={18} className="text-blue-600 shrink-0" />
                  About
                </label>
                <p className="text-slate-700 leading-relaxed">{student.bio}</p>
              </motion.div>
            )}

            {/* Skills Section */}
            {student.skills && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 350, damping: 35 }}
              >
                <label className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <Award size={18} className="text-blue-600 shrink-0" />
                  Skills & Expertise
                </label>
                <div className="flex flex-wrap gap-2">
                  {student.skills
                    .split(',')
                    .map((skill, idx) => (
                      <motion.span
                        key={idx}
                        className="px-3 py-1 bg-blue-50 border border-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:border-blue-300 transition-colors"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + idx * 0.03, type: 'spring', stiffness: 350, damping: 35 }}
                        whileHover={{ y: -2 }}
                      >
                        {skill.trim()}
                      </motion.span>
                    ))}
                </div>
              </motion.div>
            )}

            {/* Goals Section */}
            {student.goals && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, type: 'spring', stiffness: 350, damping: 35 }}
              >
                <label className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
                  <Target size={18} className="text-blue-600 shrink-0" />
                  Career Goals
                </label>
                <p className="text-slate-700 leading-relaxed">{student.goals}</p>
              </motion.div>
            )}

            {/* Profile Completion Checklist */}
            {(student.bio || student.dateOfBirth || student.location || student.currentRole || student.skills || student.goals) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, type: 'spring', stiffness: 350, damping: 35 }}
              >
                <label className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Zap size={18} className="text-blue-600 shrink-0" />
                  Profile Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Bio', value: student.bio },
                  { label: 'Date of Birth', value: student.dateOfBirth },
                  { label: 'Location', value: student.location },
                  { label: 'Current Role', value: student.currentRole },
                  { label: 'Skills', value: student.skills },
                  { label: 'Goals', value: student.goals },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-center gap-2 text-sm"
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + idx * 0.02, type: 'spring', stiffness: 350, damping: 35 }}
                  >
                    {item.value && item.value.toString().trim().length > 0 ? (
                      <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center shrink-0">
                        <Star size={10} fill="currentColor" className="text-white" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-slate-200 shrink-0" />
                    )}
                    <span className="text-slate-700">{item.label}</span>
                  </motion.div>
                ))}
              </div>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <motion.div
            className="border-t border-slate-100 bg-white px-6 md:px-6 py-4 rounded-b-xl flex justify-end gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, type: 'spring', stiffness: 350, damping: 35 }}
          >
            <motion.button
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg font-medium transition-colors text-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Close
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
