import { Box, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import type { Paste } from "../../paste";
import { _getPastesForMe } from "../../paste";
import { PasteDisplay } from "../paste";

export default function PasteMe() {
  const [pastes, setPastes] = useState<Paste[]>();
  useEffect(() => {
    _getPastesForMe()
      .then((v) => setPastes(v))
      .catch((e) => console.log(e));
  });
  if (!pastes) {
    return (
      <Flex marginTop={4}>
        <Text color="gray">Log in to see your pastes. (◕‿◕✿)</Text>
      </Flex>
    );
  }
  return (
    <Box height="xl" overflowY="scroll">
      {pastes.map((paste: Paste) => (
        <PasteDisplay {...paste} truncate link key={paste.id} />
      ))}
    </Box>
  );
}
