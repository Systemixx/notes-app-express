import { Request, Response, Router } from 'express';
import { getNotes, getNoteById, addNote, updateNote, deleteNoteById } from '../services/data';
import { Note } from '../types/notes';
import { hasAuthentication } from '../middleware/auth';

export const notesRouter = Router();

// POST-Route zum Hinzufügen einer neuen Notiz
notesRouter.post('/', hasAuthentication, (req: Request, res: Response) => {
  const title: string = req.body.title;
  const content: string = req.body.content;
  const user: string = req.body.user;

  // Stellen sicher, dass der Benutzer, der die Notiz erstellt, mit dem authentifizierten Benutzer übereinstimmt
  if (req.user !== user) {
    return res.status(403).send("Unberechtigt, eine Notiz für einen anderen Benutzer zu erstellen.");
  }

  addNote(title, content, user);
  res.status(204).send();
});

// GET-Route zum Abrufen von Notizen, die dem authentifizierten Benutzer gehören
notesRouter.get('/', hasAuthentication, (req: Request, res: Response) => {
  const authenticatedUser = req.user;

  const notes: Note[] = getNotes().filter(note => note.user === authenticatedUser);
  res.status(200).send(notes);
});

// GET-Route zum Abrufen einer bestimmten Notiz anhand der ID, die mit dem authentifizierten Benutzer verbunden ist
notesRouter.get('/:id', hasAuthentication, (req: Request, res: Response) => {
  const authenticatedUser = req.user;
  const id: number = parseInt(req.params.id);
  const note: Note | undefined = getNoteById(id);

  if (!note || note.user !== authenticatedUser) {
    return res.status(404).send(`Notiz nicht gefunden oder nicht autorisiert zum Zugriff.`);
  }

  res.status(200).send(note);
});

// PUT-Route zum Aktualisieren einer Notiz anhand der ID
notesRouter.put('/:id', hasAuthentication, (req: Request, res: Response) => {
  const title: string = req.body.title;
  const content: string = req.body.content;
  const user: string = req.body.user;
  const id: number = parseInt(req.params.id);
  const oldNote: Note | undefined = getNoteById(id);

  if (oldNote === undefined) {
    res.status(404).send(`Die Notiz mit ID ${id} wurde nicht gefunden.`);
    return;
  }

  updateNote(id, title, content, user);
  res.status(204).send();
});

// PATCH-Route zum teilweisen Aktualisieren einer Notiz anhand der ID
notesRouter.patch('/:id', hasAuthentication, (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);
  const oldNote: Note | undefined = getNoteById(id);

  if (oldNote === undefined) {
    res.status(404).send(`Die Notiz mit ID ${id} wurde nicht gefunden.`);
    return;
  }

  const title: string = req.body.title ?? oldNote.title;
  const content: string = req.body.content ?? oldNote.content;
  const user: string = req.body.user ?? oldNote.user;

  updateNote(id, title, content, user);
  res.status(204).send();
});

// DELETE-Route zum Löschen einer Notiz anhand der ID
notesRouter.delete('/:id', hasAuthentication, (req: Request, res: Response) => { 
  const id: number = parseInt(req.params.id);
  const oldNote: Note | undefined = getNoteById(id);

  if (oldNote === undefined) {
    res.status(404).send(`Die Notiz mit ID ${id} wurde nicht gefunden.`);
    return;
  }

  deleteNoteById(id);
  res.status(204).send();
});
