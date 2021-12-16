// Just redirect to /paste

import type { LoaderFunction, MetaFunction } from "remix";
import { redirect } from "remix";

export let meta: MetaFunction = () => {
  return {
    title: "BinPaste",
    description: "Welcome to BinPaste!",
  };
};

export const loader: LoaderFunction = ({ request }) => {
  return redirect("/paste");
};

export default function Index() {
  return null;
}
