import { BoardDTO, GetBoardByIdResponse } from "shared-utils";
import BoardPageClient from "./BoardPageClient";

async function getBoardData(id: string): Promise<BoardDTO> {
  const res = await fetch(
    `http://localhost:5000/boards/${id}?include=columns,tickets`
  );

  const json: GetBoardByIdResponse = await res.json();

  if (!json.data.board || json.errors) {
    throw new Error(`Failed to fetch board: ${json.errors}`);
  }

  return json.data.board;
}

interface BoardPageProps {
  params: { id: string };
}

export default async function BoardPage({ params }: BoardPageProps) {
  console.log("params", params);

  const board = await getBoardData(params.id);

  console.log("board", board);
  return <BoardPageClient board={board} />;
}
