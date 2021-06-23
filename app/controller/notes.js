/*********************************************************************
 * Execution    : 1. Default node with npm   cmd> node server.js
 *                2. If nodemon installed    cmd> npm start
 * 
 * Purpose      : Controls the operations of notes creation and other CRUD
 * 
 * @description
 * 
 * @file        : controllers/notes.js
 * @overview    : controls notes creation, deletion, update and retrieval tasks
 * @module      : this is necessary to register new user and give authorization.
 * @author      : Sanketh Chigurupalli <sanketh.chigurupalli@gmail.com>
 * @version     : 1.0.0
 * @since       : 18-06-2021
 *********************************************************************/

const notesService = require('../services/notes');
const {notesCreationValidation, notesDeletionValidation} = require('../middleware/validation');
const redisClass = require('../middleware/redis')
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_PORT);

class NotesController {
    /**
     * @description function written to create notes into the database
     * @param {*} a valid req body is expected
     * @param {*} res 
     * @returns response
     */
    async createNotes(req, res) {
        try {
            let dataValidation = notesCreationValidation.validate(req.body);
            if (dataValidation.error) {
                return res.status(400).send({
                    message: dataValidation.error.details[0].message
                });
            }
            const notesData = {
                title: req.body.title,
                description: req.body.description
            }
            const notesCreated = await notesService.createNotes(notesData);
            res.send({success: true, message: "Notes Created!", data: notesCreated});
        } catch (error) {
            console.log(error);
            res.status(500).send({success: false, message: "Some error occurred while creating notes" });
        }
    }

    /**
     * @description function written to get all the notes from the database
     * @param {*} req 
     * @param {*} res 
     * @returns response
     */
    async getAllNotes(req, res) {
        try {
            // console.log(req.query.name);
            const getNotes = req.params;
            // console.log('Get all notes : ${getAllNOtes}', getAllNotes);
            const getAllNotes = await notesService.getAllNotes();
            console.log('Get param : ', getNotes);
            console.log('Get all notes : ', getAllNotes);
            const data = await JSON.stringify(getAllNotes);
            console.log('Data at controller', data);
            console.log('Data type of data', typeof(data));
            client.SETEX(getNotes.notes, 3600, data);
            res.send({success: true, message: "Notes Retrieved!", data: getAllNotes});
        } catch (error) {
            console.log(error);
            res.status(500).send({success: false, message: "Some error occurred while retrieving notes"});
        }
    }

    /**
     * @description function written to get notes using ID from the database
     * @param {*} req 
     * @param {*} res 
     * @returns response
     */
    async getNotesById(req, res) {
        try {
            const notesId = req.params;
            // console.log('Note Id as params', notesId);
            const getNote = await notesService.getNoteById(notesId);
            // const data = await getNote.json();
            console.log(getNote);
            // client.setex(notesId, 3600, getNote);
            res.send({success: true, message: "Notes Retrieved!", data: getNote});
        } catch (error) {
            console.log(error);
            res.status(500).send({success: false, message: "Some error occurred while retrieving notes"});
        }
    }

    /**
     * @description function written to update notes using ID from the database
     * @param {*} req 
     * @param {*} res 
     * @returns response
     */
    async updateNotesById(req, res) {
        try {
            let dataValidation = notesCreationValidation.validate(req.body);
            if (dataValidation.error) {
                return res.status(400).send({
                    message: dataValidation.error.details[0].message
                });
            }

            let notesId = req.params;
            const notesData = {
                title: req.body.title,
                description: req.body.description
            }
            const updateNote = await notesService.updateNotesById(notesId, notesData);
            redisClass.setDataInCache(updateNote);
            res.send({success: true, message: "Notes Updated!", data: updateNote});
        } catch (error) {
            console.log(error);
            res.status(500).send({success: false, message: "Some error occurred while updating notes"});
        }
    }

    async deleteNotesById(req, res) {
        try {
            let dataValidation = notesDeletionValidation.validate(req.body);
            if (dataValidation.error) {
                return res.status(400).send({
                    message: dataValidation.error.details[0].message
                });
            }

            let notesId = req.params;
            const notesData = {
                _id: notesId,
                isDeleted: req.body.isDeleted
            }
            const deleteNote = await notesService.deleteNoteById(notesId, notesData);
            res.send({success: true, message: "Note Deleted!"});
        } catch (error) {
            console.log(error);
            res.status(500).send({success: false, message: "Some error occurred while updating notes"});
        }
    }
}

//exporting th whole class to utilize or call function created in this class
module.exports = new NotesController();