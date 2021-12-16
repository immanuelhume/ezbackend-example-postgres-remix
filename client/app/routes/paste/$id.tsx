import type { LoaderFunction } from "remix";
import { redirect, useLoaderData } from "remix";
import { getPasteById, Paste } from "../../paste";
import { PasteDisplay } from "../paste";

export const loader: LoaderFunction = async ({ params }) => {
  const { id } = params;
  if (!id) return redirect("/");
  const paste = await getPasteById(id);
  return paste;
};

export default function PasteContent() {
  const paste = useLoaderData<Paste>();
  return (
    <PasteDisplay
      {...paste}
      truncate={false}
      link={false}
      copy
      key={paste.id}
    />
  );
}
