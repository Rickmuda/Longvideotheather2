// app/routes/explenation.tsx
export default function Explenation({ setPage, Data }) {
  return (
    <div>
      <a href={Data.url} target="_blank" rel="noreferrer">
        <img src={Data.thumbnail} alt={Data.title} />
      </a>
      <h3>{Data.title}</h3>
      <h1>{Data.creator}</h1>
      <button onClick={() => setPage("essays")}>Back</button>
    </div>
  );
}
