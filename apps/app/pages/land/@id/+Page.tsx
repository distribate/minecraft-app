import { pageContextAtom } from "@/shared/models/global.model"
import { Land } from "@/shared/components/app/land/components/land"
import { landAtom } from "@/shared/components/app/land/models/land.model"
import { MainWrapperPage } from "@/shared/components/config/wrapper";
import { Data } from "./+data"
import { PageContext } from "vike/types"

const getLandUrl = (id: string) => `/land/${id}`

pageContextAtom.onChange((ctx, state) => {
  if (!state) return;

  const target = state as PageContext<Data>
  const land = target.data?.land ?? null

  if (target.urlPathname === getLandUrl(target.routeParams.id)) {
    landAtom(ctx, land)
  }
})

export default function LandPage() {
  return (
    <MainWrapperPage>
      <Land />
    </MainWrapperPage>
  )
}