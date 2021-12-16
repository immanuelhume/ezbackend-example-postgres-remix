import {
  Button,
  ChakraProvider,
  Flex,
  Heading,
  Link as ChakraLink,
  Text,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { FaGoogle } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import type { LoaderFunction } from "remix";
import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
  useLoaderData,
} from "remix";
import { useMe, _getMe } from "./session";

// https://remix.run/api/conventions#default-export
// https://remix.run/api/conventions#route-filenames
export default function App() {
  return (
    <Document>
      <ChakraProvider resetCSS={true}>
        <Layout>
          <Outlet />
        </Layout>
      </ChakraProvider>
    </Document>
  );
}

// https://remix.run/docs/en/v1/api/conventions#errorboundary
export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);
  return (
    <Document title="Error!">
      <ChakraProvider resetCSS={true}>
        <Layout>
          <div>
            <h1>There was an error</h1>
            <p>{error.message}</p>
            <hr />
            <p>
              Hey, developer, you should replace this with what you want your
              users to see.
            </p>
          </div>
        </Layout>
      </ChakraProvider>
    </Document>
  );
}

// https://remix.run/docs/en/v1/api/conventions#catchboundary
export function CatchBoundary() {
  let caught = useCatch();

  let message;
  switch (caught.status) {
    case 401:
      message = (
        <p>
          Oops! Looks like you tried to visit a page that you do not have access
          to.
        </p>
      );
      break;
    case 404:
      message = (
        <p>Oops! Looks like you tried to visit a page that does not exist.</p>
      );
      break;

    default:
      throw new Error(caught.data || caught.statusText);
  }

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <ChakraProvider resetCSS={true}>
        <Layout>
          <h1>
            {caught.status}: {caught.statusText}
          </h1>
          {message}
        </Layout>
      </ChakraProvider>
    </Document>
  );
}

function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const data = useLoaderData();
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(data.ENV)}`,
          }}
        />
        <Scripts />
        {process.env.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header>
        <Navbar />
      </header>
      <div>
        <div>{children}</div>
      </div>
      <footer>
        <div></div>
      </footer>
    </div>
  );
}

function Navbar(props: any) {
  const data = useLoaderData<RootData>();
  const [me, setMe] = useMe();
  useEffect(() => {
    _getMe()
      .then((v) => setMe(v))
      .catch((e) => console.log(e));
  }, []);
  return (
    <Flex
      as="nav"
      bg="twitter.500"
      align="center"
      justify="space-between"
      color="whitesmoke"
      padding={4}
      {...props}
    >
      <Heading as={Link} to="/">
        binpaste
      </Heading>
      <Flex align="center">
        {me && (
          <Text fontSize="lg" marginRight={8}>
            Hello, {me.googleData.displayName}
          </Text>
        )}
        {me ? (
          <Button
            color="twitter.500"
            as={ChakraLink}
            isExternal
            href={`${data.ENV.API_URL}/user/auth/google/logout`}
            rightIcon={<MdLogout />}
          >
            Logout
          </Button>
        ) : (
          <Button
            color="twitter.500"
            as={ChakraLink}
            isExternal
            href={`${data.ENV.API_URL}/user/auth/google/login`}
            rightIcon={<FaGoogle />}
          >
            Login
          </Button>
        )}
      </Flex>
    </Flex>
  );
}

declare global {
  interface Window {
    ENV: any;
  }
}

type RootData = {
  ENV: {
    API_URL: string;
  };
};

// A cheat to grab anything we need for the app root.
export const loader: LoaderFunction = async () => {
  return {
    ENV: {
      API_URL: process.env.API_URL,
    },
  };
};
