const mongoose = require('mongoose');
const regurl = require('../utils/regurl');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, 'страна создания фильма - это обязательное для заполнения поле'],
  },
  director: {
    type: String,
    required: [true, 'режиссёр фильма - это обязательное для заполнения поле'],
  },
  duration: {
    type: Number,
    required: [true, 'длительность фильма - это обязательное для заполнения поле'],
  },
  year: {
    type: String,
    required: [true, 'год выпуска фильма - это обязательное для заполнения поле'],
    length: [4, 'Введите поле <год выпуска фильма> длинной 4 символа'],
  },
  description: {
    type: String,
    required: [true, 'описание фильма - это обязательное для заполнения поле'],
  },
  image: {
    type: String,
    required: [true, 'ссылка на постер к фильму - это обязательное для заполнения поле'],
    match: regurl,
  },
  trailerLink: {
    type: String,
    required: [true, 'ссылка на трейлер фильма - это обязательное для заполнения поле'],
    match: regurl,
  },
  thumbnail: {
    type: String,
    required: [true, 'миниатюрное изображение постера к фильму - это обязательное для заполнения поле'],
    match: regurl,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: [true, 'название фильма на русском языке - это обязательное для заполнения поле'],
  },
  nameEN: {
    type: String,
    required: [true, 'название фильма на английском языке - это обязательное для заполнения поле'],
  },
});
module.exports = mongoose.model('movie', movieSchema);
