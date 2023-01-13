const Sauces = require('../models/sauces')


exports.findsauces = (req, res, next) => {
    Sauces.find()
      .then(things => res.status(200).json(things))
      .catch(error => res.status(400).json({ error }));
  };

  exports.findonesauce = (req, res, next) => {
    Sauces.findOne({ _id: req.params.id })
      .then(thing => res.status(200).json(thing))
      .catch(error => res.status(404).json({ error }));
  };

  exports.addsauces = (req, res, next) => {
    delete req.body._id;
    const newsauces = new Sauces({
      ...req.body
    });
    newsauces.save()
      .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
      .catch(error => res.status(400).json({ error }));
  };