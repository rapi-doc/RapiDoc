// The page an OAuth provider sends the sign-in popup back to: <oauth-receiver> hands the reply to the
// reference that opened it. No site layout: it is only ever seen for a moment, in a popup.
import { createElement, useEffect } from "react";

export default function OAuthReceiver() {
  useEffect(() => {
    import("rapidoc");
  }, []);
  return createElement("oauth-receiver");
}
