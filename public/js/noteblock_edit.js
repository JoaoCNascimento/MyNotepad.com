const select = document.getElementById('color_picker');
const textarea = document.getElementById('content');
const title = document.getElementById('title');

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
]

select.addEventListener('change', () => {

    let note;

    colors.forEach(element => {
        if (select.value == element.name)
            note = element;
    })

    title.style.cssText = note.cssHeaderText;
    textarea.style.cssText = note.cssText;
})

//USEFUL DEBUG FUNCTIONS
/*
    //use the value in select (describe as cssText) to turn change the background
    //and the note header background to a darker one.
    const darker = select.value.substring(22)
    const parts = darker.split(',');

    let rgb = "";
    let i = 0;
    parts.forEach((part) => {
        part = part.replace(")", "").replace(";", "").replace(" ", "").replace(",", "").replace("(", "");
        if (part >= 48)
            part = part - 48;
        rgb += part;
        if (i <= 1) {
            rgb += ","
        }
        i++;
    });
    */