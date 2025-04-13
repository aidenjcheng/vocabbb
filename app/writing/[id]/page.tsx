import WritingInterface from "@/components/writing/writing-interface";
import { getWritingSession } from "@/components/writing/actions";

export default async function WritingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getWritingSession(id);
  const selectedTime = parseInt(session.selected_time);

  // We now use WritingInterface for both active and stopped sessions
  // The component itself will handle showing the dialog if needed
  return (
    <WritingInterface
      timeRemaining={selectedTime * 60}
      text={session.text || session.prompt}
      requiredWords={session.required_words}
      sessionId={id}
      initialText={session.text || session.prompt}
    />
  );
}
