import { Request, Response, Router } from 'express'
import { getNotes, getNoteById, addNote, updateNote, deleteNoteById } from '../services/data'
import { Note } from '../types/notes'
import { hasAuthentication } from '../middleware/auth'


export const notesRouter = Router();

// POST-Route zum Hinzufügen einer neuen Notiz
notesRouter.post('/', hasAuthentication, (req: Request, res: Response) => {

  const title: string = req.body.title
  const content: string = req.body.content
  const user: string = req.body.user

  addNote(title, content, user)

  res.status(204).send()
})

/**
 * @route GET /notes - Endpoint to retrieve notes belonging to the authenticated user.
 * @middleware hasAuthentication - The method requires authentication.
 * @description Retrieves notes belonging to the authenticated user.
 * @param {Request} req - The request object containing the authorization header.
 * @param {Response} res - The response object containing notes belonging to the user.
 * @returns {void} - Responds with a HTTP 200 OK status and an array of notes belonging to the user.
 */
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

  if (note === undefined) {
    res.status(404).send(`Die Notiz mit ID ${id} wurde nicht gefunden.`)
  } else {
    res.status(200).send(note)
  }
})

/**
 * @route PUT /notes/:id - Endpoint to update a note by ID.
 * @middleware hasAuthentication - Requires authentication for access.
 * @description Updates a note with the specified ID, replacing its title, content, and user.
 * @param {Request} req - The request object containing the updated note details in the request body 
 * and the note ID in the route parameters.
 * @param {Response} res - The response object.
 * @returns {void} Responds with an HTTP 204 No Content status upon successful note creation. 
 * If the note does not exist, returns HTTP 404 Not Found.
 */
notesRouter.put('/:id', hasAuthentication, (req: Request, res: Response) => { 

  const title: string = req.body.title
  const content: string = req.body.content
  const user: string = req.body.user
  const id: number = parseInt(req.params.id)
  const oldNote: Note | undefined = getNoteById(id)

  if (oldNote === undefined) {
    res.status(404).send(`Die Notiz mit ID ${id} wurde nicht gefunden.`);
    return;
  }

  updateNote(id, title, content, user)

  res.status(204).send()
})

/**
 * @route PATCH /notes/:id - Endpoint to partially update a note by ID.
 * @middleware hasAuthentication - Requires authentication for access.
 * @description Partially updates a note with the specified ID, allowing modifications to its title, content, or user.
 * @param {Request} req - The request object containing the updated note details in the request body 
 * and the note ID in the route parameters.
 * @param {Response} res - The response object.
 * @returns {void} If the note does not exist, returns HTTP 404 Not Found. Otherwise, returns HTTP 204 No Content on successful update.
 */
notesRouter.patch('/:id', hasAuthentication, (req: Request, res: Response) => {
  const id: number = parseInt(req.params.id);
  const oldNote: Note | undefined = getNoteById(id);

  if (oldNote === undefined) {
    res.status(404).send(`Die Notiz mit ID ${id} wurde nicht gefunden.`);
    return;
  }

  const title: string = req.body.title ?? oldNote.title
  const content: string = req.body.content ?? oldNote.content
  const user: string = req.body.user ?? oldNote.user

  updateNote(id, title, content, user)

  res.status(204).send()
 })

/**
 * @route DELETE /notes/:id
 * @middleware hasAuthentication
 * @description Deletes a note by ID provided as a route parameter.
 * @param {Request} req - The request object.
 * @param {Response} res - The response object.
 * @returns {void} If the note does not exist, returns HTTP 404 Not Found. Otherwise, returns HTTP 204 No Content on successful deletion.
 */
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
