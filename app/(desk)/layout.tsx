import WoodTable from "@/components/desk/WoodTable"
import DeskHero from "@/components/desk/DeskHero"
import SunLeaves from "@/components/desk/SunLeaves"

/**
 * The desk. Every route in this group — the home page with the plugins on it,
 * the account page with its notepad — is something lying on the same sunlit
 * wooden table: the wood, the leaf shadows and the plugin units live here, in
 * the layout, and persist across navigation; the pages render only what else
 * is on the desk.
 *
 * The units stay mounted on every desk route (DeskHero parks itself off-screen
 * away from "/") so their 3D scene is always drawn: a route transition can
 * slide a rendered layer in and out instead of a blank one. The pages' own
 * objects (the notepad) are <ViewTransition> boundaries at the page root.
 * See "view transitions" in globals.css.
 */
export default function DeskLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="desk-stage relative min-h-dvh overflow-hidden">
      <WoodTable />
      <DeskHero />
      {children}
      <SunLeaves />
    </section>
  )
}
