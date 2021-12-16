import { CheckIcon, LinkIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  GridItem,
  IconButton,
  Link as ChakraLink,
  SimpleGrid,
  Stack,
  Tab,
  TabList,
  Tabs,
  Text,
  Textarea,
  Tooltip,
} from "@chakra-ui/react";
import _ from "lodash";
import { useState } from "react";
import type { ActionFunction } from "remix";
import { Form, Link, Outlet, redirect } from "remix";
import type { Paste } from "../paste";
import { savePaste } from "../paste";
import { useMe } from "../session";

type actionDataReturn = {
  error?: string;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  let content = formData.get("content")?.toString();
  let userId = formData.get("userId")
    ? Number.parseInt(formData.get("userId")!.toString())
    : undefined;

  // BUG without redirecting, the nested routes
  // do not refresh their data. In fact, existing
  // data becomes undefined.
  const actionData: actionDataReturn = {};
  if (!content) {
    actionData.error = "Content cannot be empty.";
    return redirect("/");
  }

  await savePaste({ content, userId: userId });
  return redirect("/");
};

export default function Index() {
  const [me] = useMe();
  return (
    <Box padding={8}>
      <SimpleGrid row={1} columns={3} spacing={12}>
        <GridItem colSpan={2}>
          <Form method="post">
            <Stack spacing={4}>
              <Textarea height="xl" name="content" fontFamily="monospace" />
              <input type="hidden" value={me?.id} name="userId" />
              <Button type="submit" colorScheme="twitter">
                Paste It
              </Button>
            </Stack>
          </Form>
        </GridItem>

        <Box>
          <Tabs colorScheme="twitter" isFitted variant="enclosed-colored">
            <TabList>
              <Tab as={Link} to="/paste">
                Za Warudo
              </Tab>
              <Tab as={Link} to="/paste/me">
                My pastes
              </Tab>
            </TabList>
            <Outlet />
          </Tabs>
        </Box>
      </SimpleGrid>
    </Box>
  );
}

type PasteDisplayProps = Paste & {
  truncate?: boolean;
  truncateLength?: number;
  link?: boolean;
  copy?: boolean;
};

export function genAvatarUrl(seed: string | number) {
  return `https://avatars.dicebear.com/api/bottts/${seed}.svg`;
}

export const PasteDisplay: React.FC<PasteDisplayProps> = ({
  content,
  createdAt,
  userId,
  id,
  truncate,
  truncateLength,
  link,
  copy,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const displayContent = truncate
    ? _.truncate(content, { length: truncateLength || 40 })
    : content;
  return (
    <Stack spacing="12px" padding={4} maxH="xl" overflowY="scroll">
      <Divider />
      <Flex>
        <Flex align="center">
          <Avatar
            src={genAvatarUrl(userId || content)}
            size="sm"
            marginRight={4}
          />
          <Text fontWeight="bold">
            {userId ? `User #${userId}` : "Anonymous"}
          </Text>
        </Flex>

        <Stack marginLeft="auto" align="end">
          <Text>{createdAt}</Text>
          {copy && (
            <Tooltip label={copied ? "Copied to clipboard" : "Get link"}>
              <IconButton
                aria-label="copy to clipboard"
                icon={copied ? <CheckIcon /> : <LinkIcon />}
                onClick={() => {
                  // TODO set as config var
                  copyToClipboard(window.location.href);
                  setCopied(true);
                }}
                size="sm"
              />
            </Tooltip>
          )}
        </Stack>
      </Flex>

      {link ? (
        <ChakraLink as={Link} to={`/paste/${id}`} fontFamily="mono">
          {displayContent}
        </ChakraLink>
      ) : (
        <Text whiteSpace="pre-wrap" fontFamily="mono">
          {displayContent}
        </Text>
      )}
    </Stack>
  );
};

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
}
