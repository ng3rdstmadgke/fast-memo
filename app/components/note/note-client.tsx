"use client";

import { Sidebar } from "@/components/note/sidebar";
import { NoteDetail } from "@/components/note/note-detail";
import { useEffect, useState } from "react";
import {
  ListNotesSchema,
  ListTagsSchema,
  GetNoteByIdSchema,
  getNoteById,
  listNotes,
  listTags,
  createNote,
  deleteNote,
} from "@/actions/main";

type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
}

export default function NotesPage({notesFromServer, tagsFromServer}: {notesFromServer: ListNotesSchema[], tagsFromServer: ListTagsSchema[]}) {
  const [notes, setNotes] = useState(notesFromServer);
  const [tags, setTags] = useState(tagsFromServer);
  const [selectedNoteId, setSelectedNoteId] = useState<string | undefined>(
    notesFromServer[0]?.id
  );
  const [selectedNoteDetail, setSelectedNoteDetail] = useState<GetNoteByIdSchema | null>(null); 

  // サイドバーで選択されたノートIDが変わったときに詳細を取得
  useEffect(() => {
    if (!selectedNoteId) {
      setSelectedNoteDetail(null);
      return
    }
    const fetchNoteDetail = async () => {
      const detail = await getNoteById(selectedNoteId);
      setSelectedNoteDetail(detail);
    };
    fetchNoteDetail();
  }, [selectedNoteId]);

  // サイドバーの情報の更新
  const refreshSidebar = async () => {
    const updatedNotes = await listNotes();
    setNotes(updatedNotes);
    const updatedTags = await listTags();
    setTags(updatedTags);
  }

  // ノートの新規作成
  const handleNewNote = async () => {
    const {id} = await createNote()
    setSelectedNoteId(id);
    await refreshSidebar();
  };

  // ノートの削除
  const handleDeleteNote = async (noteId: string) => {
    if (confirm("このノートを削除してもよろしいですか？")) {
      setSelectedNoteId(undefined);
      await deleteNote(noteId);
      await refreshSidebar();
    }
  };


  return (
    <>
      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          notes={notes}
          tags={tags}
          selectedNoteId={selectedNoteId}
          onNoteSelect={setSelectedNoteId}
          onNewNote={handleNewNote}
          onDelete={handleDeleteNote}
        />

        {/* Main Panel */}
        <NoteDetail
          note={selectedNoteDetail}
          refreshSidebar={refreshSidebar}
          onDelete={handleDeleteNote}
        />
      </div>
    </>
  );
}
