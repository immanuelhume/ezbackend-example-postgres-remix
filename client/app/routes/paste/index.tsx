import { Box } from "@chakra-ui/react";
import type { LoaderFunction } from "remix";
import { useLoaderData } from "remix";
import { getPastes, Paste } from "../../paste";
import { PasteDisplay } from "../paste";

export const loader: LoaderFunction = async () => {
  const pastes = await getPastes();
  return pastes;
};

export default function PasteIndex() {
  const pastes = useLoaderData<Paste[]>();
  return (
    <Box height="xl" overflowY="scroll">
      {pastes?.map((p) => (
        <PasteDisplay {...p} key={p.id} link={true} truncate={true} />
      ))}
    </Box>
  );
}
