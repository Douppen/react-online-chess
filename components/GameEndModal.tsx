import {
  Modal,
  ModalProps,
  NumberInput,
  NumberInputProps,
  Slider,
  SliderProps,
} from "@mantine/core";
import { GameModalProps } from "../types/types";
import CustomTextInput from "./CustomTextInput";

export default function GameEndModal({ opened, onClose, ...rest }: ModalProps) {
  return (
    <Modal
      {...rest}
      withCloseButton={false}
      opened={opened}
      onClose={onClose}
      classNames={{
        modal: "bg-dark md:mt-16 md:w-2/3 max-w-2xl",
      }}
    >
      <div className="text-white">
        <header className="flex items-center justify-between mb-4">
          <button
            onClick={() => onClose()}
            className="hover:bg-slate-500 p-2 rounded-full"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <div className="flex justify-center">
            <h2 className="text-2xl font-medium pb-[2px]">Create a game</h2>
          </div>
          <div className="w-10"></div>
        </header>
        <div className="px-4">
          <h3 className="font-medium text-lg">Play against</h3>
          <div className="flex space-x-3 my-4 overflow-x-scroll hide-scroll">
            <button className="bg-darklight shrink-0 p-2 px-4 h-10 transition-all rounded-full text-ligthsquare hover:ring-2 ring-darksquare border-ligthsquare">
              Anybody
            </button>
            <button className="bg-darklight shrink-0 p-2 px-4 h-10 transition-all hover:ring-2 ring-darksquare rounded-full text-ligthsquare">
              Friend
            </button>
            <button className="bg-darklight shrink-0 p-2 px-4 h-10 transition-all hover:ring-2 ring-darksquare rounded-full text-ligthsquare">
              Computer
            </button>
          </div>
          <div className="space-y-4 mt-12 mb-4"></div>
          <div className="space-y-4 mt-8 mb-8">
            <CustomTextInput placeholder="Friend's username" />
            <div className="mt-6">
              <h4 className="font-medium mb-4">Color</h4>
              <div className="flex items-center space-x-8 select-none"></div>
            </div>
            <button className="orangebutton w-full mt-12 py-3 text-xl">
              Send Challenge
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
