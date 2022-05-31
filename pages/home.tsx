import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChess,
  faBolt,
  faBoltLightning,
  faHourglass,
  faChessKnight,
} from "@fortawesome/free-solid-svg-icons";
import { faChessKnight as outlineKnight } from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";
import { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div className="mt-16 ml-40 text-contrast">
      <p className="font-bold text-4xl mb-4">Play</p>
      <p className="text-xl mb-4 font-medium">Quick pairing</p>
      <div className="flex space-x-6 mb-10">
        <SquareButton
          bigText="1 min"
          smallText="Bullet"
          icon={<FontAwesomeIcon icon={faBolt} size="2x" />}
        />
        <SquareButton
          bigText="3 min"
          smallText="Blitz"
          icon={<FontAwesomeIcon icon={faBoltLightning} size="2x" />}
        />
        <SquareButton
          bigText="5 min"
          smallText="Blitz"
          icon={<FontAwesomeIcon icon={faHourglass} size="2x" />}
        />
        <SquareButton
          bigText="10 min"
          smallText="Rapid"
          icon={<FontAwesomeIcon icon={faHourglass} size="2x" />}
        />
        <SquareButton
          bigText="15 min"
          smallText="Rapid"
          icon={<FontAwesomeIcon icon={faHourglass} size="2x" />}
        />
      </div>
      <p className="text-xl font-medium mb-4">New game</p>
      <div className="flex flex-col space-y-4">
        <RectangleButton
          bigText="Play with computer"
          smallText="Different levels"
          icon={<FontAwesomeIcon icon={faChess} size="3x" />}
        />
        <RectangleButton
          bigText="Play with computer"
          smallText="Different levels"
          icon={<FontAwesomeIcon icon={outlineKnight} size="3x" />}
        />
      </div>
      <p className="text-xl mb-4 mt-8 font-medium">Join game</p>
      <div className="bg-slate-800 flex flex-col justify-center items-center w-96 rounded-lg p-4 border-[1px] border-slate-500">
        <p>
          Create an account or sign in to join custom games and private
          challenges
        </p>
        <div classname="flex justify-between">
          <button className="bg-complementary rounded-lg p-2 text-black">
            Create account
          </button>
          <button>Log in</button>
        </div>
      </div>
      <div className="h-96"></div>
    </div>
  );
};

export default Home;

function SquareButton({
  smallText,
  bigText,
  icon,
}: {
  smallText: string;
  bigText: string;
}) {
  return (
    <Link href={"/home"}>
      <div className="flex flex-col group hover:border-indigo-700 transition-all cursor-pointer items-center justify-center bg-slate-800 border-[1px] border-slate-400 rounded-lg p-2 w-28 h-28">
        <div className="text-complementary transition-all group-hover:text-indigo-700">
          {icon}
        </div>
        <p className="font-bold text-lg text-contrast">{bigText}</p>
        <p className="font-medium text-sm text-description">{smallText}</p>
      </div>
    </Link>
  );
}

function RectangleButton({ bigText, smallText, icon }) {
  return (
    <Link href={"/home"}>
      <div className="flex items-center hover:border-indigo-700 transition-all cursor-pointer group bg-slate-800 border-[1px] border-slate-400 rounded-lg p-2 w-96 h-24">
        <div className="ml-6 text-complementary transition-all group-hover:text-indigo-700">
          {icon}
        </div>
        <div className="flex flex-col ml-6">
          <p className="font-bold text-lg text-contrast">{bigText}</p>
          <p className="font-medium text-sm text-description">{smallText}</p>
        </div>
      </div>
    </Link>
  );
}
