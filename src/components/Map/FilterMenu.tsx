import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { ActivityType } from "@/types/Pins/ActivityType";

type FilterMenuProps = {
    allCategories: string[];
    categoryFilter: ActivityType[];
    setCatFilter: Dispatch<SetStateAction<string[]>>;
    setTrigger: Dispatch<any>;
}

function FilterMenu({ allCategories, categoryFilter, setCatFilter, setTrigger }: FilterMenuProps) {
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
        <div className="hide-scrollbar w-full h-full flex flex-col justify-start items-center pt-20 overflow-y-scroll bg-dark-sea/95">
            <h3 className="mb-6 text-5xl text-white">Categories</h3>
            <div className="w-full flex flex-row justify-center items-center py-3 mb-7">
                <button
                    className="w-full max-w-[200px] px-6 py-1.5 mr-2 whitespace-nowrap bg-bright-seaweed border-none rounded-full transition-colors disabled:text-dark-seaweed disabled:bg-darker-sea disabled:hover:bg-darker-sea xs:hover:bg-hovered-seaweed"
                    onClick={selectAll}
                    disabled={allCategories.length === categoryFilter.length}
                >Select all</button>
                <button
                    className="w-full max-w-[200px] px-6 py-1.5 whitespace-nowrap bg-bright-seaweed border-none rounded-full transition-colors disabled:text-dark-seaweed disabled:bg-darker-sea disabled:hover:bg-darker-sea xs:hover:bg-hovered-seaweed"
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
            <button
                className="w-full max-w-[200px] px-6 py-1.5 mt-8 mb-4 whitespace-nowrap bg-bright-seaweed border-none rounded-full transition-colors disabled:text-dark-seaweed disabled:bg-darker-sea disabled:hover:bg-darker-sea xs:hover:bg-hovered-seaweed"
                onClick={() => setTrigger(false)}
            >Apply</button>
        </div>
    );
}

export { FilterMenu };
