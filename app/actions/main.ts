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
    where: { id: "keita.midorikawa"},
  });
  if (!user) {
    throw new Error("User not found");
  }

  return await prisma.note.findMany({
    where: { userId: user.id },
    include: { tags: true},
    omit: { content: true },  // contentを除外
    orderBy: { createdAt: 'desc' },
  })
}

export async function listTags(): Promise<ListTagsSchema[]> {
  // TODO: ログイン機能実装後にユーザーIDを動的に取得する
  const user = await prisma.user.findUnique({
    where: { id: "keita.midorikawa"}
  });
  if (!user) {
    throw new Error("User not found");
  }
  return await prisma.tag.findMany({
    where: { userId: user.id },
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
  if (!user) {
    throw new Error("User not found");
  }

  return await prisma.note.findUnique({
    where: {userId: user.id, id: noteId},
    include: { tags: true },
  });
}

export async function createNote(): Promise<{id: string}> {
  // TODO: ログイン機能実装後にユーザーIDを動的に取得する
  const user = await prisma.user.findUnique({
    where: { id: "keita.midorikawa"}
  });
  if (!user) {
    throw new Error("User not found");
  }

  return await prisma.note.create({
    data: {
      userId: user.id,
      title: "新しいノート",
      content: "",
    },
  });
}

async function deleteOrphanTags(userId: string): Promise<void> {
  // 孤立したタグの削除
  await prisma.tag.deleteMany({
    where: {
      userId: userId,
      notes: {
        // notesに関連付けられていないタグを削除: https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#filter-on-absence-of--to-many-records
        none: {}
      }
    }
  })
}

export async function updateNote(noteId: string, title: string, tags: string, content: string): Promise<void> {
  // TODO: ログイン機能実装後にユーザーIDを動的に取得する
  const user = await prisma.user.findUnique({
    where: { id: "keita.midorikawa"}
  });

  if (!user) {
    throw new Error("User not found");
  }

  const tagList = tags.split(",").map(tag => tag.trim()).filter(tag => tag !== "");
  await prisma.note.update({
    where: { id: noteId, userId: user.id },
    data: {
      title,
      content,
      tags: {
        // 既存の関連付けを一旦クリア: https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#disconnect-all-related-records
        set: [],
        // リレーションを接続または作成: https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries#connect-or-create-a-record
        connectOrCreate: tagList.map(tagName => ({
          where: {
            userId_name: {
              userId: user.id,
              name: tagName
            }
          },
          create: {
            userId: user.id,
            name: tagName
          },
        })),
      },
    },
  })

  // 孤立したタグの削除
  await deleteOrphanTags(user.id);
}

export async function deleteNote(noteId: string): Promise<void> {
  // TODO: ログイン機能実装後にユーザーIDを動的に取得する
  const user = await prisma.user.findUnique({
    where: { id: "keita.midorikawa"}
  });

  if (!user) {
    throw new Error("User not found");
  }

  // https://www.prisma.io/docs/orm/prisma-client/queries/crud#delete
  await prisma.note.delete({
    where: { id: noteId, userId: user.id },
  });

  // 孤立したタグの削除
  await deleteOrphanTags(user.id);
}
