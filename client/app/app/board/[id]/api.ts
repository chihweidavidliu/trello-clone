import { config } from "@/config";
import { MoveTicketPayload, MoveTicketResponse } from "shared-utils";

export async function moveTicket(
  ticketId: string,
  payload: MoveTicketPayload
): Promise<MoveTicketResponse["data"]> {
  const res = await fetch(
    `${config().api.boardServiceBaseUrl}/columns/move-ticket/${ticketId}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    }
  );

  const json: MoveTicketResponse = await res.json();
  return json.data;
}
