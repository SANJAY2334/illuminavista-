import { motion } from "framer-motion";

export default function ServiceCard({ project, category, onClick }) {
    return (
        <motion.div
            className="relative w-full h-80 rounded-xl overflow-hidden shadow-xl cursor-pointer group border border-champagne/20 bg-charcoal"
            whileHover={{ scale: 1.02 }}
            onClick={onClick}
        >
            <img
                src={project.images[0]}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-champagne text-xs font-bold tracking-widest uppercase mb-1">
                    {category}
                </p>
                <h3 className="text-xl font-heading text-white group-hover:text-gold transition-colors duration-300">
                    {project.title}
                </h3>
                <div className="w-12 h-0.5 bg-gold mt-3 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </div>
        </motion.div>
    );
}
