//package com.we24.cinemax.controller;
//
//import com.we24.cinemax.model.User;
//import com.we24.cinemax.service.UserService;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/users")
//@CrossOrigin("*")
//public class UserController {
//
//    private final com.we24.cinemax.service.UserService userService;
//
//    public UserController(UserService userService) {
//        this.userService = userService;
//    }
//
//    // Create User
//    @PostMapping
//    public User createUser(@RequestBody com.we24.cinemax.model.User user) {
//        return userService.createUser(user);
//    }
//
//    // Get User by ID
//    @GetMapping("/{id}")
//    public User getUser(@PathVariable Long id) {
//        return userService.getUser(id);
//    }
//
//    // Get All Users
//    @GetMapping
//    public List<User> getAllUsers() {
//        return userService.getAllUsers();
//    }
//
//    // Update User
//    @PutMapping("/{id}")
//    public User updateUser(
//            @PathVariable Long id,
//            @RequestBody User user
//    ) {
//        return userService.updateUser(id, user);
//    }
//
//    // Delete User
//    @DeleteMapping("/{id}")
//    public String deleteUser(@PathVariable Long id) {
//        userService.deleteUser(id);
//        return "User deleted successfully";
//    }
//}