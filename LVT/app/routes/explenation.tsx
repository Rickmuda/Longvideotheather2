// app/routes/explenation.tsx
// eslint-disable-next-line react/prop-types
interface DataProps {
  url: string;
  thumbnail: string;
  title: string;
  creator: string;
  caption: string;
}

interface ExplenationProps {
  setPage: (page: string) => void;
  Data: DataProps;
}

export default function Explenation({ setPage, Data }: ExplenationProps) {
  return (
    <div>
      <a href={Data.url} target="_blank" rel="noreferrer">
        <img src={Data.thumbnail} alt={Data.title} />
      </a>
      <h3>{Data.title}</h3>
      <h1>{Data.creator}</h1>
      <h2>{Data.caption}</h2>
      <button onClick={() => setPage("essays")}>Back</button>
    </div>
  );
}
