const Sauces = require("../models/sauces");
//Import du package filesystem
const fs = require("fs");

//Récupération de toute les sauces
exports.findSauces = (req, res, next) => {
  Sauces.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};
//Récupération d'une sauce
exports.findOneSauce = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};
//Ajout d'une sauce
exports.addSauces = (req, res, next) => {
  const newsauces = JSON.parse(req.body.sauce);
  delete newsauces._id;
  delete newsauces._userId;
  const addSauce = new Sauces({
    ...newsauces,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });

  addSauce
    .save()
    .then(() => {
      res.status(201).json({ message: "Sauce enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//Modification d'une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  delete sauceObject._userId;
  Sauces.findOne({ _id: req.params.id })
    .then((thing) => {
      if (thing.userId != req.auth.userId) {
        res.status(403).json({ message: "Not authorized" });
      } else {
        Sauces.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          .then(() => res.status(200).json({ message: "Sauce modifiée!" }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
//Supression d'une sauce
exports.deleteSauce = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id })
    .then((thing) => {
      if (thing.userId != req.auth.userId) {
        res.status(403).json({ message: "Not authorized" });
      } else {
        const filename = thing.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauces.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Sauce supprimé !" });
            })
            .catch((error) => {
              console.log(error);
              res.status(401).json({ error });
            });
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error });
    });
};
//Système de like / dislike
exports.sysLike = (req, res, next) => {
  Sauces.findOne({ _id: req.params.id }).then((sauce) => {
    if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1)
      Sauces.updateOne(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
          $push: { usersLiked: req.body.userId },
        }
      )
        .then(() => res.status(200).json({ message: "Like" }))
        .catch((error) => res.status(400).json({ error }));
    if (sauce.usersLiked.includes(req.body.userId) && req.body.like === 0)
      Sauces.updateOne(
        { _id: req.params.id },
        {
          $inc: { likes: -1 },
          $pull: { usersLiked: req.body.userId },
        }
      )
        .then(() => res.status(200).json({ message: "" }))
        .catch((error) => res.status(400).json({ error }));
    if (!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1)
      Sauces.updateOne(
        { _id: req.params.id },
        {
          $inc: { dislikes: 1 },
          $push: { usersDisliked: req.body.userId },
        }
      )
        .then(() => res.status(200).json({ message: "Dislike" }))
        .catch((error) => res.status(400).json({ error }));
    if (sauce.usersDisliked.includes(req.body.userId) && req.body.like === 0)
      Sauces.updateOne(
        { _id: req.params.id },
        {
          $inc: { dislikes: -1 },
          $pull: { usersDisliked: req.body.userId },
        }
      )
        .then(() => res.status(200).json({ message: "" }))
        .catch((error) => res.status(400).json({ error }));
  });
};
