import { Header } from "@/components/layout/header";
import NotesPage from "@/components/note/note-client";
import { listNotes, listTags } from "@/actions/main";

export default async function Page() {

  const notes = await listNotes();
  console.log("Fetched notes:", notes);
  const tags = await listTags();
  console.log("Fetched tags:", tags);



  const handleLogout = () => {
    // TODO: Implement logout with NextAuth
    alert("ログアウト機能は準備中です");
  };

  return (
    <>
      {/* Header */}
      <Header
        user={{ name: "テストユーザー", email: "test@example.com" }}
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <NotesPage notesFromServer={notes} tagsFromServer={tags} />
    </>
  );
}
