'use server';

import { prisma } from '@/lib/prisma';
import { Note, Tag, Prisma } from '@/lib/generated/prisma/client';

export type ListNotesSchema = Prisma.NoteGetPayload<{
  include: { tags: true },
  omit: { content: true },
}>

export type ListTagsSchema = Prisma.TagGetPayload<{
  select: {
    id: true,
    name: true,
  }
}>

export type GetNoteByIdSchema = Prisma.NoteGetPayload<{
  include: { tags: true },
}>

export async function listNotes(): Promise<ListNotesSchema[]> {
  // TODO: ログイン機能実装後にユーザーIDを動的に取得する
  const user = await prisma.user.findUnique({
    where: { id: "keita.midorikawa"}
  });

  return await prisma.note.findMany({
    where: { userId: user?.id },
    include: { tags: true},
    omit: { content: true },  // contentを除外
  })
}

export async function listTags(): Promise<ListTagsSchema[]> {
  // TODO: ログイン機能実装後にユーザーIDを動的に取得する
  const user = await prisma.user.findUnique({
    where: { id: "keita.midorikawa"}
  });
  return await prisma.tag.findMany({
    where: { userId: user?.id },
    select: {
      id: true,
      name: true,
    }
  })
}

export async function getNoteById(noteId: string): Promise<GetNoteByIdSchema | null> {
  // TODO: ログイン機能実装後にユーザーIDを動的に取得する
  const user = await prisma.user.findUnique({
    where: { id: "keita.midorikawa"}
  });

  return await prisma.note.findUnique({
    where: {userId: user?.id, id: noteId},
    include: { tags: true },
  });
}