export class Note {
    id: number;
    title: string;
    content: string;
    user: string;
    categories: string[];
    date: Date;

    constructor(id: number, title: string, content: string, user: string, categories: string[]) {
      this.id = id;
      this.title = title;
      this.content = content;
      this.user = user;
      this.categories = categories;
      this.date = new Date();
    }
  }

/**
 * Represents the raw data structure of notes data, containing an array of notes,
 * to extract the notes from the raw JSON object.
 */
export type NotesRaw = {
  notes: Note[]
}