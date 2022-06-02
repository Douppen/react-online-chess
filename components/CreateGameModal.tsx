import { Modal, Slider } from "@mantine/core";

const CreateGameModal = () => {
  return (
    <div>
      <Modal
        withCloseButton={false}
        opened={true}
        onClose={() => {}}
        styles={{
          modal: {
            backgroundColor: "hsl(202, 41%, 23%)",
          },
        }}
        size="100vw"
      >
        <div className="text-white">
          <header className="flex items-center justify-between">
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
          <h3 className="font-medium text-lg">Play against</h3>
          <div className="flex space-x-3 my-4">
            <button className="bg-darklight p-2 px-4 h-10 rounded-full text-ligthsquare hover:ring-1 ring-darksquare border-ligthsquare">
              Anybody
            </button>
            <button className="bg-darklight p-2 px-4 h-10 hover:ring-1 ring-darksquare rounded-full text-ligthsquare">
              Friend
            </button>
            <button className="bg-darklight p-2 px-4 h-10 hover:ring-1 ring-darksquare rounded-full text-ligthsquare">
              Computer
            </button>
          </div>
          <div>
            <Slider />
          </div>
          <div>
            <Slider />
          </div>
          <input type="text" className="focus:outline-none rounded-lg" />
          <div>
            <h4>Color</h4>
            <button>White</button>
            <button>Random</button>
            <button>Black</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
export default CreateGameModal;
