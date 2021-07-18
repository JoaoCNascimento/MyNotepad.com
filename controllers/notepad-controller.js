const {
    checkCurrentUser,
} = require("../middleware/middleware");
const User = require("../models/user");

module.exports = {

    notepad: async (req, res) => {

        let user = await checkCurrentUser(req, res)

        res.render('notepad/notepad', {
            user: user
        });
    },

    note_get: (req, res) => {
        res.render('notepad/note');
    },

    note_post: async (req, res) => {
        const note = req.body;

        if (!note.title || !note.content) {
            return res.status(401).send({ error_message: "Os campos da anotação não podem ficar em branco." })
        }

        if (note.title.length > 40) {
            return res.status(401).send({ error_message: "O título da anotação não pode ter mais de 100 caracteres." })
        }

        if (note.content.length > 400) {
            return res.status(401).send({ error_message: "O conteúdo da anotação não pode ultrapassar os 500 caracteres." })
        }

        const user = await checkCurrentUser(req, res);

        await User.updateOne(
            {_id: user._id},
            {$push: 
                { notes: 
                    {
                    title: note.title,
                    content: note.content,
                    color: note.color
                    }
                }
            }
        )
        .then((note) => {
            return res.status(200).send({ note: note })
        })
        .catch((er) => {
            console.log(er);
            return res.status(500).send({ error_message: "Erro no servidor, tente novamente mais tarde." })
        })
    },

    note_edit_get: async (req, res) => {

        const user = await checkCurrentUser(req, res);
        const note = await checkNote(user._id, req.params.id);

        res.render('notepad/note_edit', {
            note: note[0],

            colors: {
                Yellow: "Yellow",
                Blue: "Blue",
                Black: "Black",
                Green: "Green",
                Pink: "Pink",
                Red: "Red"
            }
        })
    },

    note_delete: async (req, res) => {
        const user = await checkCurrentUser(req, res);
        const data = await deleteNote(user._id, req.params.id);

        if(data == true) {
            return res.status(200).send({success: "Excluída com sucesso."})
        }
        return res.status(200).send({error_message: "Houve um erro no servidor, tente novamente mais tarde."})
    },

    note_put: async (req, res) => {
        
        const user = await checkCurrentUser(req, res);
        const noteUpdated = await updateNote(user._id, req.params.id, req.body);

        if (noteUpdated == false) {
            return res.status(500).send({ error_message: "Não foi possível salvar as alterações, tente novamente mais tarde." })
        }   

        return res.status(200).send({ success: "Alterações salvas com êxito!"})
        
    },

    user_profile: async (req, res) => {
        const user = await checkCurrentUser(req, res);
        
        let dateFormat = () => {
            let day = user.birthDate.substring(8, 10);
            let month = user.birthDate.substring(5, 7);
            let year = user.birthDate.substring(0, 4);
            let formattedBirthDate = day + "/" + month + "/" + year; 
            return formattedBirthDate;
        }

        user.birthDate = dateFormat();

        return res.render('user/perfil', {
            user
        });
    }, 
}



//NOTE CRUD 
//UPDATE
const updateNote = async (user_id, note_id, newNote) => {

    const result = await User.updateOne(
        { 
            _id: user_id, 
            'notes._id': note_id
        },
        {
            '$set': {
                'notes.$.title': newNote.title,
                'notes.$.content': newNote.content,
                'notes.$.color': newNote.color,
                'notes.$.updatedAt': Date.now()
            }
        })
        .then((note) => {
            return true;
        })
        .catch((er) => {
            console.log("Erro:"+er);
            return false;
        })

    return result;
}

//READ 
//this function look for an specific note inside a user collection
const checkNote = async (user_id, note_id) => {

    let note = await User.findOne(
        {_id: user_id},
        { notes: {
            $elemMatch: { _id: note_id }
        }}
    ).lean();

    note = note.notes;

    return note;
}

//DELETE
//this function look for an specific note inside a user collection 
//and then delete it
const deleteNote = async (user_id, note_id) => {
    const result = await User.updateOne(
            {_id: user_id},
            {$pull: {
                notes: {
                    _id: note_id
                    }
                }
            })
            .then(() => {
                return true;
            })
            .catch((er) => {
                return false;
            });
    
    return result;
}

