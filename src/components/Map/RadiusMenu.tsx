import { Radius } from "@/resources/svg/Radius";

function RadiusMenu() {
    return (
        <div className="z-[999] absolute top-20 right-4 md:right-8">
            <div
                className="w-14 h-14 flex flex-col justify-center items-center px-3 bg-bright-seaweed rounded-full shadow-md transition-colors cursor-pointer xs:hover:bg-hovered-seaweed"
                role="button"
                aria-label="Radius filter"
            >
                <Radius width="100%" height="auto" fill="#fff"></Radius>
            </div>
        </div>
    );
}

export { RadiusMenu };
