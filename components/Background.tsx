const WHITE = "#f0c37f";
const BLACK = "#cc9704";

interface RowProps {
  row: number;
}

const Row = ({ row }: RowProps) => {
  return (
    <div className="flex flex-1">
      {new Array(8).fill(0).map((_, col) => {
        return <Tile row={row} col={col} key={col} />;
      })}
    </div>
  );
};

interface TileProps extends RowProps {
  col: number;
}

const Tile = ({ row, col }: TileProps) => {
  const backgroundColor = (col + row) % 2 === 0 ? WHITE : BLACK;

  return (
    <div
      style={{ backgroundColor }}
      className="relative flex-1 w-[75px] h-[75px] select-none"
    >
      <p style={{ opacity: col === 0 ? 1 : 0 }}>{8 - row}</p>
      <p
        style={{ opacity: row === 7 ? 1 : 0 }}
        className="absolute bottom-0 right-0"
      >
        {String.fromCharCode("a".charCodeAt(0) + col)}
      </p>
    </div>
  );
};

const Background = () => {
  return (
    <div className="bg-slate-200 flex flex-col -z-10">
      {new Array(8).fill(0).map((_, row) => {
        return <Row row={row} key={row} />;
      })}
    </div>
  );
};

export default Background;
