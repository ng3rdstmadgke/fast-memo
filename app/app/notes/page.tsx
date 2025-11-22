import { Header } from "@/components/layout/header";
import NotesPage from "@/components/note/note-client";
import { listNotes, listTags } from "@/actions/main";

export default async function Page() {
  const notes = await listNotes();
  const tags = await listTags();

  return (
    <>
      {/* Header */}
      <Header />

      {/* Main Content */}
      <NotesPage notesFromServer={notes} tagsFromServer={tags} />
    </>
  );
}
