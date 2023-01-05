import {    Dispatch, Fragment, SetStateAction } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDown } from "@/resources/svg/ChevronUpDown";
import { PinQueryStateMachine } from "@/types/Pins/MapPinQueryMachine";
import { ChevronDown } from "@/resources/svg/ChevronDown";

type RadiusMenuProps = {
    radius: number;
    updateRadius: Dispatch<SetStateAction<number>>;
    mapDataFetchState: PinQueryStateMachine;
    toggleMenu: Dispatch<SetStateAction<boolean>>;
}

const rangeOptionList: number[] = [1, 3, 5, 10, 15, 20, 30, 50, 100, 200];

function RadiusMenu({ radius, updateRadius, mapDataFetchState, toggleMenu }: RadiusMenuProps) {
    function changeHandler(valueMeter: number) {
        const valueKm = valueMeter * 1000;
        if (valueKm !== radius) {
            updateRadius(valueKm);
            toggleMenu(false);
        }
    }

    return (
        <div className="hide-scrollbar w-full h-full flex flex-col justify-start items-center pt-20 overflow-y-scroll bg-dark-sea/95">
            <h3 className="mb-6 text-5xl text-white">Radius</h3>
            <p className="mb-4 font-light text-white">Click on the drop-down menu to select a <span className="text-bright-seaweed">radius</span> in which you want to look for new <span className="text-bright-seaweed">spots</span>.</p>
            <div className="relative w-full">
                <Listbox
                    value={radius}
                    disabled={mapDataFetchState.value === 'pending'}
                    onChange={changeHandler}>
                    <Listbox.Button
                        name="select-radius"
                        id="select-radius-id"
                        className={`relative w-full p-4 text-left bg-no-repeat bg-clip-padding border-none rounded-xl cursor-pointer transition-colors focus:border-acid-green focus:outline-none ${mapDataFetchState.value === 'pending' ? 'bg-gray-500' : ' bg-gray-200'}`}>
                        <span className="block truncate">Selected range : <span className="ml-3 font-bold text-bright-seaweed">{radius/1000} km</span></span>
                        <span className="absolute inset-y-0 right-0 flex items-center pr-6 pointer-events-none">
                        <ChevronDown width="20px" height="20px" fill='#a2a2a2' />
                    </span>
                    </Listbox.Button>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Listbox.Options className="modest-shadow absolute top-full w-full mt-2 overflow-hidden text-left bg-white rounded-lg cursor-pointer focus:outline-none">
                            {rangeOptionList.map((option: number) => (
                                <Listbox.Option
                                    key={option + "-range-opt"}
                                    value={option}
                                    className={({ active, selected }) => `relative px-1.5 py-2.5 pr-10 pl-9 cursor-pointer transition-colors ${ selected ? 'bg-bright-seaweed' : ''} ${ active && !selected ? 'bg-hovered-seaweed' : '' }`}
                                >
                                    <span>{option} km</span>
                                </Listbox.Option>
                            ))}
                        </Listbox.Options>
                    </Transition>
                </Listbox>
            </div>
        </div>
    );
}

export { RadiusMenu };
