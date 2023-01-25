import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { sanititzeUrlParams } from "@/util/sanititzeUrlParams";
import { ActivateRegisteredUserProps } from "@/types/User/ActivateRegisteredUserProps";
import { RegisterRepoClass } from "@/repos/RegisterRepo";
import { FetchServerErrorResponse } from "@/types/Server/FetchServerErrorResponse";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

function ConfirmEmail() {
    const router = useRouter();
    const [serverErr, setServerErr] = useState<string | null>(null);
    const [activationStatus, setActivationStatus] = useState<boolean>(false);

    useEffect(() => {
        const params: ActivateRegisteredUserProps | null = sanititzeUrlParams(router.asPath) as ActivateRegisteredUserProps;
        if (params === null || !params.user_uuid || !params.user_mail || !params.confirmation_token) {
            router.push('/');
        } else {
            RegisterRepoClass.activateUser({
                user_uuid: params.user_uuid,
                user_mail: params.user_mail,
                confirmation_token: params.confirmation_token
            })
                .then((_res) => {
                    setActivationStatus(true);
                })
                .catch((err: FetchServerErrorResponse) => {
                    setServerErr(err.errors.message);
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <main className="w-full h-screen flex flex-col justify-start items-center pt-16 overflow-x-hidden">
            <AnimatePresence>
                {activationStatus && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ ease: 'easeOut', duration: 0.2 }}
                        className="flex flex-col justify-center items-center"
                    >
                        <h2 className="px-3 pb-3 text-2xl text-center text-white xs:text-3xl">
                            Your account got activated successfully!
                        </h2>
                        <p className="px-3 pb-10 text-lg text-center text-bright-seaweed">You can now log in.</p>
                        <Link href="/login">
                            <button
                                type="button"
                                id="already-signedup-btn"
                                className="w-full max-w-xs p-2 mb-4 text-dark-sea bg-bright-seaweed rounded-md transition-colors cursor-pointer hover:bg-hovered-seaweed"
                            >
                                Login
                            </button>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>
                {serverErr !== null && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ ease: 'easeOut', duration: 0.2 }}
                    >
                        <p className="input-error-text mt-1 text-danger">
                            {serverErr}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>

    );
}

export default ConfirmEmail;
