import { useState } from "react";
import { motion } from "framer-motion";

export default function ServiceCard({ project = {}, category = "", onClick }) {
    const [isLoaded, setIsLoaded] = useState(false);

    const imageSrc =
        project?.images?.[0] ||
        "https://placehold.co/600x800/0d0f17/ffffff?text=No+Image";

    return (
        <motion.div
            className="
                relative w-full aspect-[4/5]
                rounded-xl overflow-hidden shadow-xl cursor-pointer group
                border border-champagne/20 bg-charcoal
            "
            whileHover={{ scale: 1.02 }}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onClick?.()}
        >
            {/* IMAGE */}
            <img
                src={imageSrc}
                alt={project?.title || "Project"}
                className={`
                    w-full h-full object-cover transition-transform duration-700
                    ${isLoaded ? "opacity-100 group-hover:scale-110" : "opacity-0"}
                `}
                onLoad={() => setIsLoaded(true)}
            />

            {/* SKELETON SHIMMER */}
            {!isLoaded && (
                <div className="absolute inset-0 bg-gray-800 animate-pulse" />
            )}

            {/* GRADIENT OVERLAY (refined) */}
            <div
                className="
                    absolute inset-0
                    bg-gradient-to-t from-black/85 via-black/40 to-transparent
                    opacity-70 group-hover:opacity-90
                    transition-all duration-300
                "
            />

            {/* CONTENT */}
            <div
                className="
                    absolute bottom-0 left-0 w-full p-6
                    translate-y-2 group-hover:translate-y-0
                    transition-transform duration-300
                "
            >
                <p className="text-champagne text-xs font-bold tracking-widest uppercase mb-1">
                    {category || "Category"}
                </p>

                <h3
                    className="
                        text-xl font-heading text-white mb-1
                        group-hover:text-gold transition-colors duration-300
                    "
                >
                    {project?.title || "Untitled Project"}
                </h3>

                {/* Accent Line */}
                <div
                    className="
                        w-12 h-0.5 bg-gold mt-3
                        transform scale-x-0 group-hover:scale-x-100
                        transition-transform duration-300 origin-left
                    "
                />
            </div>
        </motion.div>
    );
}
