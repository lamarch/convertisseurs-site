//Framework ExpressJS
import express from 'express'
//Pour accéder à la variable d'environnement, afin de connaitre le port d'écoute du serveur
//normalement définie à 80
import { env } from 'process'
//afin de lire le contenu d'un dossier
import { readdir } from 'fs'

//Git infos, pour le versioning
import gitInfo from 'git-commit-info'

const git_infos = gitInfo()
const git_infos_date = new Date(Date.parse(git_infos.date))
git_infos_date.setHours(git_infos_date.getHours() + 1)
const git_infos_date_str = git_infos_date
    .toISOString()
    .replace(/T/, ' ') // replace T with a space
    .replace(/\..+/, '') // delete the dot and everything after
const version = `\\"${git_infos_date_str} - ${git_infos.shortHash}\\"`

const dossiersConvertisseurs = './public/convertisseurs/'
let port = env.PORT

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
                    //si le module expose un objet 'convertisseur'
                    //et que ce dernier ne demande pas à être cacher ('cache')
                    if (
                        typeof module.convertisseur != 'undefined' &&
                        !module.convertisseur.cache
                    ) {
                        //le convertisseur a pour adresse le nom de fichier (unique)
                        module.convertisseur.adresse = fichier
                        //ajouter à la liste des convertisseurs
                        convertisseurs.push(module.convertisseur)
                        //et on réordonne la liste en fonction de la propriété 'ordre'
                        //des convertisseurs, afin de pouvoir définir qui va devant qui
                        //dans le code
                        convertisseurs = convertisseurs.sort(
                            (a, b) => a.ordre - b.ordre
                        )
                        console.log(`Chargement du module ${fichier} réussi !`)
                    }
                })
                .catch((r) => {
                    //!Erreur!
                    console.log(r)
                })
        })
    })
    return convertisseurs
}

const convertisseurs = chargerConvertisseurs()

//on charge un routeur de l'api ExpressJS
let app = express()

//on définit le dossier où on veut trouver les 'vues'
app.set('views', './vues')
//on définit le moteur de rendu (EJS ici)
app.set('view engine', 'ejs')

//on définit le dossier './public' comme accessible par tout le monde,
//cad les fichiers et sous-dossiers seront téléchargeables par le biais
//de leur adresse par rapport à se dossier
//exemple : si on veut ./public/styles/styles.css
// il suffit de demander {adresse}/styles/styles.css
app.use(express.static('public'))

//debogage des requêtes
app.use((req, res, next) => {
    //affiche quelle URL est demandée
    console.log(`URL : ${req.url}`)
    next()
})

//page principale '/'
app.get('/', (req, res) => {
    //on redirige vers '/accueil.mjs' (l'adresse du 'convertisseur' de l'accueil)
    res.redirect('/accueil')
})

//page d'un convertisseur
app.get('/:nomConvertisseur', (req, res) => {
    let nomConvertisseur = req.params.nomConvertisseur
    if (!nomConvertisseur.endsWith('.js')) {
        nomConvertisseur += '.js'
    }
    //on recherche le convertisseur qui correspond à cette adresse
    const convertisseur = convertisseurs.find(
        (conv) => conv.adresse === nomConvertisseur
    )
    //s'il existe
    if (convertisseur) {
        //on demande à notre Moteur de Rendu Dynamique (ejs)
        //de créer une page avec ce genre de convertisseur
        res.render('page', {
            convertisseur,
            convertisseurs,
            version,
        })
    } else {
        //il n'existe pas, on redirige vers l'accueil
        res.redirect('/')
    }
})

//page inconnue
app.get('*', (req, res) => {
    res.send('Page inexistante.')
})

if (port == 'undefined') {
    console.log('Attention ! Aucun port spécifié : port par defaut = 80')
    port = 80
}

//on lance le serveur logiciel
app.listen(port, () => console.log('Serveur démarré sur le port : ' + port))
