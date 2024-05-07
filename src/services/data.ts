import * as fs from 'node:fs'
import { Note, NotesRaw } from '../types/notes'

/**
 * Reads all notes from the JSON file and returns them as an array of Note objects.
 * @returns {Note[]} Array of notes retrieved from the file.
 */
export function getNotes(): Note[] {
  const notesRaw = fs.readFileSync('data/notes.json', 'utf8')
  const notizen = JSON.parse(notesRaw) as NotesRaw
  const array = notizen.notes
  return array
}

/**
 * Retrieves a single note by its ID.
 * @param {number} id - The unique identifier of the note to be retrieved.
 * @returns {Note | undefined} The note object if found, otherwise undefined.
 */
export function getNoteById(id: number): Note | undefined {
  const notes = getNotes() 
  const note = notes.find(note => note.id === id)
  return note
}

/**
 *  Writes notes to a file in JSON format.
 * @param {Note[]} oldNotes The array of notes to be written to the file.
 */
export function writeNotesToFile(oldNotes: Note[]): void { 
  const newNotes: NotesRaw = { notes: oldNotes }
  fs.writeFileSync('data/notes.json', JSON.stringify(newNotes))
}

/**
 * Adds a new note with the specified title, content, and user to the existing notes array, 
 * then writes the updated array of notes to a JSON file.
 * @param {string} title - The title of the new note.
 * @param {string} content - The content of the new note.
 * @param {string} user - The user associated with the new note.
 */
export function addNote(title: string, content: string, user: string, categories: string[]): void {
  const oldNotes = getNotes()
  const id = oldNotes.length + 1
  const newNote: Note = new Note(id, title, content, user, categories)
  oldNotes.push(newNote)
  writeNotesToFile(oldNotes)
}

/**
 * Updates an existing note with the specified ID by replacing its title, content, and user,
 * then writes the updated array of notes to a JSON file.
 * @param {number} id - The ID of the note to be updated.
 * @param {string} title - The new title for the note.
 * @param {string} content - The new content for the note.
 * @param {string} user - The new user associated with the note.
 */
export function updateNote(id: number, title: string, content: string, user: string, categories: string[]): void {
  const oldNotes = getNotes()
  const filteredNotes = oldNotes.filter(note => note.id !== id)
  const newNote: Note = new Note(id, title, content, user, categories)
  filteredNotes.push(newNote)
  writeNotesToFile(filteredNotes)
}

/**
 * Deletes the note with the specified ID from the array of notes,
 * then writes the updated array to a JSON file.
 * @param {number} id - The ID of the note to delete.
 */
export function deleteNoteById(id: number): void {
  const oldNotes = getNotes()
  const filteredNotes = oldNotes.filter(note => note.id !== id)
  writeNotesToFile(filteredNotes)
}