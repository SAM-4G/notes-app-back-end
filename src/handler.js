const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNote = (request, h) => {
    const { title, tags, body } = request.payload;
    
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
        title, tags, body, id, createdAt, updatedAt,
    };

    notes.push(newNote);
    
    const isSuccess = notes.filter((note) => note.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Note berhasil dibuat',
            data: {
                noteId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Note gagal dibuat',
    });
    response.code(500);
    return response;
};

const getNote = (request, h) => ({
    status: 'success',
    data: {
        notes,
    },
});

const getNoteById = (request, h) => {
    const { id } = request.params;

    const note = notes.filter((n) => n.id === id)[0];

    if (note !== undefined) {
        return {
            status: 'success', 
            data: {
                note,
            },
        };
    }
    const response = h.response({
        status: 'fail',
        message: 'Note not found',
    });
    response.code(404);
    return response;
};

const editNoteById = (request, h) => {
    const { id } = request.params;

    const { title, tags, body } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updatedAt,
        };
        const response = h.response({
            status: 'success',
            message: 'Update berhasil',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Update gagal, Id tidak ditemukan.',
    });
    response.code(404);
    return response;
};

const deleteNoteById = (request, h) => {
    const { id } = request.params;

    const index = notes.findIndex((note) => note.id === id);

    if (index != -1) {
        notes.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Note dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal menghapus note, Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = {
    addNote,
    getNote,
    getNoteById,
    editNoteById,
    deleteNoteById,
};