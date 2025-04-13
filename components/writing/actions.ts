"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export interface WritingSession {
  created_at: string;
  session_id: string;
  user_id: string;
  text: string;
  selected_time: string;
  prompt: string;
  required_words: { definition: string; word: string }[];
}

export async function updateWritingSessionText(
  sessionId: string,
  text: string,
) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("writing_sessions")
      .update({ text })
      .eq("session_id", sessionId);

    if (error) throw error;

    revalidatePath(`/write/${sessionId}`);
  } catch (error) {
    console.error("Error updating session:", error);
    throw new Error("Failed to update writing session");
  }
}

export async function stopWritingSession(sessionId: string, finalText: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("writing_sessions")
      .update({
        text: finalText,
        completed_at: new Date().toISOString(),
      })
      .eq("session_id", sessionId);

    if (error) throw error;

    revalidatePath(`/write/${sessionId}`);
  } catch (error) {
    console.error("Error stopping session:", error);
    throw new Error("Failed to stop writing session");
  }
}

export async function getWritingSession(sessionId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("writing_sessions")
    .select()
    .eq("session_id", sessionId)
    .single();

  if (error || !data) {
    redirect("/");
  }

  return data as WritingSession;
}

export async function updateWritingSession(
  sessionId: string,
  updates: Partial<WritingSession>,
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("writing_sessions")
    .update(updates)
    .eq("session_id", sessionId);

  if (error) {
    throw new Error("Failed to update session");
  }
}
