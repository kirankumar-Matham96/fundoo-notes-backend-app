const notesModel = require('../models/notes');

class NotesService {
    /**
     * @description this function is written to send data models
     * @param {*} A valid notesData is expected
     * @returns error if it has error else data
     */
    async createNotes(notesData) {
        try {
            const createdNotes = await notesModel.createInfo(notesData);
            return createdNotes;
        } catch (error) {
            return error;
        }
    }

    async getAllNotes() {
        try {
            const getNotes = await notesModel.getAllNotes();
            return getNotes;
        } catch (error) {
            return error;
        }
    }

    async getNoteById(notesId) {
        try {
            const getNote = await notesModel.getNoteById(notesId);
            return getNote;
        } catch (error) {
            return error;
        }
    }

    async updateNotesById(notesId, notesData) {
        try {
            const updateNote = await notesModel.updateNote(notesId, notesData);
            return updateNote;
        } catch (error) {
            return error;
        }
    }
}

//exporting the class to utilize or call function created in this class
module.exports = new NotesService();