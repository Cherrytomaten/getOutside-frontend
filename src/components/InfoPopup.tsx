import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type InfoPopupProps = {
    text: string;
    exp: number;
}

function InfoPopup({ text ,exp }: InfoPopupProps) {
    const [showPopup, setShowPopup] = useState<boolean>(true);
    const [removeFromDOM, setRemoveFromDOM] = useState<boolean>(false);

    useEffect(() => {
        setTimeout(() => {
            setShowPopup(false);
            setTimeout(() => {
                setRemoveFromDOM(true);
            }, 400);
        }, exp);
    }, [exp])

    if (removeFromDOM) {
        return null;
    }

    return (
        <AnimatePresence>
            {showPopup &&
                <motion.div
                    initial={{x: "-100%", opacity: 0}}
                    animate={{x: 0, opacity: 1}}
                    exit={{x: "100%", opacity: 0}}
                    className="z-[99999] absolute bottom-24 left-0 w-full h-auto px-4">
                    <div className="relative w-full h-full p-3 pb-3.5 overflow-hidden bg-orange-sun rounded-md shadow-xl">
                        <p className="text-sm text-default-font">{text}</p>
                        <motion.div
                            initial={{ scaleX: 1 }}
                            animate={{ scaleX: 0 }}
                            style={{ originX: 0 }}
                            transition={{ ease: "linear", duration: exp/1000 }}
                            className="absolute bottom-0 left-0 w-full h-1 bg-default-font rounded-r-full"></motion.div>
                    </div>
                </motion.div>
            }
        </AnimatePresence>
    );
}

export { InfoPopup };
