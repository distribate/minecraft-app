import { AbortableCommandArgs, callServerCommand } from "./call-command";

type CallBroadcast = { message: string }

export async function callBroadcast(
  { message }: CallBroadcast,
  { signal }: AbortableCommandArgs
) {
  const payload = { parent: "cmi", value: `broadcast ${message}` }

  return callServerCommand(payload, { signal })
}