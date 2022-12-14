import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { ActivityType } from "@/types/Pins/ActivityType";
import CloseSvg from "@/resources/svg/Close";

type FilterMenuProps = {
    allCategories: string[];
    categoryFilter: ActivityType[];
    setCatFilter: Dispatch<SetStateAction<string[]>>;
    showMenuFunc: Dispatch<SetStateAction<boolean>>;
}

function FilterMenu({ allCategories, categoryFilter, setCatFilter, showMenuFunc }: FilterMenuProps) {
    function capitalizeFirstLetter(text: string) {
        if (text.length === 0) { return ""; }
        return text.charAt(0).toUpperCase() + text.slice(1);
    }

    function changeHandler(event: ChangeEvent<HTMLInputElement>) {
        const { target: { value } } = event;

        if (event.target.checked) {
            if (!categoryFilter.includes(value)) {
                setCatFilter([...categoryFilter, value]);
            }
        } else {
            if (categoryFilter.includes(value)) {
                setCatFilter(categoryFilter.filter(elem => elem !== value));
            }
        }
    }

    function selectAll() {
        setCatFilter([...allCategories]);
    }

    function unselectAll() {
        setCatFilter([]);
    }

    return (
        <div className="w-full h-full flex flex-col justify-start items-center pt-20 overflow-y-scroll bg-dark-sea/95">
            <div
                role="button"
                aria-label="Close menu"
                className="absolute top-4 right-4 w-14 h-14 flex flex-col justify-center items-center px-3 bg-bright-seaweed rounded-full transition-colors cursor-pointer xs:hover:bg-hovered-seaweed md:right-8"
                onClick={() => showMenuFunc(false)}
            >
                <CloseSvg width="100%" height="auto" fill="#fff" />
            </div>
            <h3 className="mb-6 text-4xl text-white">Categories</h3>
            <div className="w-full flex flex-row justify-center items-center py-3 mb-7 bg-dark-seaweed">
                <button
                    className="px-4 py-1 mr-2 bg-bright-seaweed border-none rounded-full transition-colors disabled:bg-dark-sea disabled:hover:bg-dark-sea md:hover:bg-hovered-seaweed"
                    onClick={selectAll}
                    disabled={allCategories.length === categoryFilter.length}
                >Select all</button>
                <button
                    className="px-4 py-1 bg-bright-seaweed border-none rounded-full transition-colors disabled:bg-dark-sea disabled:hover:bg-dark-sea md:hover:bg-hovered-seaweed"
                    onClick={unselectAll}
                    disabled={categoryFilter.length === 0}
                >Unselect all</button>
            </div>
            <form>
                {allCategories.map((catElem: string) => {
                    return(
                        <div key={catElem + "-key"} className="mb-3 cursor-pointer">
                            <input
                                type="checkbox"
                                id={catElem + "-id"}
                                value={catElem}
                                className="hidden"
                                aria-hidden="true"
                                checked={categoryFilter.includes(catElem)}
                                onChange={changeHandler}
                            />
                            <label
                                htmlFor={catElem + "-id"}
                                className="checkbox-label flex flex-row justify-start items-center mr-2 text-lg font-light text-white transition-colors cursor-pointer select-none"
                            >
                                <div className="checkbox-custom-input w-4 h-4 mt-0.5 mr-2 bg-transparent border rounded-full border-bright-seaweed transition-colors"></div>
                                {capitalizeFirstLetter(catElem)}
                            </label>
                        </div>
                    );
                })}
            </form>
        </div>
    );
}

export { FilterMenu };
