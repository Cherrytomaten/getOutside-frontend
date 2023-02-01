import { Dispatch, SetStateAction } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Edit } from "@/resources/svg/Edit";
import { Check } from "@/resources/svg/Check";

type EditButtonProps = {
  triggerValue: boolean;
  setTrigger: Dispatch<SetStateAction<boolean>>;
}

function EditButton({ triggerValue, setTrigger }: EditButtonProps) {
  return (
    <button
      onClick={() => setTrigger(!triggerValue)}
      className={`relative w-12 h-12 rounded-full transition-colors ${ triggerValue ? 'bg-warning' : 'bg-bright-seaweed'}`}
      title="Edit favorites"
      aria-label="Edit favorites"
    >
      <AnimatePresence>
        {!triggerValue &&
          <motion.div
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ ease: 'easeOut', duration: .2 }}
            className="absolute top-0 right-0 w-full h-full p-3"
          >
            <Edit width="100%" height="100%" fill="#FFF" />
          </motion.div>
        }
      </AnimatePresence>
      <AnimatePresence>
        {triggerValue &&
          <motion.div
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ ease: 'easeOut', duration: .2 }}
            className="absolute top-0 right-0 w-full h-full p-3"
          >
            <Check width="100%" height="100%" fill="#FFF" />
          </motion.div>
        }
      </AnimatePresence>
    </button>
  );
}

export { EditButton };
