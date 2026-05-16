//package com.we24.cinemax.service;
//
//import com.we24.cinemax.model.User;
//import com.we24.cinemax.repository.UserRepository;
//import org.springframework.stereotype.Service;
//
//import java.util.List;
//
//@Service
//public class UserService {
//
//    private final UserRepository userRepository;
//
//    public UserService(UserRepository userRepository) {
//        this.userRepository = userRepository;
//    }
//
//    public User createUser(User user) {
//        return userRepository.save(user);
//    }
//
//    public User getUser(Long id) {
//        return userRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
//    }
//
//    public List<User> getAllUsers() {
//        return userRepository.findAll();
//    }
//
//    public User updateUser(Long id, User updatedUser) {
//        User existingUser = getUser(id);
//
//        existingUser.setName(updatedUser.getName());
//        existingUser.setEmail(updatedUser.getEmail());
//        existingUser.setPhone(updatedUser.getPhone());
//
//        return userRepository.save(existingUser);
//    }
//
//    public void deleteUser(Long id) {
//        User existingUser = getUser(id);
//        userRepository.delete(existingUser);
//    }
//}