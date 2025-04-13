import { getUser } from "@/queries/user";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  console.log("dsjiaodjs" + requestUrl);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const error_description = requestUrl.searchParams.get("error_description");

  const supabase = await createClient();
  let redirectPath = "/sign-in?error=unexpected_error"; // Default error path

  try {
    if (error) {
      console.error("Auth error:", error_description);
      redirectPath = `/sign-in?error=${error}&error_description=${encodeURIComponent(
        error_description || "",
      )}`;
    } else if (code) {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.exchangeCodeForSession(code);

      if (sessionError) {
        console.error("Error exchanging code for session:", sessionError);
        redirectPath = "/sign-in?error=authentication_failed";
      } else if (session) {
        const user = await getUser();
        if (user) {
          redirectPath = "/start"; // Default redirect
        } else {
          redirectPath = "/sign-in?error=user_not_found";
        }
      } else {
        redirectPath = "/sign-in?error=session_not_found";
      }
    } else {
      redirectPath = "/sign-in?error=missing_code";
    }
  } catch (err) {
    console.error("Unexpected error during authentication:", err);
  }

  return NextResponse.redirect(`${requestUrl.origin}${redirectPath}`);
}
