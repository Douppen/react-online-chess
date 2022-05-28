import { useClipboard } from "@mantine/hooks";

type Props = {
  id: string;
};

function SharePage({ id }: Props) {
  const clipboard = useClipboard({ timeout: 800 });
  return (
    <div className="flex flex-col items-center space-y-6 mt-10">
      <div>
        <p className="text-4xl">Challenge to a game</p>
      </div>
      <div className="bg-tertiary shadow-lg rounded-lg p-4 space-y-2">
        <p>To invite someone to play, give this URL:</p>
        <div className="flex items-center">
          <p className=" p-2 border-2 rounded-lg border-quaternary">
            https://onlinechesss.com/{id}
          </p>
          <button
            className={`${
              clipboard.copied
                ? "bg-quaternary text-white"
                : "bg-primary text-white"
            } transition-all select-none p-3 border-none rounded-lg -ml-1`}
            onClick={() => clipboard.copy("asdhoas")}
          >
            {clipboard.copied ? "Copied" : "Copy"}
          </button>
        </div>
        <p className="text-primary text-sm">
          The first person to come to this URL will play with you.
        </p>
      </div>
      <div>
        <button className="button p-3 font-medium">CANCEL</button>
      </div>
    </div>
  );
}
export default SharePage;
