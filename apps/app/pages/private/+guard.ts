import { GuardAsync } from "vike/types";
import { redirect } from "vike/abort";
import { validatePrivate } from "@/shared/lib/validators";

export const guard: GuardAsync = async (pageContext) => {
  const isValid = await validatePrivate({ headers: pageContext.headers ?? undefined })

  if (!isValid) {
    throw redirect("/")
  }
}