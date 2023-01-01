import { Dispatch, ReactNode, useEffect } from "react";
import { AnimatePresence, motion, PanInfo } from "framer-motion";
import CloseSvg from '@/resources/svg/Close';
import { isFirefox } from 'react-device-detect';

type ContentPopupProps = {
    children: ReactNode;
    trigger: any
    setTrigger: Dispatch<any>
}

const variants = {
    showContainer: {
        opacity: 1,
        transition: {
            ease: 'easeOut',
            duration: .2
        }
    },
    hideContainer: {
        opacity: 0,
        transition: {
            ease: 'easeOut',
            duration: .2,
            delay: .5
        },
    }
}

function ContentPopup({trigger, setTrigger, children}: ContentPopupProps) {
    useEffect(() => {
        if (trigger) {
            window.scrollTo(0, 0);
        }
    }, [trigger]);

    function handleDragEvent(pInfo: PanInfo) {
        if (pInfo.offset.y > 120) {
            setTrigger(false);
        }
    }

    return (
        <AnimatePresence>
            {trigger &&
                <motion.div
                    variants={variants}
                    initial={{opacity: 0}}
                    animate="showContainer"
                    exit="hideContainer"
                    className="hide-scrollbar z-[9999] absolute top-0 left-0 w-full h-full flex flex-col justify-start items-center pt-10 overflow-hidden bg-dark-sea/60 backdrop-blur-sm md:px-5">
                    <motion.div
                        initial={{y: '100%'}}
                        animate={{y: 0}}
                        exit={{y: '100%'}}
                        transition={{ease: [.65, .33, .54, 1.01], duration: .2, delay: .15}}
                        drag={!isFirefox ? 'y' : undefined}
                        dragConstraints={{top: 0, right: 0, left: 0, bottom: 120}}
                        dragSnapToOrigin={true}
                        onDragEnd={(e, info) => {
                            handleDragEvent(info)
                        }}
                        className="relative w-full max-w-6xl h-full px-6 pt-15 overflow-y-scroll bg-dark-sea rounded-t-xl touch-none md:px-10">
                        <button
                            className="modest-shadow absolute top-4 right-4 w-10 h-10 p-2 bg-bright-seaweed rounded-full transition-colors hover:xs:bg-hovered-seaweed"
                            onClick={() => setTrigger(false)}>
                            <CloseSvg width="100%" height="auto" fill="#fff"/>
                        </button>
                        {children}
                    </motion.div>
                </motion.div>
            }
        </AnimatePresence>
    );
}

export { ContentPopup };
