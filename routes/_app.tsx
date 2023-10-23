import { AppProps } from "$fresh/server.ts";

export default function App({ Component }: AppProps) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>padel-rankings</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Varela+Round&family=Bitter:ital,wght@1,400;1,600;1,800&display=swap" rel="stylesheet" />
      </head>
      <body>
        <Component />
      </body>
    </html>
  );
}
