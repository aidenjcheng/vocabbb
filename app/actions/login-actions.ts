"use server";
import { z } from "zod";
import { validatedAction } from "@/lib/auth/middleware";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import config from "@/config";

const signInSchema = z.object({
  email: z.string().email().min(3).max(255),
  password: z.string().min(8).max(100),
});

export const signIn = validatedAction(signInSchema, async (data) => {
  const supabase = await createClient();
  const { email, password } = data;

  const { data: signInData, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "Invalid credentials. Please try again." };
  }
  const { error: userDataError } = await supabase
    .from("user_data")
    .select("*")
    .eq("user_id", signInData.user?.id)
    .single();

  if (userDataError && userDataError.code === "PGRST116") {
    // No user_data entry found, create one
    const { error: insertError } = await supabase
      .from("user_data")
      .insert({ user_id: signInData.user?.id });
    if (insertError) {
      console.error("Error creating user_data entry:", insertError);
    }
  }
  redirect("/app");
});

const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  inviteId: z.string().optional(),
});

export const signUp = validatedAction(signUpSchema, async (data) => {
  const supabase = await createClient();
  const { email, password } = data;

  // const existingUser = await supabase
  //   .select()
  //   .from('auth.users')
  //   .where(eq(users.email, email))
  //   .limit(1);

  // if (existingUser.length > 0) {
  //   return { error: 'User already exists.' };
  // }

  // const passwordHash = await hashPassword(password);

  // const newUser: NewUser = {
  //   email,
  //   passwordHash,
  //   role: 'owner', // Default role, will be overridden if there's an invitation
  // };

  // const [createdUser] = await db.insert(users).values(newUser).returning();

  // if (!createdUser) {
  //   return { error: 'Failed to create user. Please try again.' };
  // }

  // let teamId: number;
  // let userRole: string;
  // let createdTeam: typeof teams.$inferSelect | null = null;

  // if (inviteId) {
  //   // Check if there's a valid invitation
  //   const [invitation] = await db
  //     .select()
  //     .from(invitations)
  //     .where(
  //       and(
  //         eq(invitations.id, parseInt(inviteId)),
  //         eq(invitations.email, email),
  //         eq(invitations.status, 'pending')
  //       )
  //     )
  //     .limit(1);

  //   if (invitation) {
  //     teamId = invitation.teamId;
  //     userRole = invitation.role;

  //     await db
  //       .update(invitations)
  //       .set({ status: 'accepted' })
  //       .where(eq(invitations.id, invitation.id));

  //     await logActivity(teamId, createdUser.id, ActivityType.ACCEPT_INVITATION);

  //     [createdTeam] = await db
  //       .select()
  //       .from(teams)
  //       .where(eq(teams.id, teamId))
  //       .limit(1);
  //   } else {
  //     return { error: 'Invalid or expired invitation.' };
  //   }
  // } else {
  //   // Create a new team if there's no invitation
  //   const newTeam: NewTeam = {
  //     name: `${email}'s Team`,
  //   };

  //   [createdTeam] = await db.insert(teams).values(newTeam).returning();

  //   if (!createdTeam) {
  //     return { error: 'Failed to create team. Please try again.' };
  //   }

  //   teamId = createdTeam.id;
  //   userRole = 'owner';

  //   await logActivity(teamId, createdUser.id, ActivityType.CREATE_TEAM);
  // }

  // const newTeamMember: NewTeamMember = {
  //   userId: createdUser.id,
  //   teamId: teamId,
  //   role: userRole,
  // };

  // await Promise.all([
  //   db.insert(teamMembers).values(newTeamMember),
  //   logActivity(teamId, createdUser.id, ActivityType.SIGN_UP),
  //   setSession(createdUser),
  // ]);

  // const redirectTo = formData.get('redirect') as string | null;
  // if (redirectTo === 'checkout') {
  //   const priceId = formData.get('priceId') as string;
  //   return createCheckoutSession({ team: createdTeam, priceId });
  // }
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });
  if (signUpError) {
    return { error: signUpError.message };
  }
  // Check if user_data entry exists and create i
  const { error: insertError } = await supabase
    .from("user_data")
    .insert({ user_id: signUpData?.user?.id });

  if (insertError) {
    console.error("Error creating user_data entry:", insertError);
    // Consider how you want to handle this error
  }
  redirect("/app");
});

export const signInWithMagicLink = validatedAction(
  z.object({
    email: z.string().email(),
  }),
  async (data) => {
    const supabase = await createClient();
    const { email } = data;
    const redirectTo = `${config.domainName}/api/auth/callback`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          redirect: "/workspace",
        },
      },
    });

    if (error) {
      console.error("Error sending magic link:", error);
      return { error: error.message };
    }

    return { success: "Magic link sent to your email." };
  },
);

export const signInWithGoogle = async () => {
  const supabase = await createClient();
  const redirectTo = `${config.domainName}/api/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
      queryParams: {
        redirect_to: "/start",
      },
    },
  });

  if (error) {
    return { error: "Failed to sign in with Google. Please try again." };
  }

  return { url: data.url };
};

export const signOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
};
