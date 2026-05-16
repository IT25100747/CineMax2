package com.we24.cinemax.service;

import com.we24.cinemax.entity.Movie;
import com.we24.cinemax.entity.User;
import com.we24.cinemax.model.MovieRequest;
import com.we24.cinemax.model.MovieResponse;
import com.we24.cinemax.repository.MovieRepository;
import com.we24.cinemax.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MovieServiceImpl implements MovieService {

    private final MovieRepository movieRepository;
    private final UserRepository userRepository;

    public MovieServiceImpl(
            MovieRepository movieRepository,
            UserRepository userRepository
    ) {
        this.movieRepository = movieRepository;
        this.userRepository = userRepository;
    }

    @Override
    public MovieResponse addMovie(MovieRequest request) {
        checkAdmin();

        Movie movie = new Movie();
        setMovieData(movie, request);

        Movie savedMovie = movieRepository.save(movie);

        return new MovieResponse(savedMovie);
    }

    @Override
    public List<MovieResponse> getAllMovies() {
        return movieRepository.findAll()
                .stream()
                .map(MovieResponse::new)
                .toList();
    }

    @Override
    public MovieResponse getMovieById(Long id) {
        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        return new MovieResponse(movie);
    }

    @Override
    public MovieResponse updateMovie(Long id, MovieRequest request) {
        checkAdmin();

        Movie movie = movieRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        setMovieData(movie, request);

        Movie updatedMovie = movieRepository.save(movie);

        return new MovieResponse(updatedMovie);
    }

    @Override
    public void deleteMovie(Long id) {
        checkAdmin();

        if (!movieRepository.existsById(id)) {
            throw new RuntimeException("Movie not found");
        }

        movieRepository.deleteById(id);
    }

    private void setMovieData(Movie movie, MovieRequest request) {
        movie.setMovieName(request.getMovieName());
        movie.setGenre(request.getGenre());
        movie.setRating(request.getRating());
        movie.setStatus(request.getStatus());
        movie.setMovieTime(request.getMovieTime());
        movie.setDescription(request.getDescription());
        movie.setCast(request.getCast());
        movie.setPosterUrl(request.getPosterUrl());
    }

    private void checkAdmin() {
        String gmail = SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();

        User loggedUser = userRepository.findByGmail(gmail)
                .orElseThrow(() -> new RuntimeException("Logged user not found"));

        if (!"ADMIN".equalsIgnoreCase(loggedUser.getRole())) {
            throw new RuntimeException("Only admin can manage movies");
        }
    }
}