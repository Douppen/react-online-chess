import { useClipboard } from "@mantine/hooks";
import { deleteDoc, doc } from "firebase/firestore";
import { useRouter } from "next/router";
import { gamesCollection } from "../lib/helpers";

type Props = {
  id: string;
};

function SharePage({ id }: Props) {
  const clipboard = useClipboard({ timeout: 800 });
  const router = useRouter();

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <p className="text-4xl">Challenge someone to a game</p>
      </div>
      <div className="bg-dark shadow-lg rounded-lg p-4 space-y-2">
        <p>To invite someone to play, give this URL:</p>
        <div className="flex items-center">
          <p className=" p-2 rounded-lg bg-darklight">
            https://onlinechesss.com/{id}
          </p>
          <button
            className={`${
              clipboard.copied
                ? "bg-darklight text-white"
                : "bg-dark text-white"
            } transition-all hidden sm:flex select-none p-3 border-[1.5px] border-slate-200 h-12 items-center rounded-lg -ml-1`}
            onClick={() => clipboard.copy("asdhoas")}
          >
            {clipboard.copied ? "Copied" : "Copy"}
          </button>
        </div>
        <p className="text-contrast text-sm">
          The first person to come to this URL will play with you.
        </p>
      </div>
      <div>
        <button
          className="orangebutton px-12 py-3 font-bold"
          onClick={() => {
            const gameId = router.asPath.slice(1);
            const gameRef = doc(gamesCollection, gameId);
            deleteDoc(gameRef).then(() => {
              router.push("/");
            });
          }}
        >
          Cancel Game
        </button>
      </div>
    </div>
  );
}
export default SharePage;
