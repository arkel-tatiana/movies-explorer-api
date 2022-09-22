const Movie = require('../models/movie');
const NotFoundError = require('../error/NotFoundError');
const DeleteError = require('../error/DeleteError');
const ValidationError = require('../error/ValidationError');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send({ data: movies }))
    .catch((err) => next(err));
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найдена');
      }
      const movieOwner = movie.owner.toString();
      if (movieOwner !== req.user._id) {
        throw new DeleteError('Вы не можите удалить фильм другого пользователя');
      }
      return Movie.findByIdAndRemove(req.params.id)
        .then((movieDelete) => {
          res.status(200).send({ data: movieDelete });
        });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные для запроса'));
      }
      return next(err);
    });
};

const createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image,
    trailerLink, thumbnail, movieId, nameRU, nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationError(err.message));
      }
      return next(err);
    });
};
module.exports = {
  getMovies, deleteMovie, createMovie,
};
