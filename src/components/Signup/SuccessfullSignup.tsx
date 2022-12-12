import LogoNew from "@/resources/svg/Logo_new";
import Link from "next/link";

type SuccessfullSignupProps = {
    username: string;
}

function SuccessfullSignup({ username }: SuccessfullSignupProps) {
    return (
        <main id="successfull-signup-container" className="w-full h-screen flex flex-col justify-start items-center overflow-x-hidden">
            <div className="w-full h-2/5 max-h-64 flex justify-center my-[6vh]">
                <LogoNew width="auto" height="100%"/>
            </div>
            <h2 className="px-3 pb-3 text-2xl text-center text-white xs:text-3xl">Welcome <span
                className="text-bright-seaweed">{username}</span>!</h2>
            <h3 className="px-3 pb-10 text-2xl text-center text-white xs:text-3xl">You&apos;ve been signed up
                successfully!</h3>
            <Link href="/login">
                <button
                    type="button"
                    id="already-signedup-btn"
                    className="w-full max-w-xs p-2 mb-4 text-dark-sea bg-bright-seaweed rounded-md transition-colors cursor-pointer hover:bg-hovered-seaweed"
                >
                    Login
                </button>
            </Link>
        </main>
    )
}

export { SuccessfullSignup };
