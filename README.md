# Convertisseurs - site

Site de conversion simple et efficace, crée avec NodeJS, Express et EJS en développement.

## Sommaire

* [Informations générales](#Informations-générales)
* [Technologies](#technologies)
* [Setup](#setup)
* [Documentation](#documentation)
* [Participer](#participer)

## Informations générales

### Todo :

* Nouveaux convertisseurs (surfaces, volumes, temps...)
* Amélioration des convertisseurs existant (nouvelles unités)
* Séparer nom de l'unité et acronyme
* Ajouter une dimension *temporelle* aux convertisseurs (faire le lien entre distance et vitesse, et pouvoir passer de l'un à l'autre facilement)

## Technologies

Application crée avec :

* NodeJS dernière version
* Express 4.17
* EJS 3.1

## Documentation

### Ajouter un convertisseur au projet

#### Créer le fichier

Les convertisseurs sont générés dynamiquement, il n'y a qu'à ajouter un fichier `.js` dans le dossier /public/convertisseurs/.

#### Ecrire le convertisseur

Afin de créer un convertisseur, il faut utiliser l'API disponible, ou bien le faire manuellement (cas déconseillé).

#### Créer le convertisseur

La fonction `creerConvertisseur(...)` vous permet de créer un nouveau convertisseur. Ensuite, vous pouvez ajouter des groupes d'entrées avec `convertisseur.creerGroupe(...)` et y ajouter des entrées avec `groupe.ajouterEntree(...)`.

#### Enregistrer le convertisseur

Maintenant que notre convertisseur est créé, il n'y a plus qu'à l'enregistrer. Il faut pour cela l'exporter sous le nom de `convertisseur`, et l'inscrire avec la fonction `enregistrerConvertisseur(...)`.

Maintenant, votre convertisseur est accessible sur le site !

## Participer

Afin de participer, vous n'avez qu'à ouvrir une pull request.
