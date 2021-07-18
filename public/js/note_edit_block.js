const select = document.getElementById("color_picker");
const colors = [
    //lista de cores
    {
        name: "Yellow",
        rgb: "rgb(255, 255, 167)",
        cssText: "background-color: rgb(255, 255, 167)",
        cssHeaderText: "background-color: rgb(207,207,119)"
    },

    {
        name: "Blue",
        rgb: "rgb(3, 173, 252)",
        cssText: "background-color: rgb(3, 173, 252)",
        cssHeaderText: "background-color: rgb(3,125,204)"
    },

    {
        name: "Red",
        rgb: "rgb(255, 102, 102)",
        cssText: "background-color: rgb(255, 102, 102)",
        cssHeaderText: "background-color: rgb(207,54,54)"
    },

    {
        name: "Black",
        rgb: "rgb(51, 51, 51)",
        cssText: "background-color: rgb(51, 51, 51); color: white",
        cssHeaderText: "background-color: rgb(3,3,3); color: white"
    },

    {
        name: "Green",
        rgb: "rgb(125, 255, 130)",
        cssText: "background-color: rgb(125, 255, 130)",
        cssHeaderText: "background-color: rgb(77,207,82)"
    },

    {
        name: "Pink",
        rgb: "rgb(255, 133, 245)",
        cssText: "background-color: rgb(255, 133, 245)",
        cssHeaderText: "background-color: rgb(207,85,197)"
    },
];
const form = document.getElementById("form")
const title = document.getElementById("title");
const textarea = document.getElementById("content");

document.addEventListener('DOMContentLoaded', () => {
    set_note_color();
})

select.addEventListener('change', () => { set_note_color(); })

function set_note_color() {

    let note;   

    colors.forEach(element => {
        if (select.value == element.name) {
            console.log(element.name)
            note = element;
        }
    })

    title.style.cssText = note.cssHeaderText;
    textarea.style.cssText = note.cssText;
}