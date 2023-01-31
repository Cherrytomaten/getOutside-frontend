import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { ActivityType } from '@/types/Pins/ActivityType';
import { capitalizeFirstLetter } from "@/util/capitalizeFirstLetter";

type FilterMenuProps = {
  allCategories: string[];
  categoryFilter: ActivityType[];
  setCatFilter: Dispatch<SetStateAction<string[]>>;
  onlyShowFavs: boolean;
  setOnlyShowFavs: Dispatch<SetStateAction<boolean>>;
  setTrigger: Dispatch<any>;
};

function FilterMenu({ allCategories, categoryFilter, setCatFilter, setTrigger, setOnlyShowFavs, onlyShowFavs }: FilterMenuProps) {
  function changeHandler(event: ChangeEvent<HTMLInputElement>) {
    const {
      target: { value },
    } = event;

    if (event.target.checked) {
      if (!categoryFilter.includes(value)) {
        setCatFilter([...categoryFilter, value]);
      }
    } else {
      if (categoryFilter.includes(value)) {
        setCatFilter(categoryFilter.filter((elem) => elem !== value));
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
      {allCategories.length !== 0 && (
        <>
          <button
            className={`w-full max-w-[400px] px-6 py-1.5 mt-1 mb-3 whitespace-nowrap text-bright-seaweed border rounded-full transition-colors ${onlyShowFavs ? 'bg-warning border-warning text-dark-sea' : 'bg-transparent border-bright-seaweed'}`}
            onClick={() => setOnlyShowFavs(!onlyShowFavs)}
          >Only show favorite pins</button>
          <div className="w-full flex flex-row justify-center items-center py-3 mb-7">
            <button
              className="w-full max-w-[200px] px-6 py-1.5 mr-2 whitespace-nowrap bg-bright-seaweed border-none rounded-full transition-colors disabled:text-dark-seaweed disabled:bg-darker-sea disabled:hover:bg-darker-sea xs:hover:bg-hovered-seaweed"
              onClick={selectAll}
              disabled={allCategories.length === categoryFilter.length}>
              Select all
            </button>
            <button
              className="w-full max-w-[200px] px-6 py-1.5 whitespace-nowrap bg-bright-seaweed border-none rounded-full transition-colors disabled:text-dark-seaweed disabled:bg-darker-sea disabled:hover:bg-darker-sea xs:hover:bg-hovered-seaweed"
              onClick={unselectAll}
              disabled={categoryFilter.length === 0}>
              Unselect all
            </button>
          </div>
        </>
      )}
      <form>
        {allCategories.map((catElem: string) => {
          return (
            <div key={catElem + '-key'} className="mb-3 cursor-pointer">
              <input type="checkbox" id={catElem + '-id'} value={catElem} className="hidden" aria-hidden="true" checked={categoryFilter.includes(catElem)} onChange={changeHandler} />
              <label htmlFor={catElem + '-id'} className="checkbox-label flex flex-row justify-start items-center mr-2 text-lg font-light text-white transition-colors cursor-pointer select-none">
                <div className="checkbox-custom-input w-4 h-4 mt-0.5 mr-2 bg-transparent border rounded-full border-bright-seaweed transition-colors"></div>
                {capitalizeFirstLetter(catElem)}
              </label>
            </div>
          );
        })}
      </form>
      {allCategories.length !== 0 ? (
        <button
          className="w-full max-w-[200px] px-6 py-1.5 mt-8 mb-4 whitespace-nowrap bg-bright-seaweed border-none rounded-full transition-colors disabled:text-dark-seaweed disabled:bg-darker-sea disabled:hover:bg-darker-sea xs:hover:bg-hovered-seaweed"
          onClick={() => setTrigger(false)}>
          Apply
        </button>
      ) : (
        <p className="mt-10 text-lg text-center text-white">
          Seems like we found no spot in your currently selected range.
          <br />
          <span className="text-bright-seaweed">Try to select a higher range to find new spots!</span>
        </p>
      )}
    </div>
  );
}

export { FilterMenu };
