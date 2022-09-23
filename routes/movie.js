const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { isValidObjectId } = require('mongoose');
const validator = require('validator');
const { auth } = require('../middlewares/auth');
const {
  getMovies, deleteMovie, createMovie,
} = require('../controllers/movies');
// const regurl = require('../utils/regurl');
const ValidationError = require('../error/ValidationError');

const castLinkErorr = (value) => {
  if (!validator.isURL(value)) {
    throw new ValidationError('Введен некорректный адрес ссылки');
  } else {
    return value;
  }
};
const castErorr = (value) => {
  if (!isValidObjectId(value)) {
    throw new ValidationError('Введены некорректные данные');
  } else {
    return value;
  }
};
router.get('/movies/', auth, getMovies);
router.post('/movies/', auth, celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required().min(4).max(4),
    description: Joi.string().required(),
    image: Joi.string().required().custom(castLinkErorr, 'custom validation'),
    trailerLink: Joi.string().required().custom(castLinkErorr, 'custom validation'),
    thumbnail: Joi.string().required().custom(castLinkErorr, 'custom validation'),
    // pattern(regurl),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);
router.delete('/movies/:id', auth, celebrate({
  params: Joi.object().keys({
    id: Joi.string().custom(castErorr, 'custom validation'),
  }),
}), deleteMovie);

module.exports = router;
