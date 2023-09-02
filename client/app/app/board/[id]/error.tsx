"use client";

export default function ErrorPage({ error }: { error: Error }) {
  return (
    <div>Woops something went wrong fetching the board: {error.message}</div>
  );
}
