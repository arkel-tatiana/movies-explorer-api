const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { isValidObjectId } = require('mongoose');
const { auth } = require('../middlewares/auth');
const {
  getMovies, deleteMovie, createMovie,
} = require('../controllers/movies');
const regurl = require('../utils/regurl');
const ValidationError = require('../error/ValidationError');

const castErorr = (value) => {
  if (!isValidObjectId(value)) {
    throw new ValidationError('Введены некорректные данные');
  } else {
    return value;
  }
};
router.get('/', auth, getMovies);
router.post('/', auth, celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required().min(4).max(4),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(regurl),
    trailerLink: Joi.string().required().pattern(regurl),
    thumbnail: Joi.string().required().pattern(regurl),
    movieId: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);
router.delete('/:id', auth, celebrate({
  params: Joi.object().keys({
    id: Joi.string().custom(castErorr, 'custom validation'),
  }),
}), deleteMovie);
// router.put('/:movieId/likes', auth, celebrate({
//  params: Joi.object().keys({
//    cardId: Joi.string().alphanum().length(24),
//  }),
// }), likeMovie);
// router.delete('/:movieId/likes', auth, celebrate({
//  params: Joi.object().keys({
//    cardId: Joi.string().alphanum().length(24),
//  }),
// }), dislikeMovie);

module.exports = router;
