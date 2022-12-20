import { motion } from "framer-motion";

function SmallSpinner() {
    return (
        <motion.div
            exit={{ opacity: 0 }}
            transition={{ ease: 'easeOut', duration: .3 }}
            role="img"
            aria-label="loading"
            className="z-[1001] absolute bottom-6 left-6"
        >
            <motion.div
                exit={{ width: 0, height: 0 }}
                transition={{ ease: 'easeOut', duration: .5 }}
                className="modest-shadow w-7 h-7 border-t-[6px] border-t-bright-seaweed border-[6px] rounded-full border-gray-500 animate-spin"></motion.div>
        </motion.div>
    );
}

export { SmallSpinner };
