"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { SOPHISTICATED_WORDS } from "@/data/prompts";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export interface CreateSessionData {
  selected_time: number;
  prompt: string;
  text?: string;
  user_id: string;
  required_words: typeof SOPHISTICATED_WORDS;
  // words_with_examples: WordWithExampleType[];
}

export async function createWritingSession(data: CreateSessionData) {
  const session = {
    session_id: crypto.randomUUID(),
    ...data,
    created_at: new Date(),
  };
  try {
    const { error } = await supabase.from("writing_sessions").insert(session);

    if (error) {
      throw error;
    }

    revalidatePath("/");
  } catch (error) {
    if (error instanceof Error) {
      const newError = new Error(`Failed to create session: ${error.message}`);
      newError.cause = error;
      throw newError;
    }
    const newError = new Error(
      `Failed to create session: ${JSON.stringify(error)}`,
    );
    newError.cause = error;
    throw newError;
  }

  // Move redirect outside of try-catch block
  redirect(`/writing/${session.session_id}`);
}
