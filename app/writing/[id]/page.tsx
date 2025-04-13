import WritingInterface from "@/components/writing/writing-interface";
import StoppedWritingScreen from "@/components/writing/stopped-writing-screen";
import { getWritingSession } from "@/components/writing/actions";

export default async function WritingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getWritingSession(id);
  const selectedTime = parseInt(session.selected_time);

  if (session.text) {
    return <StoppedWritingScreen text={session.text} sessionId={id} />;
  }

  return (
    <WritingInterface
      timeRemaining={selectedTime * 60}
      text={session.prompt}
      requiredWords={session.required_words}
      sessionId={id}
      initialText={session.prompt}
    />
  );
}
