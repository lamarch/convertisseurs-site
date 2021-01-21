import express from "express"
import { env } from "process"
import { readdir } from "fs"

const dossiersConvertisseurs = "./public/convertisseurs/"

function chargerConvertisseurs() {
    //parcours le dossier './public/convertisseurs/' à la recherche de fichier js
    //qui pourrait contenir un convertisseur

    let convertisseurs = []
    //lis le dossier
    readdir(dossiersConvertisseurs, (err, fichiers) => {
        if (err) console.log(err)

        //pour chaque fichier
        fichiers.forEach((fichier) => {
            //on importe le module
            import(`./public/convertisseurs/${fichier}`)
                //et on ajoute la variable 'convertisseur' si elle existe à notre liste de convertisseurs
                .then((module) => {
                    if (
                        typeof module.convertisseur != "undefined" &&
                        !module.convertisseur.cache
                    ) {
                        module.convertisseur.adresse = fichier
                        convertisseurs.push(module.convertisseur)
                        convertisseurs = convertisseurs.sort(
                            (a, b) => a.ordre - b.ordre
                        )
                        console.log(`Chargement du module ${fichier} réussi !`)
                    }
                })
                .catch((r) => {
                    console.log(r)
                })
        })
    })
    return convertisseurs
}

const convertisseurs = chargerConvertisseurs()

let app = express()

app.set("views", "./views")
app.set("view engine", "ejs")

app.use(express.static("public"))

//debogage des requêtes
app.use((req, res, next) => {
    console.log(`URL : ${req.url}`)
    next()
})

//page principale
app.get("/", (req, res) => {
    res.redirect("/accueil.mjs")
})

//page d'un convertisseur
app.get("/:nomConvertisseur", (req, res) => {
    const convertisseur = convertisseurs.find(
        (conv) => conv.adresse === req.params.nomConvertisseur
    )
    if (convertisseur) {
        res.render("page", {
            convertisseur,
            convertisseurs,
        })
    } else {
        res.redirect("/accueil.mjs")
    }
})

//page inconnue
app.get("*", (req, res) => {
    res.send("Page inexistante.")
})

//on lance le serveur logiciel
app.listen(env.PORT, () =>
    console.log("Serveur démarré sur le port : " + env.PORT)
)
