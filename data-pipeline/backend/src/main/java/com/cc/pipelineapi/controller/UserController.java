package com.cc.pipelineapi.controller;

import com.cc.pipelineapi.common.Result;
import com.cc.pipelineapi.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("user")
public class UserController {

    @Autowired
    UserService userService;

    @GetMapping("top-up/{name}/{amount}")
    public Result topUp(@PathVariable("name") String username, @PathVariable("amount") Integer amount) {
        userService.topUp(username, amount);
        return Result.success(null);
    }

    @GetMapping("balance/{name}")
    public Result getBalance(@PathVariable("name") String username) {
        return Result.success(userService.getBalance(username));
    }

}
