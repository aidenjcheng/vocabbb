"use server";

import { createClient } from "@/utils/supabase/server";

export const getUser = async () => {
  const supabase = await createClient();
  const { data: user, error: authError } = await supabase.auth.getUser();

  if (authError) {
    console.log("error getting user: ", authError);
    return null;
  }

  if (!user) {
    console.log("no user");

    return null;
  } else {
    console.log("got user successfully");
    return user.user;
  }
};
