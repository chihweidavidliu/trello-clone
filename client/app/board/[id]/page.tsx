import Image from "next/image";
import { mockColumns } from "../../mock-data";
import BoardPageClient from "./BoardPageClient";

async function getBoardData(id: string) {
  // const res = await fetch("https://api.example.com/...");
  // // The return value is *not* serialized
  // // You can return Date, Map, Set, etc.
  // if (!res.ok) {
  //   // This will activate the closest `error.js` Error Boundary
  //   throw new Error("Failed to fetch data");
  // }
  // return res.json();

  return Promise.resolve(mockColumns);
}

interface BoardPageProps {
  params: { id: string };
}

export default async function BoardPage({ params }: BoardPageProps) {
  console.log("params", params);

  const columns = await getBoardData(params.id);

  console.log("columns", columns);
  return (
    <main className="min-h-screen text-center bg-white">
      <BoardPageClient initialColumns={columns || []} />
    </main>
  );
}
