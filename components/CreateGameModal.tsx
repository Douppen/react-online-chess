import {
  Modal,
  NumberInput,
  NumberInputProps,
  Slider,
  SliderProps,
  TextInput,
  TextInputProps,
} from "@mantine/core";
import CustomTextInput from "./CustomTextInput";

const CreateGameModal = () => {
  return (
    <Modal
      withCloseButton={false}
      opened={true}
      onClose={() => {}}
      classNames={{
        modal: "bg-modalbg md:mt-16 md:w-2/3 max-w-2xl",
      }}
    >
      <div className="text-white">
        <header className="flex items-center justify-between mb-4">
          <button className="hover:bg-slate-500 p-2 rounded-full">
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
          <div className="space-y-4 mt-12 mb-4">
            <div className="flex items-center space-x-4">
              <CustomNumberInput min={1} max={30} />
              <p className="font-medium">Minutes for each side</p>
            </div>
            <CustomSlider step={1} min={1} max={30} />
          </div>
          <div className="space-y-4 mt-8 mb-8">
            <div className="flex items-center space-x-4">
              <CustomNumberInput min={1} max={30} />
              <p className="font-medium">Increment in seconds</p>
            </div>
            <CustomSlider step={1} min={1} max={30} />
          </div>
          <CustomTextInput placeholder="Friend's username" />
          <div className="mt-6">
            <h4 className="font-medium mb-4">Color</h4>
            <div className="flex items-center space-x-8">
              <button className="font-light ml-4 flex flex-col space-y-2 items-center">
                <div className="w-6 h-6 rounded-full border-[1.4px] border-white bg-white"></div>
                <p>white</p>
              </button>
              <button className="font-light flex flex-col space-y-2 items-center">
                <div
                  className="w-6 h-6 rounded-full border-[1.4px] border-white bg-white"
                  style={{
                    background:
                      "linear-gradient( 90deg, black 50%, white 50.1%",
                  }}
                ></div>
                <p>random</p>
              </button>
              <button className="font-light flex flex-col space-y-2 items-center">
                <div className="w-6 h-6 rounded-full border-[1.4px] border-white bg-black"></div>
                <p>black</p>
              </button>
            </div>
          </div>
          <button className="orangebutton w-full mt-12 py-3 text-xl">
            Send Challenge
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateGameModal;

function CustomNumberInput({ ...rest }: NumberInputProps) {
  return (
    <NumberInput
      {...rest}
      hideControls
      variant="unstyled"
      classNames={{
        unstyledVariant:
          "bg-darklight p-2 focus:bg-modalbg text-2xl font-medium focus:ring-indigo-400 focus:ring-2 text-indigo-300 text-center px-2 h-10 w-16 transition-all rounded-lg text-ligthsquare hover:ring-2 ring-darksquare border-ligthsquare",
      }}
    />
  );
}

function CustomSlider({ ...rest }: SliderProps) {
  return (
    <Slider
      {...rest}
      styles={{
        track: {
          ":before": {
            backgroundColor: "hsl(212, 24%, 35%)",
          },
        },
        thumb: {
          backgroundColor: "hsl(212, 24%, 40%)",
          border: "none",
          borderRadius: "4px",
          width: "24px",
          height: "24px",
          boxShadow: "1px 1px 5px 0.1px hsl(192, 61%, 9%)",
        },
      }}
      classNames={{
        bar: "bg-indigo-400",
      }}
      label={null}
      thumbChildren={
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 4C0 1.79086 1.79086 0 4 0H20C22.2091 0 24 1.79086 24 4V20C24 22.2091 22.2091 24 20 24H4C1.79086 24 0 22.2091 0 20V4Z"
            fill="none"
          ></path>
          <path
            opacity="0.6"
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M8.4707 7.5C8.74685 7.5 8.9707 7.72386 8.9707 8V16C8.9707 16.2761 8.74685 16.5 8.4707 16.5C8.19456 16.5 7.9707 16.2761 7.9707 16V8C7.9707 7.72386 8.19456 7.5 8.4707 7.5ZM12.4707 7.5C12.7468 7.5 12.9707 7.72386 12.9707 8V16C12.9707 16.2761 12.7468 16.5 12.4707 16.5C12.1946 16.5 11.9707 16.2761 11.9707 16V8C11.9707 7.72386 12.1946 7.5 12.4707 7.5ZM16.9707 8C16.9707 7.72386 16.7468 7.5 16.4707 7.5C16.1946 7.5 15.9707 7.72386 15.9707 8V16C15.9707 16.2761 16.1946 16.5 16.4707 16.5C16.7468 16.5 16.9707 16.2761 16.9707 16V8Z"
            fill="#DBE2E8"
          ></path>
        </svg>
      }
    />
  );
}
